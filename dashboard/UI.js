import { useState } from "react";
import HeaderBar from "@/components/HeaderBar";
import GraphTile from "@/components/GraphTile";
import {
  StackedAreaChart,
  SimpleBarChart,
  DonutChart,
} from "@carbon/charts-react";
import { Grid, Row, Column, Dropdown } from "carbon-components-react";
import config from "../config.json";

export default function UI(props) {
  const [currentItem, setCurrentItem] = useState(props.marketItems[0]);

  return (
    <>
      <HeaderBar />
      <Grid narrow>
        <Row>
          <Column sm={16} md={8} lg={6}>
            <GraphTile>
              <StackedAreaChart
                data={props.volume}
                options={{
                  title: "Volume of orders placed (in USDC)",
                  data: {
                    loading: props ? false : true,
                  },
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
                data={props.volumeTotal}
                options={{
                  title: "Volume of orders placed (in USDC) by market",
                  data: {
                    loading: props ? false : true,
                  },
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
                    value: props.userCountTotal,
                  },
                ]}
                options={{
                  title: "Total number of users",
                  data: {
                    loading: props ? false : true,
                  },
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
                data={props.orderCount}
                options={{
                  title: "Number of orders",
                  zoomBar: {
                    top: {
                      enabled: true,
                    },
                  },
                  data: {
                    loading: props ? false : true,
                  },
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
                  height: "440px",
                }}
              />
            </GraphTile>
          </Column>
          <Column sm={12} md={12} lg={6}>
            <GraphTile>
              <SimpleBarChart
                data={props.userCount}
                options={{
                  title: "Number of users",
                  zoomBar: {
                    top: {
                      enabled: true,
                    },
                  },
                  data: {
                    loading: props ? false : true,
                  },
                  axes: {
                    left: {
                      mapsTo: "value",
                    },
                    bottom: {
                      mapsTo: "date",
                      scaleType: "time",
                      domain: [
                        props.userCount[0]["date"],
                        props.userCount[props.userCount.length - 1]["date"],
                      ],
                    },
                  },
                  height: "440px",
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
                items={props.marketItems}
                itemToString={(item) => (item ? item.text : "")}
              />

              <StackedAreaChart
                data={props.eachMarketVolume[currentItem.id]}
                options={{
                  title:
                    config["markets"][currentItem.id] +
                    ": Volume of orders placed (in USDC)",
                  data: {
                    loading: props ? false : true,
                  },
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
