import { useRouter } from "next/router";
import styles from "../../styles/Home.module.scss";

const NavBar = ({ links }) => {
  const router = useRouter();
  return (
    <div className={styles.mainNavBar}>
      {links.map((element) => (
        <div key={links.indexOf(element)} onClick={() => router.push(element)}>
          {element}
        </div>
      ))}
    </div>
  );
};

export default NavBar;
