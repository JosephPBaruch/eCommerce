import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateUser from './CreateUser';
import CreateProduct from './CreateProduct'
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <h1>eCommerce</h1>

        <Link to="/create-user">Create User</Link>
        <Routes>
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/create-product" element={<CreateProduct />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;