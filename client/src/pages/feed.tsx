import React from "react";
import axios from "axios";
import { SAPIBase } from "../tools/api";
import Header from "../components/header";
import Type from "../components/Type";
import "./css/feed.css";

interface IAPIResponse  { id: number, title: string, content: string, type: string }

const FeedPage = (props: {}) => {
  const [ LAPIResponse, setLAPIResponse ] = React.useState<IAPIResponse[]>([]);
  const [ NPostCount, setNPostCount ] = React.useState<number>(0);
  const [ SNewPostTitle, setSNewPostTitle ] = React.useState<string>("");
  const [ SNewPostContent, setSNewPostContent ] = React.useState<string>("");
  const [ SNewPostType, setSNewPostType] = React.useState<string>("");

  const dropDownRef = React.useRef(null);
  const typeList:string[] =["BLOG", "INFO", "OTHERS"];
  const useTypeState = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
      const pageClickEvent = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          setIsOpen(!isOpen);
        }
      };

      if (isOpen) {
        window.addEventListener('click', pageClickEvent);
      }

      return () => {
        window.removeEventListener('click', pageClickEvent);
      };
    }, [isOpen, ref]);
    return [isOpen, setIsOpen];
  }
  const [isOpen, setIsOpen] = useTypeState(dropDownRef) as [boolean, React.Dispatch<React.SetStateAction<boolean>>];;

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
      await axios.post( SAPIBase + '/feed/addFeed', { title: SNewPostTitle, content: SNewPostContent, type: SNewPostType } );
      setNPostCount(NPostCount + 1);
      setSNewPostTitle("");
      setSNewPostContent("");
      setSNewPostType("");
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const deletePost = (id: string) => {
    const asyncFun = async () => {
      // One can set X-HTTP-Method header to DELETE to specify deletion as well
      await axios.post( SAPIBase + '/feed/deleteFeed', { id: id } );
      setNPostCount(Math.max(NPostCount - 1, 0));
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const editPost = (id: string, newTitle: string, newContent: string, type: string) => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/feed/editFeed', { id: id, title: newTitle, content: newContent, type: type } );
      const posts = LAPIResponse.map((tmp)=>{
        if (tmp.id===parseInt(id)) {
          tmp.title=newTitle;
          tmp.content=newContent;
          tmp.type=type;
        }
        return tmp;
      });
      setLAPIResponse(posts);
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
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
        {LAPIResponse.map((val, i) =>
            <div key={i} className={"feed-item"}>
              <div className={"feed-type"}>{val.type}</div>
              <div className={"delete-item"} onClick={(e) => deletePost(`${val.id}`)}>ⓧ</div>
              <div className={"edit-item"} onClick={(e) => {
                const newTitle = window.prompt("Enter new title: ", val.title);
                const newContent = window.prompt("Enter new content: ", val.content);
                if (newTitle && newContent) editPost(`${val.id}`, newTitle, newContent, `${val.type}`);
              }}>Edit
              </div>
              <h3 className={"feed-title"}>{val.title}</h3>
              <p className={"feed-body"}>{val.content}</p>
            </div>
        )}
        <div className={"feed-item-add"}>
          Category:&nbsp;&nbsp;
        <div className={"feed-type-dropdown"} ref={dropDownRef}>
            <input
                onClick={() => setIsOpen((open: boolean) => !open)}
                type='button'
                value={SNewPostType}
            />
            ...
            {isOpen &&
                <ul>
                  {typeList.map((value, index) => (
                      <Type key={index} value={value} setIsOpen={setIsOpen}
                            setSNewPostType={setSNewPostType} isOpen={isOpen}/>
                  ))}
                </ul>
            }
          </div>
          <br/>
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