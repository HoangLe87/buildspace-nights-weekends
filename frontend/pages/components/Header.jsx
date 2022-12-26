import styles from "../../styles/Home.module.scss";
import { useRouter } from "next/router";

const Header = ({ currentAccount, setCurrentAccount }) => {
  const router = useRouter();

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerIcon}>ANNA</div>
      <ul className={styles.headerNavBar}>
        <li onClick={() => router.push("/")}>Home</li>
        <li onClick={() => router.push("Exchange")}>Exchange</li>
        <li onClick={() => router.push("AboutUs")}>About us</li>
        <li onClick={() => router.push("Dashboard")}>Dashboard</li>
        {!currentAccount && (
          <li>
            <button className={styles.connectButton} onClick={connectWallet}>
              Connect
            </button>
          </li>
        )}
        {currentAccount && (
          <li>
            <button className={styles.connectButton}>{currentAccount}</button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Header;
