import React from "react";
import Header from "../components/header";
import axios from "axios";
import {SAPIBase} from "../tools/api";
import "./css/account.css";

const AccountPage = () => {
  //const [ SAPIKEY, setSAPIKEY ] = React.useState<string>("");
  const [ SAPIID, setSAPIID ] = React.useState<string>("");
  const [ SAPIPW, setSAPIPW ] = React.useState<string>("");
  const [ NBalance, setNBalance ] = React.useState<number | "Not Authorized">("Not Authorized");
  const [ NTransaction, setNTransaction ] = React.useState<number | ''>(0);

  const getAccountInformation = () => {
    const asyncFun = async() => {
      interface IAPIResponse { balance: number };
      //const { data } = await axios.post<IAPIResponse>(SAPIBase + '/account/getInfo', { credential: SAPIKEY });
      const { data } = await axios.post<IAPIResponse>(SAPIBase + '/account/getInfo', { ID: SAPIID, PW: SAPIPW });
      setNBalance(data.balance);
    }
    asyncFun().catch((e) => window.alert(`AN ERROR OCCURED: ${e}`));
  }

  const performTransaction = ( amount: number | '' ) => {
    const asyncFun = async() => {
      if (amount === '') return;
      interface IAPIResponse { success: boolean, balance: number, msg: string };
      //const { data } = await axios.post<IAPIResponse>(SAPIBase + '/account/transaction', { credential: SAPIKEY, amount: amount });
      const { data } = await axios.post<IAPIResponse>(SAPIBase + '/account/transaction', { ID: SAPIID, PW: SAPIPW, amount: amount });
      setNTransaction(0);
      if (!data.success) {
        window.alert('Transaction Failed:' + data.msg);
        return;
      }
      window.alert(`Transaction Success! ₩${ NBalance } -> ₩${ data.balance }\nThank you for using SPARCS Bank`);
      setNTransaction(0);
      setNBalance(data.balance);
    }
    asyncFun().catch((e) => window.alert(`AN ERROR OCCURED: ${e}`));
  }

  return (
    <div className={"account"}>
      <Header/>
      <h2>Account</h2>

      
      <div className={"account-bank"}>
        <h3>The National Bank of SPARCS API</h3>
        <div className={"balance"}>
          <p className={"balance-title"}>Current Balance</p>
          <p className={"balance-value " + (typeof(NBalance) === "number" ? (NBalance >= 0 ? "balance-positive" : "balance-negative") : "")}>₩ { NBalance }</p>
        </div>
      <div className={"account-username-input"}>
        Enter your ID: <input type={"text"} value={SAPIID} onChange={e => setSAPIID(e.target.value)}/>  
      </div>
        <div className={"account-password-input"}>
        Enter your Password: <input type={"password"} value={SAPIPW} onChange={e => setSAPIPW(e.target.value)}/>
      </div>
      <button onClick={e => getAccountInformation()}>GET</button>
        <div className={"transaction"}>
          ₩ <input type={"number"} value={NTransaction} min={0} onChange={e => setNTransaction(e.target.value === '' ? '' : parseInt(e.target.value))}/>
          <button onClick={e => performTransaction(NTransaction)}>DEPOSIT</button>
          <button onClick={e => performTransaction(NTransaction === '' ? '' : NTransaction * -1)}>WITHDRAW</button>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;