import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Anna</title>
        <meta name="description" content="DeFi protocol" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Welcome to yet another DEX</h1>
        <h2>Countdown clock</h2>
        <h2>3D animation</h2>
        <h2>Some random sale pitch and text</h2>
      </main>
    </>
  );
}
