import CreateBetPage from './pages/CreateBetPage';
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
        <Route path="/tip/:id" element={<TipPage />} />
      </Routes>
    </div>
  );
}

export default App;