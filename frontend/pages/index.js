import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import roadmap from "../public/roadmap.png";
import economy from "../public/economy.png";

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
        <div className={styles.hero}>
          <h1>Welcome to ANNA</h1>
          <p className={styles.heroText}>
            a state of art decentralised finance protocol to allow normal people
            to leverage the blockchain and make the most of the latest tech
          </p>
        </div>
        <Image
          src={economy}
          layout="responsive"
          sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
          alt=""
        />
        <Image
          src={roadmap}
          layout="responsive"
          sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
          alt=""
        />
        <h2>Countdown clock</h2>
        <h2>3D animation</h2>
        <h2>Meet the team</h2>
      </main>
    </>
  );
}
