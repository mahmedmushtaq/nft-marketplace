import React, { useCallback, useEffect, useRef, useState } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import KryptoBirdz from "../abis/KryptoBirdz.json";
import useWeb3 from "./useWeb3";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
} from "mdb-react-ui-kit";
import "./App.css";

// https://i.ibb.co/wKVLZkz/k4.png
// https://i.ibb.co/By0CMLg/k5.png
// https://i.ibb.co/p0D3L2c/k6.png
// https://i.ibb.co/JdR4sTc/k7.png
// https://i.ibb.co/8ByYwXK/k8.png
// https://i.ibb.co/3d98b3g/k9.png
// https://i.ibb.co/kgR7Hp6/k10.png
// https://i.ibb.co/CVHMWst/k11.png
// https://i.ibb.co/18QGq2s/k1.png
// https://i.ibb.co/x8mx5Lw/k2.png
// https://i.ibb.co/pQ9xR1g/k3.png

export default () => {
  const { web3, account } = useWeb3();
  const [contractData, setContractData] = useState({ allBirdz: [] });
  const inputRef = useRef();

  const loadBlockchainData = useCallback(async () => {
    if (!web3) return;

    const networkId = await web3.eth.net.getId();
    console.log(" =============== network id ", networkId);
    const networkData = KryptoBirdz.networks[networkId];
    console.log("network data ", networkData);
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
    await contract.methods.mint(kryptoBird).send({ from: account });
    //  .once("receipt", (receipt) => {});

    setContractData((prevState) => ({
      ...prevState,
      allBirdz: [...prevState.allBirdz, kryptoBird],
    }));
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
                  placeholder="Add a Image Url in order to mint"
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

        <hr></hr>
        <div className="row textCenter">
          {contractData.allBirdz.map((kryptoBird) => {
            return (
              <div key={kryptoBird}>
                <div>
                  <MDBCard className="token img" style={{ maxWidth: "22rem" }}>
                    <MDBCardImage
                      src={kryptoBird}
                      position="top"
                      height="250rem"
                      style={{ marginRight: "4px" }}
                    />
                    <MDBCardBody>
                      <MDBCardTitle> KryptoBirdz </MDBCardTitle>
                      <MDBCardText>
                        {" "}
                        The KryptoBirdz are 20 uniquely generated KBirdz from
                        the cyberpunk cloud galaxy Mystopia! There is only one
                        of each bird and each bird can be owned by a single
                        person on the Ethereum blockchain.{" "}
                      </MDBCardText>
                      <MDBBtn href={kryptoBird}>Download</MDBBtn>
                    </MDBCardBody>
                  </MDBCard>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
