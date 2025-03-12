import './RegisterPage.css';
import { FaUser, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';


const RegisterPageForAdmin = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://localhost:7253/api/Admins")
      .then(response => setAdmins(response.data))
      .catch(error => console.error("API'den veri çekerken hata:", error));
  }, []);

  const handleRegister = async () => {
    try {
      const response = await fetch("https://localhost:7253/api/Admins", {
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
      
      console.log("Kullanıcı başarıyla kaydedildi:", data)
      alert("Account created successfully, please login.")

      setAdmins([...admins, { name, email, password }]);

      setName('');
      setEmail('');
      setPassword('');

      navigate("/loginAsAdmin");
      
    } catch (error) {
      console.error("Kayıt hatası:", error);
      setError("Kayıt başarısız oldu!");
      setSuccess(""); 
    }
  };


  return (
    <div className='wrapp'>
      <form action="">
        <h1>Register</h1>
        <div className="input-boxes">
          <input type="text"
          name='name'
          value={name}
          onChange={(e) => setName(e.target.value)} 
          placeholder='Name' required />
          <FaUser className='icon'/>
        </div>
        <div className="input-boxes">
          <input type="text"
          name='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          placeholder='Email' required />
          <FaUser className='icon'/>
        </div>
        <div className="input-boxes">
          <input type="password" 
          name='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password' required />
          <FaLock className='icon'/>
        </div>

        
        <button onClick={() => {
          if (!name || !email || !password) {
            alert("Please fill all fields");
            return; 
          };

        const isAdminExists = admins.some((admin) => admin.email === email);
          if (isAdminExists) {
            alert("This email is already registered! Please login.");
            return;
          };
          handleRegister()}} type="button">Register</button>
        
        <div className="login-link">
          <p>Already have an account? <Link to="/loginAsAdmin">
          <a href="#"> Login</a></Link>
            </p>
            </div>
      </form>
    </div>
  );
  };
  
  export default RegisterPageForAdmin;