import Head from "next/head";
import config from "../config.json";
import UI from "@/dashboard/UI";
import Data from "@/dashboard/Data";
import Footer from "@/components/Footer";

export default function Home(props) {
  return (
    <>
      <Head>
        <title>
          {config["title"] + " - past " + props.timeframe + " hours"}
        </title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <UI {...props} />
      <Footer />
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
