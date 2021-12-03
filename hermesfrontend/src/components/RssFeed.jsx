
import React, { useState, useEffect } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
//https://store.steampowered.com/feeds/news/app/386360/?cc=US&l=english&snr=1_2108_9__2107
// function RSSFeeder(props) {
//     useEffect(() => {
//         const script = document.createElement('script');
      
//         script.src = "//rss.bloople.net/?url=https%3A%2F%2Fstore.steampowered.com%2Ffeeds%2Fnews%2Fapp%2F386360%2F%3Fcc%3DUS%26l%3Denglish%26snr%3D1_2108_9__2107&showtitle=false&type=js";
//         script.async = true;
//         let element = document.getElementById("insertHere");
//         element.appendChild(script);
      
//       }, []);
//         return (
//         <div className="toughest-matchups content-section">
//             <div className="content-section_header new" id="insertHere">
//             </div>
//         </div>
//         );
// }

export default function RSSFeeder() {
  const [rssUrl, setRssUrl] = useState("");
  const [items, setItems] = useState([]);

  // const getRss = async (e) => {
  //   e.preventDefault();
  //   const urlRegex = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
  //   if (!urlRegex.test(rssUrl)) {
  //     return;
  //   }
  //   const res = await fetch(`https://api.allorigins.win/get?url=${rssUrl}`);
  //   const { contents } = await res.json();
  //   const feed = new window.DOMParser().parseFromString(contents, "text/xml");
  //   const items = feed.querySelectorAll("item");
  //   const feedItems = [...items].map((el) => ({
  //     link: el.querySelector("link").innerHTML,
  //     title: el.querySelector("title").innerHTML,
  //     author: el.querySelector("author").innerHTML
  //   }));
  //   setItems(feedItems);
  // };

      useEffect(() => {
        fetch("https://api.allorigins.win/get?url=https://store.steampowered.com/feeds/news/app/386360/?cc=US&l=english&snr=1_2108_9__2107").then((res) => 
        res.json().then((data) => {
          console.log(data.contents)
          const feed = new window.DOMParser().parseFromString(data.contents, "text/xml");
          const items = feed.querySelectorAll("item");
          const feedItems = [...items].map((el) => ({
            link: el.querySelector("link").innerHTML,
            title: el.querySelector("title").innerHTML,
            author: el.querySelector("author").innerHTML,
            description: el.querySelector("description").innerHTML
          }));
          console.log(feedItems);
          setItems(feedItems)
        }))
    }, []);

  return (
    // style={{opacity: "75%", flexDirection: "row", display: "flex"}}
    <> 
    <InfiniteScroll  
      className="toughest-matchups content-section " 
      style={{ 
        maxWidth: "512px",
        marginTop: "24px",
        backgroundColor: "#191937D9"
    }}
      dataLength={items.length}
      height={400}
    >
    <div className="content-section_header">
      SMITE Update Info
    </div>
      {items.map((item, index) => {
        // if (index < 2) {
        return (
          <div>
            <h1>{item.title}</h1>
            <p>{item.author}</p>
            <div dangerouslySetInnerHTML={{ __html: item.description.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("https://steamcommunity.com/linkfilter/?url=", "")
           }} className="feed-element"             
           style={{
            marginTop: "10px",
            marginBottom: "10px",
            borderBottom: "2px solid #414165"
          }}/> 
          </div>
        );
        // }
      })}
    </InfiniteScroll>
    </>
  );
}