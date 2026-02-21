import "./App.css";
import Routess from "./routes/route";
import useDevToolsBlocker from "./Hooks/useDevToolBlocker";


function App() {
  

  

  // if (process.env.NODE_ENV === "productionnhg" ) {
  //   useDevToolsBlocker();
  // }

  return <Routess />;
}
 
export default App;
