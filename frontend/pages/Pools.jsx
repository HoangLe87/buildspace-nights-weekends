import styles from "../styles/Home.module.scss";
import NavBar from "./components/NavBar";
import { ethers } from "ethers";
import abi from "../public/static/exchangeFactory.json";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddLiquidity from "./components/AddLiquidity";

const Pools = () => {
  const EXCHANGE_FACTORY = "0xA3f3a8fe01814BD7e1E82f1A388Fa4cd387ebaD8";
  const links = ["Exchange", "Pools", "Create"];
  const tokens = ["ANNA", "WETH", "GANNA"];

  const filteredTokens = () => {
    let k = [];
    tokens.forEach((element) => {
      let filteredList = tokens.filter((i) => i != element);
      for (let i = 0; i < filteredList.length; i++) {
        k.push([element, filteredList[i]]);
      }
    });
    return k;
  };

  const [totalExchanges, setTotalExchanges] = useState(0);
  const [exchanges, setExchanges] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const getExchanges = async () => {
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
      const numberOfExchanges = Number(
        await connectedContract.getTotalExchanges()
      );

      const fetch = async () => {
        let u = [];
        let a = filteredTokens();
        for (const x of a) {
          const data = await connectedContract.getExchangeBySymbol(x[0], x[1]);
          if (data[0] != "0x0000000000000000000000000000000000000000") {
            let dataObj = {
              token1: x[0],
              token2: x[1],
              address: data[0],
            };
            u.push(dataObj);
          }
        }
        const add = u.map((ad) => ad.address);
        let uadd = [...new Set(add)];
        const unique = [...new Set(u)];
        console.log(unique);
      };
      fetch();
      setExchanges();
      setTotalExchanges(Number(numberOfExchanges));
    } catch (error) {
      console.log(error);
      toast.error("Upps, cannot load liquidity pools");
    }
  };

  useEffect(() => {
    getExchanges();
  }, []);

  return (
    <main className={styles.tradeMain}>
      <ToastContainer position="top-right" />
      <NavBar links={links} />
      {exchanges && (
        <div>
          {exchanges.map((element) => (
            <div key={exchanges.indexOf(element)}>
              {element.token1}-{element.token2}{" "}
              <button onClick={() => setModalShow(true)}>Details</button>
              <AddLiquidity
                show={modalShow}
                onHide={() => setModalShow(false)}
                element={element}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Pools;
