import React from "react";
import axios from "axios";
import { SAPIBase } from "../tools/api";
import Header from "../components/header";
import "./css/feed.css";

interface IAPIResponse  { id: number, title: string, content: string, rating: number }

const FeedPage = (props: {}) => {
  const [ LAPIResponse, setLAPIResponse ] = React.useState<IAPIResponse[]>([]);
  const [ NPostCount, setNPostCount ] = React.useState<number>(0);
  const [ SNewPostTitle, setSNewPostTitle ] = React.useState<string>("");
  const [ SNewPostContent, setSNewPostContent ] = React.useState<string>("");

  React.useEffect( () => {
    let BComponentExited = false;
    const asyncFun = async () => {
      const { data } = await axios.get<IAPIResponse[]>( SAPIBase + `/feed/getFeed?count=${ NPostCount }`);
      console.log(data);
      // const data = [ { id: 0, title: "test1", content: "Example body" }, { id: 1, title: "test2", content: "Example body" }, { id: 2, title: "test3", content: "Example body" } ].slice(0, NPostCount);
      if (BComponentExited) return;
      setLAPIResponse(data);
    };
    asyncFun().catch((e) => window.alert(`Error while running API Call: ${e}`));
    return () => { BComponentExited = true; }
  }, [ NPostCount ]);

  const createNewPost = () => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/feed/addFeed', { title: SNewPostTitle, content: SNewPostContent } );
      setNPostCount(NPostCount + 1);
      setSNewPostTitle("");
      setSNewPostContent("");
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const deletePost = (id: string) => {
    const asyncFun = async () => {
      // One can set X-HTTP-Method header to DELETE to specify deletion as well
      const confirmed =window.confirm("Really want to DELETE ?!?!");
      if (confirmed){
        await axios.post( SAPIBase + '/feed/deleteFeed', { id: id } );
        setNPostCount(Math.max(NPostCount - 1, 0));}
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }
  const editPost = (id: string, newTitle: string, newContent: string) => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/feed/editFeed', { id: id, title: newTitle, content: newContent } );
      const updatedPosts = LAPIResponse.map( (val) => {
        if (val.id === parseInt(id)) {
          val.title = newTitle;
          val.content = newContent;
        }
        return val;
      });
      setLAPIResponse(updatedPosts);
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }
  const ratePost = (id: string, rating: number) => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/feed/rateFeed', { id: id, rating: rating } );
      const updatedPosts = LAPIResponse.map( (val) => {
        if (val.id === parseInt(id)) {
          val.rating = rating;
        }
        return val;
      });
      setLAPIResponse(updatedPosts);
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURRED! ${e}`));
  }

  return (
    <div className="Feed">
      <Header/>
      <h2>Feed</h2>
      <div className={"feed-length-input"}>
        Number of posts to show: &nbsp;&nbsp;
        <input type={"number"} value={ NPostCount } id={"post-count-input"} min={0}
               onChange={ (e) => setNPostCount( parseInt(e.target.value) ) }
        />
      </div>
      <div className={"feed-list"}>
        { LAPIResponse.map( (val, i) =>
          <div key={i} className={"feed-item"}>
            <div className={"edit-item"} onClick={(e)=>
            { const editedTitle = window.prompt("Edit the title to ~ ", val.title);
              const editedContent = window.prompt("Edit the content to ~", val.content);
              if (editedContent&& editedTitle) editPost(`${val.id}`, editedTitle, editedContent);
            }}>Press here to Edit !</div>
            <div className={"delete-item"} onClick={(e) => deletePost(`${val.id}`)}>ⓧ</div>
            <h3 className={"feed-title"}>{ val.title }</h3>
            <p className={"feed-body"}>{ val.content }</p>
            <div className={"feed-rating"}>
              Rating: {val.rating}
              {[1, 2, 3, 4, 5].map((ratingValue) => (
                <span 
                  key={ratingValue}
                  style={{ cursor: "pointer", marginLeft: "5px" }}
                  onClick={() => ratePost(`${val.id}`, ratingValue)}
                >
                  {ratingValue <= val.rating ? "★" : "☆"}
                </span>
              ))}
            </div>
          </div>
          
        ) }

        <div className={"feed-item-add"}>
          Title: <input type={"text"} value={SNewPostTitle} onChange={(e) => setSNewPostTitle(e.target.value)}/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          Content: <input type={"text"} value={SNewPostContent} onChange={(e) => setSNewPostContent(e.target.value)}/>
          <div className={"post-add-button"} onClick={(e) => createNewPost()}>Add Post!</div>
        </div>
      </div>
    </div>
  );
}

export default FeedPage;