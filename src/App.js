import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from './components/Dashboard';
import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';

function App() {
  return (
    // <div>
    //   <Dashboard />
    // </div>

    <Router>
      <Routes>
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/' element={<Dashboard />}/>
      </Routes>
    </Router>
  );
}

export default App;
