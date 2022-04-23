import React from "react";
import axios from "axios";
import { SAPIBase } from "../tools/api";

interface IAPIResponse  { title: string, content: string }

const FeedPage = (props: {}) => {
  const [ LAPIResponse, setLAPIResponse ] = React.useState<IAPIResponse[]>([]);
  const [ NPostCount, setNPostCount ] = React.useState<number>(0);

  React.useEffect( () => {
    let BComponentExited = false;
    const asyncFun = async () => {
      // const { data } = await axios.get<IAPIResponse[]>( SAPIBase + `/getFeed?count=${ NPostCount }`);
      const data = [ { title: "test1", content: "Example body" }, { title: "test2", content: "Example body" }, { title: "test3", content: "Example body" } ].slice(0, NPostCount);
      if (BComponentExited) return;
      setLAPIResponse(data);
    };
    asyncFun().catch((e) => window.alert(`Error while running API Call: ${e}`));
    return () => { BComponentExited = true; }
  }, [ NPostCount ]);

  return (
    <div className="App">
      <h1>Feed</h1>
      <div className={"feed-length-input"}>
        # of posts to show:
        <input type={"number"} value={ NPostCount } id={"post-count-input"}
               onChange={ (e) => setNPostCount( parseInt(e.target.value) ) }
        />
      </div>
      <div className={"feed-list"}>
        { LAPIResponse.map( (val, i) =>
          <div key={i} className={"feed-item"}>
            <h2 className={"feed-title"}>{ val.title }</h2>
            <p className={"feed-body"}>{ val.content }</p>
          </div>
        ) }
      </div>
    </div>
  );
}

export default FeedPage;