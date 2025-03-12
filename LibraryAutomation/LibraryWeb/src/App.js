import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstPage from './Components/FirstPage/FirstPage';
import LoginPageForUser from './Components/LoginPage/LoginPageForUser';
import RegisterPageForUser from "./Components/RegisterPage/RegisterPageForUser";
import MainPageForUser from "./Components/MainPage/MainPageForUser";
import BorrowPage from "./Components/BorrowPage/BorrowPage";
import ProfilePageUser from "./Components/ProfilePage/ProfilePageUser";

import RegisterPageForAdmin from "./Components/RegisterPage/RegisterPageForAdmin";
import LoginPageForAdmin from './Components/LoginPage/LoginPageForAdmin';
import MainPageForAdmin from "./Components/MainPage/MainPageForAdmin";
import ProfilePageForAdmin from "./Components/ProfilePage/ProfilePageForAdmin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} /> 
        <Route path="/loginAsUser" element={<LoginPageForUser />} /> 
        <Route path="/registerAsUser" element={<RegisterPageForUser />} /> 
        <Route path="/mainPageAsUser" element={<MainPageForUser />} /> 
        <Route path="/borrowed" element={<BorrowPage />} />
        <Route path="/profilePageAsUser" element={<ProfilePageUser />} />


        <Route path="/registerAsAdmin" element={<RegisterPageForAdmin />} />
        <Route path="/loginAsAdmin" element={<LoginPageForAdmin />} />
        <Route path="/mainPageAsAdmin" element={<MainPageForAdmin />} />
        <Route path="/profilePageAsAdmin" element={<ProfilePageForAdmin />} />
        
      </Routes>
    </Router>
    
  );
}

export default App;
