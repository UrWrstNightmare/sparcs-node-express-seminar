import React from "react";
import axios from "axios";
import { SAPIBase } from "../tools/api";
import Header from "../components/header";
import "./css/kawaii-stagram.css";

interface IAPIResponse  { id: number, title: string, description: string, image: string }

const KawaiiStagram = () => {
  const [ LAPIResponse, setLAPIResponse ] = React.useState<IAPIResponse[]>([]);
  const [ NPostCount, setNPostCount ] = React.useState<number>(0);
  const [ SNewPostTitle, setSNewPostTitle ] = React.useState<string>("");
  const [ SNewPostdescription, setSNewPostdescription ] = React.useState<string>("");
  const [ SNewPostImage, setSNewPostImage ] = React.useState<string>("");

  React.useEffect( () => {
    let BComponentExited = false;
    const asyncFun = async () => {
      const { data } = await axios.get<IAPIResponse[]>( SAPIBase + `/kawaii-stagram/getFeed?count=${ NPostCount }`);
      console.log(data);
      if (BComponentExited) return;
      setLAPIResponse(data);
    };
    asyncFun().catch((e) => window.alert(`Error while running API Call: ${e}`));
    return () => { BComponentExited = true; }
  }, [ NPostCount ]);

  const createNewPost = () => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/kawaii-stagram/addFeed', { title: SNewPostTitle, description: SNewPostdescription, image: SNewPostImage } );
      setNPostCount(NPostCount + 1);
      setSNewPostTitle("");
      setSNewPostdescription("");
      setSNewPostImage("");
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const deletePost = (id: string) => {
    const asyncFun = async () => {
      // One can set X-HTTP-Method header to DELETE to specify deletion as well
      await axios.post( SAPIBase + '/kawaii-stagram/deleteFeed', { id: id } );
      setNPostCount(Math.max(NPostCount - 1, 0));
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const editPost = (id: string, newTitle: string, newDescription: string, newImage: string) => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/kawaii-stagram/editFeed', { id: id, title: newTitle, description: newDescription, image: newImage } );
      const updatedPosts = LAPIResponse.map( (val) => {
        if (val.id === parseInt(id)) {
          val.title = newTitle;
          val.description = newDescription;
          val.image = newImage;
        }
        return val;
      });
      setLAPIResponse(updatedPosts);
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  return (
    <div className="Feed">
      <Header/>
      <h2>Kawaii-Stagram</h2>
      <div className={"feed-length-input"}>
        Number of posts to show: &nbsp;&nbsp;
        <input type={"number"} value={ NPostCount } id={"post-count-input"} min={0}
               onChange={ (e) => setNPostCount( parseInt(e.target.value) ) }
        />
      </div>
      <div className={"feed-list"}>
        { LAPIResponse.map( (val, i) =>
          <div key={i} className={"feed-item"}>
            <div className={"delete-item"} onClick={() => deletePost(`${val.id}`)}>ⓧ</div>
            <div className={"edit-item"} onClick={() => {
              const newTitle = window.prompt("Enter the new title", val.title);
              const newdescription = window.prompt("Enter the new description", val.description);
              const newImage = window.prompt("Enter the link of image", val.image);
              if (newTitle && newdescription && newImage) editPost(`${val.id}`, newTitle, newdescription, newImage);
            }}>🖍️</div>
            <h3 className={"feed-title"}>{ val.title }</h3>
            <p className={"feed-body"}>{ val.description }</p>
            <img className={"feed-image"} src={ val.image } alt={ val.title }/>
          </div>
        ) }
        <div className={"feed-item-add"}>
          Title: <input type={"text"} value={SNewPostTitle} onChange={(e) => setSNewPostTitle(e.target.value)}/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          description: <input type={"text"} value={SNewPostdescription} onChange={(e) => setSNewPostdescription(e.target.value)}/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          Image: <input type={"text"} value={SNewPostImage} onChange={(e) => setSNewPostImage(e.target.value)}/>
          <div className={"post-add-button"} onClick={() => createNewPost()}>Add Post!</div>
        </div>
      </div>
    </div>
  );
}

export default KawaiiStagram;