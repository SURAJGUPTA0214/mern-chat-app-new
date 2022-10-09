import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Chat from './Chat';
import Login from './Login';
import Register from './Register';
import OverView from './OverView';
import TextToVoice from './Voice/TextToVoice';

function App() {
  const authenticated = localStorage.getItem("chatAppToken");
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element = { authenticated ? <OverView /> : <Login /> } /> 
          <Route path="/register" element={ <Register /> } />

          <Route path="/chat" element={ authenticated ? <Chat /> : <Login /> } />
          <Route path="/over-view" element={ authenticated ? <OverView /> : <Login /> } />
          <Route path = '/text-voice' element={<TextToVoice />} />

        </Routes>
      </BrowserRouter>
    
    </div>
  );
}

export default App;