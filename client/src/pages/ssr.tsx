import React from "react";
import {SAPIBase} from "../tools/api";
import Header from "../components/header";
import './css/ssr.css';

const SSRPage = () => {
  const [ SArg, setSArg ] = React.useState<string>("default");
  const ArgInput = (props: { defaultValue: string, handleSubmit: (value: string)=>void }) => {
    const [ input, setInput ] = React.useState<string>(props.defaultValue);
    return (
      <div className={"ssr-arg-input"}>
        <input type={"text"} value={input} onChange={e => setInput(e.target.value)}/>
        <button onClick={e => props.handleSubmit(input)}>GET</button>
      </div>
    )
  }
  return (
    <div className="ssr-page">
      <Header/>
      <h2>Server Side Rendering</h2>
      <ArgInput defaultValue={ SArg } handleSubmit={ (value) => setSArg(value) }/>
      <iframe title={"ssr-viewer"} src={ SAPIBase + `/ssr/getpage?arg=${SArg}` } className={"ssr-iframe"} width={800} />
      <p className={"ssr-wow-text"}>↑ The page above is being rendered in Node!</p>
    </div>
  )
}

export default SSRPage;