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

export async function getStaticProps({ params }) {
  const fetchedData = await Data(params.timeframe);

  return {
    props: {
      ...fetchedData,
    },
    revalidate: 10, // ISR
  };
}

export async function getStaticPaths() {
  return {
    paths: [
      ...Object.keys(config["timeframes"]).map((timeframe) => ({
        params: {
          timeframe: timeframe,
        },
      })),
    ],

    fallback: "blocking", // false or 'blocking'
  };
}
