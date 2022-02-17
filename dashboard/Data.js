import { volume } from "@/api/volume";
import { orderCount } from "@/api/orderCount";
import { userCount } from "@/api/userCount";
import config from "../config.json";

export default async function Data(timeframe) {
  const marketItems = Object.keys(config["markets"]).map((marketId) => ({
    id: marketId,
    text: config["markets"][marketId],
  }));

  const volumeRes = await volume({
    lastHours: timeframe,
    groupBy: "hour",
  }).then((r) =>
    r.map((entry) => ({
      group: config["markets"][entry.market_id],
      date: new Date(entry.date).getTime(),
      value: entry.volume,
    }))
  );
  const volumeTotalRes = await volume({
    lastHours: timeframe,
  }).then((r) =>
    r.map((entry) => ({
      group: config["markets"][entry.market_id],
      value: entry.volume,
    }))
  );
  const userCountRes = await userCount({
    lastHours: timeframe,
    groupBy: "hour",
  }).then((r) =>
    r.map((entry) => ({
      group: "User Count",
      date: new Date(entry.date).getTime(),
      value: entry.user_count,
    }))
  );
  const userCountTotalRes = await userCount({
    lastHours: timeframe,
  }).then((r) => r[0].user_count);
  const orderCountRes = await orderCount({
    lastHours: timeframe,
    groupBy: "hour",
  }).then((r) =>
    r.map((entry) => ({
      group: entry.type,
      date: new Date(entry.date).getTime(),
      value: parseInt(entry.order_count),
    }))
  );
  const eachMarketVolumeRes = {};
  for (let marketId in config["markets"]) {
    eachMarketVolumeRes[marketId] = await volume({
      lastHours: timeframe,
      marketId: marketId,
      groupBy: "hour",
    }).then((r) =>
      r.map((entry) => ({
        group: config["markets"][marketId],
        date: new Date(entry.date).getTime(),
        value: entry.volume,
      }))
    );
  }

  return {
    timeframe,
    marketItems,
    volume: volumeRes,
    volumeTotal: volumeTotalRes,
    userCount: userCountRes,
    userCountTotal: userCountTotalRes,
    orderCount: orderCountRes,
    eachMarketVolume: eachMarketVolumeRes,
  };
}
