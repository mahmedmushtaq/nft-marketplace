import React, { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import KryptoBirdz from "../abis/KryptoBirdz.json";

const useWeb3 = () => {
  const [web3, setWeb3] = useState();
  const [account, setAccount] = useState();
  const loadWeb3 = useCallback(async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      console.log("Wallet is connected");
      const web3Instance = new Web3(provider);
      window.web3 = web3Instance;
      setWeb3(web3Instance);
    } else {
      console.log("no ethereum wallet is connected");
    }
  }, []);

  useEffect(() => {
    loadWeb3();
  }, [loadWeb3]);

  useEffect(() => {
    if (!web3) return;
    (async () => {
      const web3accounts = await web3.eth.getAccounts();

      setAccount(web3accounts[0]);
    })();
  }, [web3]);

  return { web3, account };
};

export default useWeb3;
