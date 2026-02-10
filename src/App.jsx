import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ValentineForm from './pages/ValentineForm';
import SuccessPage from './pages/SuccessPage';
import SurprisePage from './pages/SurprisePage';
import './index.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/valentine" replace />} />
                <Route path="/valentine" element={<ValentineForm />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/s/:id" element={<SurprisePage />} />
            </Routes>
        </Router>
    );
}

export default App;
