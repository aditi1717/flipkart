import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserRoutes from './modules/user/routes/UserRoutes';
import AdminRoutes from './modules/admin/routes/AdminRoutes';
import './App.css';

function App() {
  return (
    <Router>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
