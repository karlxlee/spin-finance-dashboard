import toNanoTimestamps from "@/utils/toNanoTimestamps";
import { indexer, QueryTypes } from "@/utils/indexer";

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
        WHERE receiver_account_id = 'app_2.spin_swap.testnet'
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
        },
      }
    );
    return receipts;
  } catch (error) {
    console.log(error);
  }
}

// /** @type {import('@sveltejs/kit').RequestHandler} */
// export async function get({ url }) {
//   const data = await userCount(
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
