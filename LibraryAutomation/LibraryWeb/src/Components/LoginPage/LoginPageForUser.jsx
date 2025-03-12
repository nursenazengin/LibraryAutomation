import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import './LoginPage.css';
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const LoginPageForUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  useEffect(() => {
    

      if (token) {
        const decoded = jwtDecode(token);
        console.log("Kullanıcı ID:", decoded.id); 
      }

      axios.get("https://localhost:7253/api/Users", {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(response => setUsers(response.data))
      .catch(error => console.error("API'den veri çekerken hata:", error));
  }, []); 

  const handleLogin = async (e) => {     
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("https://localhost:7253/api/Users/Login", {
          email,
          password
        }, 
      );


      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id", response.data.user.id);

        setSuccess("Login is success")
        setTimeout(() => {
          navigate("/mainPageAsUser");
        },100)
      } 
      else {
        setError("Email or password is incorrect");
      }
    } catch (err) {
      setError("Email or password is incorrect")
    }

  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleLogin}>
        <h1>Login</h1>
        
        <div className="input-box">
          <input 
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            required 
          />
          <FaUser className='icon'/>
        </div>

        <div className="input-box">
          <input 
            type="password" 
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" 
            required 
          />
          <FaLock className='icon'/>
        </div>

        {success && <div style={{ color: "green" }}>{success}</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}


        <button type="submit">Login</button>

        <div className="register-link">
          <p>Don't have an account? <Link to="/registerAsUser">Register</Link></p>
        </div>
      </form>
    </div>
  );
};

export default LoginPageForUser;
