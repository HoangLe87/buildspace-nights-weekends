import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import abi from "../../public/static/exchange.json";

function AddLiquidity(props) {
  const [amount, setAmount] = useState(0);

  const getEstimate = async () => {
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
    } catch (error) {
      console.log(error);
      toast.error("Upps, cannot load liquidity pools");
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add Liquidity
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{props.element.token1}</h4>
        <input
          id="amount"
          type="number"
          value={amount}
          maxLength="10"
          onChange={(e) => setAmount(e.target.value)}
        ></input>
        <h4>{props.element.token2}</h4>
        <div></div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddLiquidity;
