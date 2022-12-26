import styles from "../styles/Home.module.scss";
import NavBar from "./components/NavBar";
import { ethers } from "ethers";
import abi from "../public/static/exchangeFactory.json";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

const Create = () => {
  const EXCHANGE_FACTORY = "0xA3f3a8fe01814BD7e1E82f1A388Fa4cd387ebaD8";
  const links = ["Exchange", "Pools", "Create"];
  const [input, setInput] = useState({
    token1: "",
    token1Address: "",
    token2: "",
    token2Address: "",
  });
  const addPool = async (e) => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        toast.error("Please intall metamask");
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        EXCHANGE_FACTORY,
        abi.abi,
        signer
      );
      const result = await connectedContract.createExchangeBySymbol(
        input.token1,
        input.token1Address,
        input.token2,
        input.token2Address
      );
      setInput({
        token1: "",
        token1Address: "",
        token2: "",
        token2Address: "",
      });
      if (result) toast("Transaction hash: ", result.hash);
    } catch (error) {
      console.log(error);
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
            <input
              id="token1Symbol"
              type="text"
              placeholder="ANNA"
              minLength="3"
              maxLength="6"
              required
              value={input.token1}
              onChange={(e) => setInput({ ...input, token1: e.target.value })}
            ></input>
            <div>symbol</div>
          </div>
          <div>
            <input
              id="token1Address"
              type="text"
              placeholder="0x..."
              minLength="42"
              maxLength="42"
              required
              value={input.token1Address}
              onChange={(e) =>
                setInput({ ...input, token1Address: e.target.value })
              }
            ></input>
            <div>address</div>
          </div>
        </div>
        <div className={styles.tradeBoxBottom}>
          <div className={styles.tradeBoxLeft}>
            <input
              id="token2Symbol"
              type="text"
              placeholder="ANNA"
              minLength="3"
              maxLength="6"
              required
              value={input.token2}
              onChange={(e) => setInput({ ...input, token2: e.target.value })}
            ></input>
            <div>symbol</div>
          </div>
          <div>
            <input
              id="token2Address"
              type="text"
              placeholder="0x..."
              minLength="42"
              maxLength="42"
              required
              value={input.token2Address}
              onChange={(e) =>
                setInput({ ...input, token2Address: e.target.value })
              }
            ></input>
            <div>address</div>
          </div>
        </div>
        <button onClick={addPool} className={styles.button}>
          Add pool
        </button>
      </div>
    </main>
  );
};

export default Create;
