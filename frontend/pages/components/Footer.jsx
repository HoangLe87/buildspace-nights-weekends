import styles from "../../styles/Home.module.scss";
import { FaBeer, SiGitbook } from "react-icons/si";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div>All rights reserved © ANNA</div>
      <a href="https://anna-21.gitbook.io/product-docs/">
        <SiGitbook />
      </a>
    </div>
  );
};

export default Footer;
