import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ValentineForm from './pages/ValentineForm';
import PreviewPage from './pages/PreviewPage';
import SurprisePage from './pages/SurprisePage';
import './index.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/"         element={<LandingPage />} />
                <Route path="/preview"  element={<PreviewPage />} />
                <Route path="/create"   element={<ValentineForm />} />
                <Route path="/s/:id"    element={<SurprisePage />} />
            </Routes>
        </Router>
    );
}

export default App;
