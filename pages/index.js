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

export async function getStaticProps() {
  const fetchedData = await Data(Object.keys(config["timeframes"])[0]);
  return {
    props: {
      ...fetchedData,
    },
    revalidate: 10, // ISR
  };
}
