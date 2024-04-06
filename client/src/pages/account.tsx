import React from "react";
import Header from "../components/header";
import axios from "axios";
import {SAPIBase} from "../tools/api";
import "./css/account.css";

interface IAPIResponse  { id: number, spend: string, purpose: string }

const AccountPage = () => {
  const [ password, setPASSWORD ] = React.useState<string>("");
  const [ username, setUSERNAME ] = React.useState<string>("");
  const [ spend, setSPEND ] = React.useState<string>("");
  const [ purpose, setPURPOSE ] = React.useState<string>("");
  const [ NBalance, setNBalance ] = React.useState<number | "Not Authorized">("Not Authorized");
  const [ NTransaction, setNTransaction ] = React.useState<number | ''>(0);
  const [ LAPIResponse, setLAPIResponse ] = React.useState<IAPIResponse[]>([]);
  const [ NPostCount, setNPostCount ] = React.useState<number>(0);
  const [ NModifyCount, setNModifyCount ] = React.useState<number>(0);
  
  
  React.useEffect( () => {
    let BComponentExited = false;
    const asyncFun = async () => {
      const { data } = await axios.get<IAPIResponse[]>( SAPIBase + '/account/getBook');
      console.log(data);
      // const data = [ { id: 0, title: "test1", content: "Example body" }, { id: 1, title: "test2", content: "Example body" }, { id: 2, title: "test3", content: "Example body" } ].slice(0, NPostCount);
      if (BComponentExited) return;
      setLAPIResponse(data);
    };
    asyncFun().catch((e) => window.alert(`Error while running API Call: ${e}`));
    return () => { BComponentExited = true; }
  }, [ NPostCount, NModifyCount ]);

  

  const getAccountInformation = () => {
    const asyncFun = async() => {
      interface IAPIResponse { balance: number };
      const { data } = await axios.post<IAPIResponse>(SAPIBase + '/account/getInfo', { credentialID: username, credentialPW: password });
      setNBalance(data.balance);
    }
    asyncFun().catch((e) => window.alert(`AN ERROR OCCURED: ${e}`));
  }

  const performTransaction = ( amount: number | '' ) => {
    const asyncFun = async() => {
      if (amount === '') return;
      interface IAPIResponse { success: boolean, balance: number, msg: string };
      const { data } = await axios.post<IAPIResponse>(SAPIBase + '/account/transaction', { credentialID: username, credentialPW: password, amount: amount });

      setSPEND("" + amount);

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

  const createNewPost = () => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/account/addBook', { spend: spend, purpose: purpose } );
      setNPostCount(NPostCount + 1);
      setSPEND("");
      setPURPOSE("");
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const deletePost = (id: string) => {
    const asyncFun = async () => {
      // One can set X-HTTP-Method header to DELETE to specify deletion as well
      await axios.post( SAPIBase + '/account/deleteBook', { id: id } );
      setNPostCount(Math.max(NPostCount - 1, 0));
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const modifyPost = (id: string) => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/account/modifyBook', { id: id, spend: spend, purpose: purpose } );
      setSPEND("");
      setPURPOSE("");
      setNModifyCount(NModifyCount + 1);
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  return (
    <div className={"account"}>
      <Header/>
      <div className = {"title"}><h2>Account</h2></div>
      <div className={"account-token-input"}>
        Enter Username: <input type={"text"} value={username} onChange={e => setUSERNAME(e.target.value)}/>
        <br />
        Enter Password: <input type={"text"} value={password} onChange={e => setPASSWORD(e.target.value)}/>
        <button onClick={e => getAccountInformation()}>GET</button>
      </div>
      <div className={"account-bank"}>
        <h3>The National Bank of SPARCS API</h3>
        <div className={"balance"}>
          <p className={"balance-title"}>Current Balance</p>
          <p className={"balance-value " + (typeof(NBalance) === "number" ? (NBalance >= 0 ? "balance-positive" : "balance-negative") : "")}>₩ { NBalance }</p>
        </div>
        <div className={"transaction"}>
          ₩ <input type={"number"} value={NTransaction} min={0} onChange={e => setNTransaction(e.target.value === '' ? '' : parseInt(e.target.value))}/>
          <button onClick={e => performTransaction(NTransaction)}>DEPOSIT</button>
          <button onClick={e => performTransaction(NTransaction === '' ? '' : NTransaction * -1)}>WITHDRAW</button>
        </div>
      </div>

      <div className={"account-book-title"}>
        <h2>가계부</h2>
        <p>수입 / 지출을 기록해 보세요.</p>
      </div>
      <div className={"account-book-input"}>
        금액 <input type={"number"} value={spend} onChange={e => setSPEND(e.target.value)} className={"input-spend"}/> 원
        <br />
        내역 <input type={"text"} value={purpose} onChange={e => setPURPOSE(e.target.value)} className={"input-purpose"}/>
        <button className={"book-add-button"} onClick={(e) => createNewPost()}>OK</button>
      </div>
      
      <div className={"added-books"}>
      { LAPIResponse.map( (val, i) =>
          <div key={i} className={"book-item"}>
            <div className={"modify-book-item"} onClick={(e) => modifyPost(`${val.id}`)}>✎</div>
            <div className={"delete-book-item"} onClick={(e) => deletePost(`${val.id}`)}>ⓧ</div>
            
            <h3 className={"book-title"}>{ val.spend } 원</h3>
            <p className={"book-body"}>{ val.purpose }</p>
          </div>
        ) 
      }
      </div>
        
      
    </div>
  );
}

export default AccountPage;