import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.scss";
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
        <link rel="icon" href="" />
      </Head>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>Welcome to ANNA</h1>
          <div className={styles.heroText}>
            A state of art defi all-inclusive exchange, NFT, games and
            educational protocol created for you to be the ultimate owner and
            make money as part of the journey. How to be the owner? When? Make
            money? Read further...
          </div>
          <div className={styles.heroText}>
            <h1>What do I do with the ANNA token?</h1>
            ANNA tokens can be staked in the staking pool to earn 2 type of
            rewards.
          </div>
          <div className={styles.heroText}>
            <h1>What are the rewards for staking ANNA tokens?</h1>
            Staking ANNA tokens allows the protocol to share its profits with
            the holders. Furthermore, staking ANNA tokens rewards holders with
            gANNA tokens that allows some individual to buy over this entire
            protocol for a certain amount of gANNA.
          </div>
          <div className={styles.heroText}>
            <h1>How does the protocol make money?</h1>
            There are various revenue streams:
            <ul>
              <li>DEX exchange fees</li>
              <li>
                Service revenue generated from ANNA offerings such as
                educational couses, crypto index funds, binary options etc.
              </li>
              <li>
                Marketplace revenue generated from creation and trading of
                digital assets
              </li>
              <li>Protocol revenue generated form ongoing operations</li>
              <li>Partnership revenue generated from investors and sponsors</li>
            </ul>
          </div>
          <div className={styles.heroText}>
            <h1>What is gAnna?</h1>
            gANNA is an ERC20 tokens with a fixed supply of 19.99k. gANNA cannot
            be initially bought but only earned via staking ANNA tokens via the
            staking pool. The ownership of the entire ANNA protocol will be
            transferred to the first user with 10k gANNA to claim ownership.
          </div>
        </div>
        <Image src={economy} layout="responsive" alt="" />
        <Image src={roadmap} layout="responsive" alt="" />
        <h2>Countdown clock</h2>
        <h2>3D animation</h2>
        <h2>Meet the team</h2>
      </main>
    </>
  );
}
