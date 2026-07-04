import { Route, Routes } from "react-router-dom";

import Login from "./pages/Login/Login";
import Chat from "./pages/Chat/Chat";
import Profile from "./pages/ProfileUpdate/ProfileUpdate";

function App() {
  return (
    <>
      <Routes>

        
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </>
  );
}

export default App;