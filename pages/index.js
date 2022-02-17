import Head from "next/head";
import config from "../config.json";
import UI from "@/dashboard/UI";
import Data from "@/dashboard/Data";

export default function Home(props) {
  return (
    <>
      <Head>
        <title>
          {config["title"] + " - past " + props.timeframe + " hours"}
        </title>
      </Head>
      <UI {...props} />
    </>
  );
}

export async function getStaticProps() {
  const fetchedData = await Data(Object.keys(config["timeframes"])[0]);
  return {
    props: {
      ...fetchedData,
    },
    revalidate: 10, // ISR
  };
}
