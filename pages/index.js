import { useState } from "react";
import Head from "next/head";

import HeaderBar from "@/components/HeaderBar";
import GraphTile from "@/components/GraphTile";
import {
  StackedAreaChart,
  SimpleBarChart,
  DonutChart,
} from "@carbon/charts-react";

import { Grid, Row, Column, Dropdown } from "carbon-components-react";

import { volume } from "@/api/volume";
import { orderCount } from "@/api/orderCount";
import { userCount } from "@/api/userCount";

import config from "../config.json";

export default function Home(props) {
  const marketItems = Object.keys(config["markets"]).map((marketId) => ({
    id: marketId,
    text: config["markets"][marketId],
  }));
  const [currentItem, setCurrentItem] = useState(marketItems[0]);

  console.log(props.eachMarketVolume);
  return (
    <>
      <Head>
        <title>{config["title"]}</title>
      </Head>
      <HeaderBar />
      <Grid narrow>
        <Row>
          <Column sm={16} md={8} lg={6}>
            <GraphTile>
              <StackedAreaChart
                data={props.volume.map((entry) => ({
                  group: config["markets"][entry.market_id],
                  date: JSON.parse(entry.date),
                  value: entry.volume,
                }))}
                options={{
                  title: "Volume of orders placed (in USDC)",
                  axes: {
                    left: {
                      stacked: true,
                      scaleType: "linear",
                      mapsTo: "value",
                    },
                    bottom: {
                      scaleType: "time",
                      mapsTo: "date",
                    },
                  },
                  curve: "curveMonotoneX",
                  height: "400px",
                }}
              />
            </GraphTile>
          </Column>
          <Column sm={12} md={4} lg={3}>
            <GraphTile>
              <DonutChart
                data={props.volumeTotal.map((entry) => ({
                  group: config["markets"][entry.market_id],
                  value: entry.volume,
                }))}
                options={{
                  title: "Volume of orders placed (in USDC) by market",
                  resizable: true,
                  donut: {
                    center: {
                      label: "USDC",
                    },
                    alignment: "center",
                  },
                  height: "400px",
                  legend: {
                    alignment: "center",
                  },
                }}
              />
            </GraphTile>
          </Column>
          <Column sm={12} md={4} lg={3}>
            <GraphTile>
              <DonutChart
                data={[
                  {
                    group: "User Count",
                    value: props.userCountTotal[0].user_count,
                  },
                ]}
                options={{
                  title: "Total number of users",
                  resizable: true,
                  donut: {
                    center: {
                      label: "users",
                    },
                    alignment: "center",
                  },
                  height: "400px",
                  legend: {
                    alignment: "center",
                  },
                }}
              />
            </GraphTile>
          </Column>
          <Column sm={12} md={12} lg={6}>
            <GraphTile>
              <StackedAreaChart
                data={props.orderCount.map((entry) => ({
                  group: entry.type,
                  date: JSON.parse(entry.date),
                  value: parseInt(entry.order_count),
                }))}
                options={{
                  title: "Number of orders",
                  axes: {
                    left: {
                      mapsTo: "value",
                      stacked: true,
                    },
                    bottom: {
                      mapsTo: "date",
                      scaleType: "time",
                    },
                  },
                  height: "400px",
                }}
              />
            </GraphTile>
          </Column>
          <Column sm={12} md={12} lg={6}>
            <GraphTile>
              <SimpleBarChart
                data={props.userCount.map((entry) => ({
                  group: "User Count",
                  date: JSON.parse(entry.date),
                  value: entry.user_count,
                }))}
                options={{
                  title: "Number of users",
                  axes: {
                    left: {
                      mapsTo: "value",
                    },
                    bottom: {
                      mapsTo: "date",
                      scaleType: "time",
                    },
                  },
                  height: "25rem",
                }}
              />
            </GraphTile>
          </Column>
          <Column sm={12} md={12} lg={12}>
            <GraphTile>
              <Dropdown
                style={{ marginBottom: "2rem" }}
                id="default"
                titleText="Volume by market"
                selectedItem={currentItem}
                onChange={({ selectedItem }) => setCurrentItem(selectedItem)}
                items={marketItems}
                itemToString={(item) => (item ? item.text : "")}
              />

              <StackedAreaChart
                data={props.eachMarketVolume[currentItem.id].map((entry) => ({
                  group: config["markets"][currentItem.id],
                  date: JSON.parse(entry.date),
                  value: entry.volume,
                }))}
                options={{
                  title:
                    config["markets"][currentItem.id] +
                    ": Volume of orders placed (in USDC)",
                  axes: {
                    left: {
                      stacked: true,
                      scaleType: "linear",
                      mapsTo: "value",
                    },
                    bottom: {
                      scaleType: "time",
                      mapsTo: "date",
                    },
                  },
                  curve: "curveMonotoneX",
                  zoomBar: {
                    top: {
                      enabled: true,
                    },
                  },
                  height: "500px",
                }}
              />
            </GraphTile>
          </Column>
        </Row>
      </Grid>
    </>
  );
}

export async function getStaticProps() {
  const stringifyDates = (array) => {
    return array.map((entry) => ({
      ...entry,
      date: JSON.stringify(entry.date),
    }));
  };
  const volumeRes = await volume({
    lastHours: 24,
    groupBy: "hour",
  });
  const volumeTotalRes = await volume({
    lastHours: 24,
  });
  const userCountRes = await userCount({
    lastHours: 24,
    groupBy: "hour",
  });
  const userCountTotalRes = await userCount({
    lastHours: 24,
  });
  const orderCountRes = await orderCount({
    lastHours: 24,
    groupBy: "hour",
  });
  const eachMarketVolumeRes = {};
  for (let marketId in config["markets"]) {
    eachMarketVolumeRes[marketId] = stringifyDates(
      await volume({
        lastHours: 24,
        marketId: marketId,
        groupBy: "hour",
      })
    );
  }

  return {
    props: {
      volume: stringifyDates(volumeRes),
      volumeTotal: volumeTotalRes,
      userCount: stringifyDates(userCountRes),
      userCountTotal: userCountTotalRes,
      orderCount: stringifyDates(orderCountRes),
      eachMarketVolume: eachMarketVolumeRes,
    },
    revalidate: 10, // ISR
  };
}
