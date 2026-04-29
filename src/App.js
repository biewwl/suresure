import CreateBetPage from './pages/CreateBetPage';
import EditBetPage from './pages/EditBetPage';
import OtherEarnings from './pages/OtherEarnings';
import Accounts from './pages/Accounts';
import Statistics from './pages/Statistics';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TipPage from './pages/TipPage';
import "./App.css";
import Header from './Components/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateBetPage />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/other-earnings" element={<OtherEarnings />} />
        <Route path="/edit/:id" element={<EditBetPage />} />
        <Route path="/tip/:id" element={<TipPage />} />
      </Routes>
    </div>
  );
}

export default App;