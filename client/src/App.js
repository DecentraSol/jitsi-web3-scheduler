import "./App.css";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from "react";
import Calendar from "./components/Calendar";


function App() {
  const [account, setAccount] = useState(false);

  useEffect(() => {
    isConnected();
  }, []);

  const isConnected = async () => {
    const provider = await detectEthereumProvider();
    const accounts = await provider.request({ method: "eth_accounts" });

    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      console.log("No authorized account found");
    }
  };

  const connect = async () => {
    try {
      const provider = await detectEthereumProvider();

      // return an array of accounts
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      //check if array at least one element
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        console.log("No account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
        <div className="App" >
          <header className="App-header">
            <h1>Calend3</h1>
            <p id="slogan">A Jitsi Web3 Appointment Scheduler</p>
          </header>
              {!account && <button onClick={connect}>Connect Wallet</button>}
              {account && 
            <Calendar account={account} />        
          }
      </div>
    
  )
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <h1>Calend3</h1>
  //       <p id="slogan">A Jitsi Web3 Appointment Scheduler</p>
  //     </header>
  //     {!account && <button onClick={connect}>Connect Wallet</button>}
  //     {account && <Calendar account={account} />}
  //   </div>
  // );
}

export default App;
