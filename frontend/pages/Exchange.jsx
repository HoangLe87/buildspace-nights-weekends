import styles from "../styles/Home.module.scss";
import NavBar from "./components/NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Exchange = () => {
  const links = ["Exchange", "Pools"];

  const swap = () => {
    try {
      toast("test");
    } catch (error) {
      toast.error("Upps, someting went wrong");
    }
  };
  return (
    <main className={styles.tradeMain}>
      <ToastContainer position="top-right" />
      <NavBar links={links} />
      <div className={styles.tradeBox}>
        <div className={styles.tradeBoxTop}>
          <div className={styles.tradeBoxLeft}>
            <input id="token1Amount" type="number" placeholder="0"></input>
            <div>e</div>
          </div>
          <div>
            <select defaultValue="default" name="token1">
              <option value="default">Token</option>
              <option value="volvo">Volvo</option>
              <option value="saab">Saab</option>
              <option value="mercedes">Mercedes</option>
              <option value="audi">Audi</option>
            </select>
            <div>
              BUY
              <button> Max</button>
            </div>
          </div>
        </div>
        <div className={styles.tradeBoxBottom}>
          <div className={styles.tradeBoxLeft}>
            <input id="token2Amount" type="number" placeholder="0"></input>
            <div>e</div>
          </div>
          <div>
            <select defaultValue="default" name="token2">
              <option value="default">Token</option>
              <option value="volvo">Volvo</option>
              <option value="saab">Saab</option>
              <option value="mercedes">Mercedes</option>
              <option value="audi">Audi</option>
            </select>
            <div>
              SELL
              <button> Max</button>
            </div>
          </div>
        </div>
        <button className={styles.button} onClick={swap}>
          Swap
        </button>
      </div>
    </main>
  );
};

export default Exchange;
