import React, { useCallback, useEffect, useRef, useState } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import KryptoBirdz from "../abis/KryptoBirdz.json";
import useWeb3 from "./useWeb3";

export default () => {
  const { web3, account } = useWeb3();
  const [contractData, setContractData] = useState({});
  const inputRef = useRef();
  console.log("web3 and accounts are ", web3, account);

  const loadBlockchainData = useCallback(async () => {
    if (!web3) return;

    const networkId = await web3.eth.net.getId();
    console.log(" =============== network id ", networkId);
    const networkData = KryptoBirdz.networks[networkId];
    if (networkData) {
      const abi = KryptoBirdz.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);

      const tSupply = await contract.methods.totalSupply().call();
      const totalSupply = web3.utils.hexToNumber(tSupply);

      const allBirdz = [];

      for (let i = 0; i < totalSupply; i++) {
        const kBirdz = await contract.methods.kryptoBirdz(i).call();
        allBirdz.push(kBirdz);
      }

      setContractData((prevState) => ({
        ...prevState,
        contract,
        totalSupply,
        allBirdz,
      }));
    } else {
      console.log(
        "smart contract is not deployed. Internal Server Error. Please try again later"
      );
    }
  }, [web3]);

  console.log("contract is ", contractData);

  const mint = async (kryptoBird) => {
    const { contract } = contractData;
    contract.methods
      .mint(kryptoBird)
      .send({ from: account })
      .once("receipt", (receipt) => {
        setContractData((prevState) => ({
          ...prevState,
          allBirdz: [...prevState.allBirdz, kryptoBird],
        }));
      });
  };

  useEffect(() => {
    loadBlockchainData();
  }, [loadBlockchainData]);

  const onFormSubmit = async (e) => {
    //  e.preventDefault();
    console.log(inputRef.current.value, "  ref value");
    const kryptoBird = inputRef.current.value;
    await mint(kryptoBird);
  };

  return (
    <div>
      {" "}
      <nav
        className="navbar navbar-dark fixed-top 
  bg-dark flex-md-nowrap p-0 shadow"
      >
        <div
          className="navbar-brand col-sm-3 col-md-3 
  mr-0"
          style={{ color: "white" }}
        >
          Krypto Birdz NFTs (Non Fungible Tokens)
        </div>
        <ul className="navbar-nav px-3">
          <li
            className="nav-item text-nowrap
  d-none d-sm-none d-sm-block
  "
          >
            <small className="text-white">{account}</small>
          </li>
        </ul>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto" style={{ opacity: "0.8" }}>
              <h1 style={{ color: "black" }}>KryptoBirdz - NFT Marketplace</h1>

              <form>
                <input
                  type="text"
                  placeholder="Add a file location"
                  className="form-control mb-1"
                  ref={inputRef}
                />
                <input
                  style={{ margin: "6px" }}
                  type="button"
                  className="btn btn-primary btn-black"
                  value="MINT"
                  onClick={onFormSubmit}
                />
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
