import toNanoTimestamps from "@/utils/toNanoTimestamps";
import { indexer, QueryTypes } from "@/utils/indexer";

// Accepts UNIX timestamps
export async function orders({ startTimestamp, endTimestamp, lastHours }) {
  let startTimestampNano;
  let endTimestampNano;
  try {
    if (lastHours) {
      endTimestampNano = Math.round(new Date().getTime() * 10 ** 6);
      startTimestampNano = endTimestampNano - lastHours * 60 * 60 * 10 ** 9;
      console.log(endTimestampNano);
      console.log(startTimestampNano);
    } else {
      startTimestampNano = startTimestamp * 10 ** 9;
      endTimestampNano = endTimestamp * 10 ** 9;
    }
    const receipts = await indexer.query(
      `
        SELECT * FROM public.receipts JOIN public.action_receipt_actions
        ON public.action_receipt_actions.receipt_id = public.receipts.receipt_id
        WHERE receiver_account_id = 'app_2.spin_swap.testnet'
        AND included_in_block_timestamp >= :startTimestampNano
        AND included_in_block_timestamp <= :endTimestampNano
        AND args->'method_name' IS NOT NULL
        ORDER BY included_in_block_timestamp DESC
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          startTimestampNano,
          endTimestampNano,
        },
      }
    );
    // const bids = receipts.filter((entry) => entry.args.method_name == "bid");
    // const asks = receipts.filter((entry) => entry.args.method_name == "ask");
    // const dropped = receipts.filter(
    //   (entry) => entry.args.method_name == "drop_order"
    // );

    return receipts;
  } catch (error) {
    console.log(error);
  }
}

// /** @type {import('@sveltejs/kit').RequestHandler} */
// export async function get({ url }) {
//   const data = await orders(
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
