import React from 'react';
import ReactDOM from 'react-dom/client';
import LandingPage from './pages/landingPage.jsx';
import TestApp from './pages/test.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <LandingPage />
    </React.StrictMode>,
);
