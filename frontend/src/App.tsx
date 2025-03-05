import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import CreateUser from './CreateUser';
// import CreateProduct from './CreateProduct'
import './App.css';
import HomePage from './pages/home/home'
import SignIn from './pages/login/SignIn';
import SignUp from './pages/login/SignUp';
import Sell from './pages/home/Sell'
import ProtectedRoute from './ProtectedRoute'

function App() {
  return (
    <Router>
      <div>
        {/* <h1>eCommerce</h1> */}
        {/* <Link to="/create-user">Create User</Link> */}
        <Routes>

          {/* <Route path="/create-user" element={<CreateUser />} /> */}
          <Route path="/" element={<HomePage/>} />
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/sell" element={<Sell />} />
          {/* <Route path="/sell" element={<ProtectedRoute element={<Sell />} />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;