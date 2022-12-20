import styles from "../../styles/Home.module.css";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  return (
    <div className={styles.header}>
      <div className={styles.headerIcon}>AnnaSwap</div>
      <ul className={styles.headerNavbar}>
        <li onClick={() => router.push("/")}>Home</li>
        <li onClick={() => router.push("Marketplace")}>Marketplace</li>
        <li onClick={() => router.push("Invest")}>Invest</li>
        <li onClick={() => router.push("Dex")}>DEX</li>
        <li onClick={() => router.push("Governance")}>Governance</li>
        <li onClick={() => router.push("Career")}>Career</li>
        <li onClick={() => router.push("AboutUs")}>About us</li>
      </ul>
    </div>
  );
};

export default Header;
