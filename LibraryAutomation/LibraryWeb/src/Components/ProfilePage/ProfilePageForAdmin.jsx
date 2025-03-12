import React, { useState, useEffect } from 'react'
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ProfilePageForAdmin = () => {
    const [adminInfo, setAdminInfo] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const token = localStorage.getItem("token");

    const fetchAdminInfo = async () => {
        if (!token) {
          setError("Kullanıcı giriş yapmamış!");
          return;
        }
    
        const decoded = jwtDecode(token);
        const id = decoded.id;
      
        setLoading(true);
    
        try {
          const response = await axios.get(`https://localhost:7253/api/Admins/admin/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
    
          console.log("API Yanıtı:", response.data);
    
          if (response.data.length > 0) {
            setAdminInfo(response.data[0]); 
          } else {
            setError("Kullanıcı bilgisi bulunamadı!");
          }
        } catch (error) {
          console.error("API Hatası:", error);
          setError("Kullanıcı bilgileri alınamadı.");
        } finally {
          setLoading(false);
        }
      };

      const handleUpdate = async () => {
        if(!isEditing) return;
    
        if(email === adminInfo.email && password === adminInfo.password) {
          alert("No changes");
          return;
        }
    
        const decoded = jwtDecode(token);
        const id = decoded.id;
    
        try {
          const response = await axios.put(`https://localhost:7253/api/Admins/update/${id}`, {
            email, password
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
    
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("id", response.data.admin.id);
          }
    
          alert("Information update");
          setIsEditing(false);
        }catch(error) {
          console.error('Update error');
        }
      }

      useEffect(() => {
          if (adminInfo) {
            setEmail(adminInfo.email);
            setPassword(adminInfo.password);
          }
        }, [adminInfo]);


  return (
    <div className='navbar-container'>
      <h1>Your Profile</h1>
      <div className='navbar'>
        <div className='navbar-links'>
          <ul>
            <li>
              <button onClick={() => { fetchAdminInfo(); setAdminInfo(!adminInfo); }}>
                Personal Information
              </button>
            </li>
            </ul>
            </div>
           </div>


    {adminInfo && (
        <div className="wrapper-profile">
          <div className={`input-box ${isEditing ? "active" : ""}`}>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className={`input-box ${isEditing ? "active" : ""}`}>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!isEditing}
            />
           </div> 
           <button className='edit' onClick={() => setIsEditing(!isEditing)}>
              Edit
            </button>
            <button className='edit' onClick={handleUpdate}>Update</button>
           </div> 
        )
    }
           </div> 
  )
}

export default ProfilePageForAdmin