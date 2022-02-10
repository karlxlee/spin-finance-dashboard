import toNanoTimestamps from "@/utils/toNanoTimestamps";
import { indexer, QueryTypes } from "@/utils/indexer";
import config from "../../config.json";

// Accepts UNIX timestamps
export async function volume({
  startTimestamp,
  endTimestamp,
  lastHours,
  groupBy,
  marketId,
}) {
  try {
    const [startNanoTimestamp, endNanoTimestamp] = await toNanoTimestamps({
      startTimestamp,
      endTimestamp,
      lastHours,
      spinAccount: config["account"],
    });

    const selectVolume = `
        SUM(
            (args->'args_json'->>'quantity')::float/10e24 * (args->'args_json'->>'price')::float/10e24
          ) AS VOLUME
      `;

    const selectDate = `
        DATE_TRUNC(:groupBy, to_timestamp(included_in_block_timestamp/10e8)) as DATE
      `;

    const selectMarketId = `
        args->'args_json'->>'market_id' as MARKET_ID
      `;

    const baseQuery = `
          FROM public.receipts JOIN public.action_receipt_actions
          ON public.action_receipt_actions.receipt_id = public.receipts.receipt_id
          WHERE receiver_account_id = :spinAccount
          AND included_in_block_timestamp >= :startNanoTimestamp
          AND included_in_block_timestamp <= :endNanoTimestamp
          AND args->>'method_name' = ANY(ARRAY ['ask', 'bid'])
        `;

    const filters =
      marketId && ` AND args->'args_json'->>'market_id' = :marketId`;

    let query;
    if (marketId == "all" && !groupBy) {
      query = `SELECT ` + selectVolume + baseQuery;
    } else if (marketId == "all" && groupBy) {
      query =
        `SELECT ` +
        selectVolume +
        `,` +
        selectDate +
        baseQuery +
        ` GROUP BY DATE`;
    } else if (marketId && marketId != "all" && !groupBy) {
      query = `SELECT ` + selectVolume + baseQuery + filters;
    } else if (marketId && marketId != "all" && groupBy) {
      query =
        `SELECT ` +
        selectVolume +
        `,` +
        selectDate +
        baseQuery +
        filters +
        ` GROUP BY DATE`;
    } else if (!marketId && groupBy) {
      query =
        `SELECT ` +
        selectMarketId +
        `,` +
        selectVolume +
        `,` +
        selectDate +
        baseQuery +
        ` GROUP BY DATE, MARKET_ID`;
    } else if (!marketId && !groupBy) {
      query =
        `SELECT ` +
        selectMarketId +
        `,` +
        selectVolume +
        baseQuery +
        ` GROUP BY MARKET_ID`;
    } else {
      console.log(
        "Heads up, this api request combination of url params is not available. Please check the api endpoint."
      );
    }

    const receipts = await indexer.query(query, {
      type: QueryTypes.SELECT,
      replacements: {
        startNanoTimestamp,
        endNanoTimestamp,
        groupBy,
        marketId,
        spinAccount: config["account"],
      },
    });
    marketId && console.log(receipts);

    return receipts;
  } catch (error) {
    console.log(error);
  }
}

export default async function handler(req, res) {
  const { query } = req;
  try {
    const result = await volume({ ...query });
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: "failed to load data" });
  }
}
