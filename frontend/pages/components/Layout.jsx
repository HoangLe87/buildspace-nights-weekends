import Header from "./Header";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }) {
  // set metamask account
  const [currentAccount, setCurrentAccount] = useState("");
  // function to check if metamask is connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Please install metamask");
      return;
    } else {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        let account = accounts[0];
        setCurrentAccount(account);
        console.log(`account is ${account}`);
      } else {
        console.log("No authorized account found");
      }
    }
  };

  // check if metamask is connected upon load
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const tokens = ["ANNA", "WETH"];
  return (
    <>
      <Header
        currentAccount={currentAccount}
        setCurrentAccount={setCurrentAccount}
      />
      <main>{children}</main>
      <Footer />
    </>
  );
}
