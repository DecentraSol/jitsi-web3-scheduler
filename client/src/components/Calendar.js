import React, { useEffect, useState } from "react";
import "../App.css";
import { ethers } from "ethers";
import abi from "../abis/Calend3.json";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
  CurrentTimeIndicator,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentForm,
    DateNavigator,
  TodayButton,
  Toolbar,
} from "@devexpress/dx-react-scheduler-material-ui";

import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import {JitsiMeeting} from '@jitsi/react-sdk'

const contractAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
const contractABI = abi.abi;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  provider.getSigner()
);

const Calendar = ({ account }) => {
  // admin rate setting functionality
  const [ showAdmin, setShowAdmin] = useState(false);
  const [ showConference, setShowConference] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);

  const [rate, setRate] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const [showDialog, setShowDialog] = useState(false);
  const [showSign, setShowSign] = useState(false);
  const [mined, setMined] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  const getData = async () => {
    const network = await provider.getNetwork()
    console.log('network',network)
    // get contract owner and set admin if connected account is owner
    // console.log('contract rate',contract.address)
    const owner = await contract.owner();
    console.log('contract owner',owner)
    // console.log('account addr',account)
    setIsAdmin(owner.toUpperCase() === account.toUpperCase());

    const rate = await contract.getRate();
    setRate(ethers.utils.formatEther(rate.toString()));

    const appointmentData = await contract.getAppointments();
    //check if there is an appointment at the moment
    appointmentData.forEach( (it) => {
      // console.log(new Date(parseFloat(it.startTime.toString())*1000))
      // console.log(new Date(parseFloat(it.endTime.toString())*1000))

      if(new Date(parseFloat(it.startTime.toString())*1000) <= new Date().getTime() &&
      new Date(parseFloat(it.endTime.toString())*1000) >= new Date().getTime()){
        console.log('this appointment is now!',it)
        setIsParticipant(true)
        setShowAdmin(false)
        setShowDialog(false)
      }
    
    })

    transformAppointmentData(appointmentData);
  };

  const transformAppointmentData = (appointmentData) => {
    let data = [];
    appointmentData.forEach((appointment) => {
      data.push({
        title: appointment.title,
        startDate: new Date(appointment.startTime * 1000),
        endDate: new Date(appointment.endTime * 1000),
      });
    });

    setAppointments(data);
  };

  useEffect(() => {
    getData();
  }, []);

  const saveAppointment = async (data) => {
    const appointment = data.added;
    const title = appointment.title;
    const startTime = appointment.startDate.getTime() / 1000;
    const endTime = appointment.endDate.getTime() / 1000;

    setShowSign(true);
    setShowDialog(true);
    setMined(false);

    try {
      const cost = (((endTime - startTime) / 60) * (rate * 100)) / 100;
      const msg = { value: ethers.utils.parseEther(cost.toString()) };
      let transaction = await contract.createAppointment(
        title,
        startTime,
        endTime,
        msg
      );
      setShowSign(false);
      await transaction.wait();
      setMined(true);
      setTransactionHash(transaction.hash);
    } catch (error) {
      console.log(error);
    }
  };

  const ConfirmDialog = () => {
    return (
      <Dialog open={true}>
        <h3>
          {mined && "Appointment Confirmed"}
          {!mined && !showSign && "Confirming Your Appointment..."}
          {!mined && showSign && "Please Sign to Confirm"}
        </h3>
        <div style={{ textAlign: "left", padding: "0px 20px 20px 20px" }}>
          {mined && (
            <div>
              Your appointment has been confirmed and is on the blockchain.
              <br />
              <br />
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://ropsten.etherscan.io/tx/${transactionHash}`}
              >
                View on Etherscan
              </a>
            </div>
          )}
          {!mined && !showSign && (
            <div>
              <p>
                Please wait while we confirm your appoinment on the
                blockchain....
              </p>
            </div>
          )}
          {!mined && showSign && (
            <div>
              <p>Please sign the transaction to confirm your appointment.</p>
            </div>
          )}
        </div>
        <div style={{ textAlign: "center", paddingBottom: "30px" }}>
          {!mined && <CircularProgress />}
        </div>
        {mined && (
          <Button
            onClick={() => {
              setShowDialog(false);
              getData();
            }}
          >
            Close
          </Button>
        )}
      </Dialog>
    );
  };

  const handleSliderChange = (event, newValue) => {
    setRate(newValue);
  };

  const saveRate = async () => {
    const tx = await contract.setRate(ethers.utils.parseEther(rate.toString()));
  };

  const marks = [
    {
      value: 0.0,
      label: "Free",
    },
    {
      value: 0.02,
      label: "0.02 ETH/min",
    },
    {
      value: 0.04,
      label: "0.04 ETH/min",
    },
    {
      value: 0.06,
      label: "0.06 ETH/min",
    },
    {
      value: 0.08,
      label: "0.08 ETH/min",
    },
    {
      value: 0.1,
      label: "Expensive",
    },
  ];

  const Admin = () => {
    return (
      <div id="admin">
        <Box>
          <h3>Set Your Minutely Rate</h3>
          <Slider
            defaultValue={parseFloat(rate)}
            step={0.001}
            min={0}
            max={0.1}
            valueLabelDisplay="auto"
            marks={marks}
            onChangeCommitted={handleSliderChange}
          />
          <br />
          <br />
          <Button id={"settings-button"} onClick={saveRate} variant="contained">
            <SettingsSuggestIcon /> save configuration
          </Button>
        </Box>
      </div>
    );
  };
  const handleJitsiIFrameRef1 = iframeRef => {
    iframeRef.style.border = '10px solid #3d3d3d';
    iframeRef.style.background = '#3d3d3d';
    iframeRef.style.height = '400px';
    iframeRef.style.marginBottom = '20px';
  };  
  return (
    <div>
      <div id="admin-btn">
        {isAdmin && (
          <Button
            onClick={() => setShowAdmin(!showAdmin)}
            variant="contained"
            startIcon={<SettingsSuggestIcon />}
          >
            Admin
          </Button>
        )}
      </div>
      <div id="admin-btn">
      {showAdmin && <Admin />}
      {isParticipant && (
        <Button
          onClick={() => setShowConference(!showConference)}
          variant="contained"
          startIcon={<SettingsSuggestIcon />}
        >
          Join conference
        </Button>
      )}
      </div>
    { showConference && 
      <JitsiMeeting 
        getIFrameRef = { handleJitsiIFrameRef1 } 
        domain="meet.le-space.de" 
        roomName="theMeetingRoom"/>
      } 
      <div id="calendar">
        <Scheduler data={appointments}>
          <ViewState />
          <EditingState onCommitChanges={saveAppointment} />
          <IntegratedEditing />
          <WeekView  startDayHour={9} endDayHour={19} />
          <Toolbar />
          <DateNavigator />
          <TodayButton /> 
          <Appointments />
          <CurrentTimeIndicator
            shadePreviousCells={true}
            shadePreviousAppointments={true}
            updateInterval={10}
          />
          <AppointmentForm />
        </Scheduler>
      </div>
      {showDialog && <ConfirmDialog />}

    </div>
  );
};

export default Calendar;
