import toNanoTimestamps from "@/utils/toNanoTimestamps";
import { indexer, QueryTypes } from "@/utils/indexer";

// async function logToVolume(log) {
//   const tokens = ["spfi_skyward.testnet", "spfi_paras.testnet", "near.near"];
//   // const tokens = ["spfi_paras.testnet"];
//   if (tokens.some((token) => log.includes(token))) {
//     let token = tokens.filter((token) => log.includes(token))[0];
//     console.log(log);
//     console.log(token);
//     let volume = parseInt(log.split("(")[0].match(/\d+/g)) || 0;
//     return { token, volume };
//   }
// }

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
          WHERE receiver_account_id = 'app_2.spin_swap.testnet'
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
      },
    });
    marketId && console.log(receipts);
    // let volume = {};
    // let dateVolume = {};
    // for (let receipt of receipts) {
    //   const outcomes = await txResult(
    //     receipt.originated_from_transaction_hash,
    //     receipt.predecessor_account_id
    //   ).then((r) => r.result.receipts_outcome);

    //   for (let outcome of outcomes) {
    //     let logs = outcome.outcome.logs;
    //     if (logs.length >= 3) {
    //       for (let log of logs) {
    //         const checkVolume = await logToVolume(log);
    //         if (checkVolume) {
    //           if (groupBy) {
    //             !(checkVolume.token in dateVolume) &&
    //               (dateVolume[checkVolume.token] = {});
    //             if (receipt.date in dateVolume[checkVolume.token]) {
    //               dateVolume[checkVolume.token][receipt.date] +=
    //                 checkVolume.volume;
    //             } else {
    //               dateVolume[checkVolume.token][receipt.date] =
    //                 0 + checkVolume.volume;
    //             }
    //           } else {
    //             checkVolume.token in volume
    //               ? (volume[checkVolume.token] += checkVolume.volume)
    //               : (volume[checkVolume.token] = 0 + checkVolume.volume);
    //           }
    //         }
    //       }
    //     }
    //   }
    // }

    // let dateVolumeArray = Object.keys(dateVolume)
    //   .map((token) =>
    //     Object.keys(dateVolume[token]).map((date) => {
    //       return {
    //         token,
    //         date,
    //         volume: dateVolume[token][date],
    //       };
    //     })
    //   )
    //   .flat();

    // console.log(dateVolume);
    // console.log(volume);

    return receipts;
  } catch (error) {
    console.log(error);
  }
}

// /** @type {import('@sveltejs/kit').RequestHandler} */
// export async function get({ url }) {
//   const data = await volume(
//     [...url.searchParams].reduce(
//       (object, [key, value]) => ((object[key] = value), object),
//       {}
//     )
//   );

//   if (data) {
//     return {
//       body: {
//         data,
//       },
//     };
//   }

//   return {
//     status: 404,
//   };
// }
