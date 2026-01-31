import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Opportunities } from './pages/Opportunities';
import { OpportunityProfile } from './pages/OpportunityProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:id" element={<OpportunityProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
