import './RegisterPage.css';
import { FaUser, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import axios from "axios";

const RegisterPageForUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    axios.get("https://localhost:7253/api/Users")
      .then(response => setUsers(response.data))
      .catch(error => console.error("API'den veri çekerken hata:", error));
  }, []);

  const handleRegister = async () => {     
    try {
      const response = await fetch("https://localhost:7253/api/Users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        throw new Error("Kayıt başarısız oldu!");
      }

      const data = await response.json();
      console.log("Kullanıcı başarıyla kaydedildi:", data);
      alert("Account created successfully, please login.")

      setSuccess("Kayıt başarılı! Giriş yapabilirsiniz.");
      setError(""); 

      setUsers([...users, { name, email, password }]);

      
      setName('');
      setEmail('');
      setPassword('');

      navigate("/loginAsUser");
      
    } catch (error) {
      console.error("Kayıt hatası:", error);
      setError("Kayıt başarısız oldu!");
      setSuccess(""); 
    }
  };

  return (
    <div className='wrapp'>
      <form onSubmit={handleRegister}>
        <h1>Register</h1>        
        {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

        {success && <p style={{ color: "green", fontWeight: "bold" }}>{success}</p>}

        <div className="input-boxes">
          <input 
            type="text"
            name='name'
            value={name}
            onChange={(e) => setName(e.target.value)} 
            placeholder='Name' required 
          />
          <FaUser className='icon'/>
        </div>

        <div className="input-boxes">
          <input 
            type="text"
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            placeholder='Email' required 
          />
          <FaUser className='icon'/>
        </div>

        <div className="input-boxes">
          <input 
            type="password" 
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password' required 
          />
          <FaLock className='icon'/>
        </div>

        <button onClick={() => {
          if (!email || !password) {
            alert("Please fill all fields");
            return; 
          };

        const isUserExists = users.some((user) => user.email === email);
          if (isUserExists) {
            alert("This email is already registered! Please login.");
            return;
          };
          handleRegister()}} type="button">Register</button>

        <div className="login-link">
          <p>Already have an account? 
            <Link to="/loginAsUser"> Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPageForUser;
