import { io } from "socket.io-client";

console.log(import.meta.env.VITE_SERVER_URL);
const url = import.meta.env.MODE === "developmen" ? import.meta.env.VITE_LOCAL_SERVER_URL : import.meta.env.VITE_SERVER_URL;
console.log("uri for socket",url);


const socket = io(url, {
    path: "/socket.io",
    secure: true,
    auth: {
        token: localStorage.getItem("token"),
    },
    transports: ["websocket"],
});

export default socket;