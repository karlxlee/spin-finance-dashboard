import toNanoTimestamps from "@/utils/toNanoTimestamps";
import { indexer, QueryTypes } from "@/utils/indexer";
import config from "../../config.json";

// Accepts UNIX timestamps
export async function userCount({
  startTimestamp,
  endTimestamp,
  lastHours,
  groupBy,
}) {
  try {
    const [startNanoTimestamp, endNanoTimestamp] = await toNanoTimestamps({
      startTimestamp,
      endTimestamp,
      lastHours,
    });

    const baseQuery = `
        COUNT(DISTINCT predecessor_account_id) as user_count
        FROM public.receipts JOIN public.action_receipt_actions
        ON public.action_receipt_actions.receipt_id = public.receipts.receipt_id
        WHERE receiver_account_id = :spinAccount
        AND included_in_block_timestamp >= :startNanoTimestamp
        AND included_in_block_timestamp <= :endNanoTimestamp
        AND args->>'method_name' = ANY(ARRAY ['ask', 'bid', 'drop_order'])
    `;
    const receipts = await indexer.query(
      groupBy
        ? `SELECT DATE_TRUNC(:groupBy, to_timestamp(included_in_block_timestamp/10e8)) as DATE, ` +
            baseQuery +
            ` GROUP BY DATE`
        : `SELECT ` + baseQuery,
      {
        type: QueryTypes.SELECT,
        replacements: {
          startNanoTimestamp,
          endNanoTimestamp,
          groupBy,
          spinAccount: config["account"],
        },
      }
    );
    return receipts;
  } catch (error) {
    console.log(error);
  }
}

export default async function handler(req, res) {
  const { query } = req;
  try {
    const result = await userCount({ ...query });
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: "failed to load data" });
  }
}
