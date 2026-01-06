import { useEffect, useState } from "react";
import socket from "../utils/socket";

const socketPage = () => {
  const [clicks, setClicks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  
  useEffect(() => {
    socket.emit("join", `${user.id}`);

    socket.on("new_click", (data) => {
        console.log("fdhjs",data);
        
    //   setClicks(prev => [data.click, ...prev]);
    });

    return () => {
      socket.off("new_click");
    };
  }, []);

  return (
    <div>
      <h2>Realtime Clicks</h2>
      {/* {clicks.map((c, i) => (
        <div key={i}>{c.ip}</div>
      ))} */}
    </div>
  );
};

export default socketPage;
