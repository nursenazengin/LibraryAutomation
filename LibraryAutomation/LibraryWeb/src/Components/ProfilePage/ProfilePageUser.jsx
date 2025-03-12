import React, { useState, useRef,useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import person from '../Assets/person.png'
import './ProfilePage.css'


const ProfilePageUser = () => {
      const [userInfo, setUserInfo] = useState(null);
      const [filter, setFilter] = useState("");
      const [isPunishmentFilter, setIsPunishmentFilter] = useState([]);
      const [borrowedId, setBorrowedId] = useState(null);
      const [borrowedBooks, setBorrowedBooks] = useState([]);
      const [selectedBookId, setSelectedBookId] = useState(null);
      const [bookInfo, setBookInfo] = useState([]);
      const [feeInfo, setFeeInfo] = useState(false);
      const [error, setError] = useState("");
      const [loading, setLoading] = useState(false);
      const [showInfo, setShowInfo] = useState(false);
      const [showBook, setShowBook] = useState(false);
      const [open, setOpen] = useState(false);
      const [openPun, setOpenPun] = useState(false);
      const [isEditing, setIsEditing] = useState(false);
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [openDropdown, setOpenDropdown] = useState(false);
      const navigate = useNavigate();
      const [returnedBook, setReturnedBook] = useState([]);
      const menuRef = useRef(null);


    const token = localStorage.getItem("token");

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (showInfo && !event.target.closest('.wrapper-profile') && !event.target.closest('button')) {
          setShowInfo(false);
        }
      };
  
      document.addEventListener('click', handleClickOutside);
      
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, [showInfo]);

  const fetchUserInfo = async () => {
    if (!token) {
      setError("Kullanıcı giriş yapmamış!");
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.id;
  

    try {
      const response = await axios.get(`https://localhost:7253/api/Users/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Yanıtı:", response.data);

      if (response.data.length > 0) {
        setUserInfo(response.data[0]); 
      } else {
        setError("Kullanıcı bilgisi bulunamadı!");
      }
    } catch (error) {
      console.error("API Hatası:", error);
      setError("Kullanıcı bilgileri alınamadı.");
    }
  };

  const handleUpdate = async () => {
    if(!isEditing) return;

    if(email === userInfo.email && password === userInfo.password) {
      alert("No changes");
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.id;

    try {
      const response = await axios.put(`https://localhost:7253/api/Users/update/${userId}`, {
        email, password
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id", response.data.user.id);
      }

      console.log("API’ye Gönderilen ID: ${userInfo.id}");

      alert("Information update");
      setIsEditing(false);
    }catch(error) {
      console.error('Update error');
    }

    
  }

  useEffect(() => {
      if (userInfo) {
        setEmail(userInfo.email);
        setPassword(userInfo.password);
      }
    }, [userInfo]);


    const fetchBorrowedBooks = async () => {
      if (!token) {
        setError("Kullanıcı giriş yapmamış!");
        return;
      }
  
      const decoded = jwtDecode(token);
      const userId = decoded.id;
    
      setLoading(true);
  
      try {
        const response = await axios.get(`https://localhost:7253/api/BorrowBooks/user_borrow_book/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("API Yanıtı:", response.data);
        if (response.data && Array.isArray(response.data)) {
          setBookInfo(response.data);
        } else {
          setBookInfo([]);

      }
  } catch (error) {
        console.error("API Hatası:", error);
        setError("Kullanıcı bilgileri alınamadı.");
      }
    };  

    useEffect(() => {
      fetchBorrowedBooks();
    }, []);


    useEffect(() => {
      const fetchAllBorrowedBooks = async () => {
        try {
          const response = await axios.get("https://localhost:7253/api/BorrowBooks");
          if (response.data && Array.isArray(response.data)) {
            setBorrowedBooks(response.data); 
          }
        } catch (error) {
          console.error("Ödünç alınan kitap bilgileri alınamadı:", error);
        }
      };
  
      fetchAllBorrowedBooks();
    }, []);


    //returned_at ayarlanıyor.
    const handleReturnBook = async (borrowed_id) => {
      try {
          const response = await axios.put(
              `https://localhost:7253/api/BorrowBooks/returned_book/${borrowed_id}`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("API Yanıtı returned:", response.data);
  
          if (response.status === 200) {
              fetchBorrowedBooks();
          } else {
              console.error("Kitap iade edilemedi");
          }
 
      } catch (error) {
          setError("Kitap iade edilirken hata oluştu.");
      }
  };
  

  //teslim edildikten sonraki ücret vs.
  const fetchReturnedBook = async (borrowed_id) => {
    try {
      const response = await axios.get(
        `https://localhost:7253/api/BorrowBooks/returned_book/${borrowed_id}`
      );
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        console.log("Fetched Returned Book:", response.data[0]); 
        setReturnedBook({ ...response.data[0] }); 
        setBorrowedId(borrowed_id); 
      } else {
        setReturnedBook(null);
        setBorrowedId(null);
      }
    } catch (error) {
      console.error("Kitap bilgileri alınamadı:", error);
      setError("İade edilen kitap bilgileri alınamadı.");
    }
  };  
  
    
  return (
    <div className='profile-container'>
      <div className='navbar'>
        <div className='navbar-links' ref={menuRef}>
          <ul>
            <li>
              <button  onClick={() => { fetchUserInfo(); 
                setShowInfo(prevState => !prevState); 
                }}>
                Personal Information
              </button>
            </li>
            <li onMouseEnter={() => setOpenDropdown(true)}
              onMouseLeave={() => setOpenDropdown(false)}>  
              <button className="myBooks">My Books</button>
              {openDropdown && bookInfo &&(
                <ul className="dropdown-auth">
                  <li onMouseEnter={() => setShowBook(true)}
                    onMouseLeave={() => setShowBook(false)}
                    style={{ position: "relative" }}>
                    <button>Returned Books</button>
                    {showBook && (
                      <ul className="dropdown-returned">
                        {[...new Map(                                             //... alt alta olması için 
                          bookInfo
                            .filter((book) => book.returned_at && !isNaN(new Date(book.returned_at)))
                            .map((book) => [new Date(book.returned_at).toLocaleDateString("tr-CA"), book]))
                            .keys()].map((date) => (
                          <li key={date}>
                            <button onClick={() => setFilter(date)}>
                              <p>{date}</p>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  <li>
                    <button onClick={() => setFilter("borrowed")}>Borrowed Books</button>
                  </li>
                </ul>
              )}
            </li>
              </ul>
        </div>

        <div className='profile' ref={menuRef}>
                    <img src={person} alt="Profile" 
                    className='person'
                    onClick={() => setOpen(!open)}
                    />
        
                    {open && ( 
                        <div className="dropdown-menu"
                            ref={menuRef}
                            onMouseEnter={() => setOpen(true)} 
                            onMouseLeave={() => setOpen(false)}
                            >
                        <ul>
                          <li onClick={() => navigate("/") }>Log out</li>
                        </ul>
                        </div>
                    )}
                </div>

      </div>


      {showInfo && userInfo && (
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
    
            <button className="edit" onClick={() => setIsEditing(!isEditing)}>
              Edit
            </button>
            <button className="edit" onClick={handleUpdate}>Update</button>

          </div>
          
        </div>
        
      )}

<div className="book-container">

      {filter === "borrowed" && (
        <>
          <ul className="book-list">
            {bookInfo
              .filter((book) => book.returned_at === "Borrowed")
              .map((book) => (
                <li key={book.book_id} className="book-item">
                  <img
                    src={`http://localhost:5038${book.book_image}`}
                    alt={book.book_name}
                    className="book-image"
                  />
                  <span className="book-name">{book.book_name}</span>
                  <p className="deadline">
                    <strong>Deadline:</strong>{" "}
                    {new Date(book.due_date).toLocaleDateString("tr-CA")}
                  </p>
                  <button className="returned-button deliver" 
                  onClick={() => handleReturnBook(book.borrowed_id)}>Deliver</button>
                </li> 
              ))}
          </ul>
        </>
      )}

<>
      {filter && (
        <ul className="book-list">
          {bookInfo
            .filter((book) => new Date(book.returned_at).toLocaleDateString("tr-CA") === filter)
            .map((book) => {
              const borrowedBook = borrowedBooks.find((bb) => bb.book_id === book.book_id);
              const borrowed_id = borrowedBook ? borrowedBook.borrowed_id : null;

              return (
                <li
                  key={book.book_id}
                  className="book-item"
                  onClick={() => {
                    if (borrowed_id) {
                      setSelectedBookId(book.book_id); 
                      fetchReturnedBook(borrowed_id); 
                    }
                  }}
                >
                  <img
                    src={`http://localhost:5038${book.book_image}`}
                    alt={book.book_name}
                    className="book-image"
                  />
                  <span className="book-name">{book.book_name}</span>
                  <button
                    className="returned-button delivered"
                  >
                    Penalty Fee
                  </button>
                  <span>{new Date(book.returned_at).toLocaleDateString("tr-CA")}</span>

                  
                    {borrowedId === borrowed_id && returnedBook?.fee !== undefined && (
                      <span className="book-fee">Fee: {returnedBook.fee.toFixed(2)}₺</span>
                    )}

                </li>
              );
            })}
        </ul>
      )}

      {error && <p className="error-message">{error}</p>}
    </>

    </div>


</div>
         )}   

export default ProfilePageUser;
