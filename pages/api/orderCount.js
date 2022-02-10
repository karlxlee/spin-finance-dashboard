import toNanoTimestamps from "@/utils/toNanoTimestamps";
import { indexer, QueryTypes } from "@/utils/indexer";
import config from "../../config.json";

// Accepts UNIX timestamps
export async function orderCount({
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
        COUNT(DISTINCT public.receipts.receipt_id) as ORDER_COUNT,
        args->>'method_name' as TYPE
        FROM public.receipts JOIN public.action_receipt_actions
        ON public.action_receipt_actions.receipt_id = public.receipts.receipt_id
        WHERE receiver_account_id = :spinAccount
        AND included_in_block_timestamp >= :startNanoTimestamp
        AND included_in_block_timestamp <= :endNanoTimestamp
        AND args->>'method_name' = ANY(ARRAY ['ask', 'bid'])
    `;
    const receipts = await indexer.query(
      groupBy
        ? `SELECT DATE_TRUNC(:groupBy, to_timestamp(included_in_block_timestamp/10e8)) as DATE, ` +
            baseQuery +
            ` GROUP BY DATE, TYPE`
        : `SELECT ` + baseQuery + ` GROUP BY TYPE`,
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
    console.log(receipts);
    return receipts;
  } catch (error) {
    console.log(error);
  }
}

export default async function handler(req, res) {
  const { query } = req;
  try {
    const result = await orderCount({ ...query });
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: "failed to load data" });
  }
}
