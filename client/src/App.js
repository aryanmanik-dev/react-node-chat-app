import { io } from "socket.io-client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import ChatPage from "./components/ChatPage";


function App() {
  const socket = io.connect('http://localhost:4000');
  console.log(socket);

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} />}></Route>
          <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
