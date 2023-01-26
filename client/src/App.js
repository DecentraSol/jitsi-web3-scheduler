import "./App.css";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from "react";
import Calendar from "./components/Calendar";
import {JitsiMeeting} from '@jitsi/react-sdk'

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


  const handleJitsiIFrameRef1 = iframeRef => {
      iframeRef.style.border = '10px solid #3d3d3d';
      iframeRef.style.background = '#3d3d3d';
      iframeRef.style.height = '400px';
      iframeRef.style.marginBottom = '20px';
  };

  return (
        <div className="App" >
          <header className="App-header">
            <h1>Calend3</h1>
            <p id="slogan">A Jitsi Web3 Appointment Scheduler</p>
          </header>
              {!account && <button onClick={connect}>Connect Wallet</button>}
              {account && 
          <div  style={{"height":"800px"}}>
            <Calendar account={account} />        
            <JitsiMeeting   getIFrameRef = { handleJitsiIFrameRef1 } style={{"height":"800px"}} domain="meet.le-space.de" roomName="theMeetingRoom"/>
          </div>}
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
