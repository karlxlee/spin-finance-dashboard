import toNanoTimestamps from "@/utils/toNanoTimestamps";
import { indexer, QueryTypes } from "@/utils/indexer";

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
        WHERE receiver_account_id = 'app_2.spin_swap.testnet'
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
        },
      }
    );
    console.log(receipts);
    return receipts;
  } catch (error) {
    console.log(error);
  }
}

// /** @type {import('@sveltejs/kit').RequestHandler} */
// export async function get({ url }) {
//   const data = await orderCount(
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

// export default function handler(req, res) {
//   res.status(200).json({ name: "John Doe" });
// }
