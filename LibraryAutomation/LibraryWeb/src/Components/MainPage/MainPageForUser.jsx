//rafce
import React from 'react'
import { useNavigate } from "react-router";
import {useState, useRef, useEffect} from 'react'
import './MainPage.css'
import person from '../Assets/person.png'
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { fetchBooks } from '../../api';


const MainPageForUser = () => {
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [open, setOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState([]);
    const navigate = useNavigate();
    const menuRef = useRef(null);   

    useEffect(() => {
      axios.get("https://localhost:7253/api/Categories")
      .then(response => setCategories(response.data))
      .catch(error => console.error("API'den veri çekerken hata:", error));

      axios.get("https://localhost:7253/api/Authors")
      .then(response => setAuthors(response.data))
      .catch(error => console.error("API'den veri çekerken hata:", error));


    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };


    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);


    useEffect(() => {
      fetchBooks(setSelectedBooks)
    },[]);


    const fetchBooksByCategoryId = async (category_id) => {
      try {
      setSelectedCategory(category_id);
      setSelectedBooks([]);

      const response = await axios.get(
        `https://localhost:7253/api/Books/category/${category_id}`
        );

      setSelectedBooks(response.data) ;

    } catch (error) {
      console.error("API'den veri çekerken hata:", error);
    }
  };
 

    const fetchBooksByAuthorId = async (author_id) => {
      try {
      setSelectedAuthor(author_id);
      setSelectedBooks([])
      const response = await axios.get(
        `https://localhost:7253/api/Books/author/${author_id}`
        )
      setSelectedBooks(response.data)
      }

      catch (error) {
        console.error("API'den veri çekerken hata:", error);
    }
  };


    const handleBorrow = async (bookId) => {
      try {
        const stockResponse = await axios.post(
          `https://localhost:7253/api/Books/stock/${bookId}`
        );

        const token = localStorage.getItem("token");
        if (!token) {
          alert("Kullanıcı giriş yapmamış!");
          return;
        }


        const decoded = jwtDecode(token);
        const userId = decoded.id;
       
        if(stockResponse.data.remainingStock > 0) {
          try {
            const userBorrow = await axios.get(
              `https://localhost:7253/api/BorrowBooks/user/${userId}/book/${bookId}`
            );

            console.log("data",userBorrow.data)

            if (userBorrow.data && userBorrow.data.isBorrowed === true) {
              alert("Bu kitabı zaten ödünç aldınız!");
              return;
            }

            console.log("API'den gelen isBorrowed değeri:", userBorrow.data.isBorrowed);


            await axios.post(
              `https://localhost:7253/api/BorrowBooks`,
              { book_id: bookId, user_id: userId },
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
              
            )
            alert("Book is borrowed")
          } catch (error) {
            console.error("Kitap ödünç alınırken hata oluştu:", error);
          }
        } 
        
      } catch (error) {
        console.error("Stok kontrol hatası:", error);
        alert(error.response?.data?.message || "Bir hata oluştu.");
      }
    };

 
  return (
    <div className='navbar-container'>
    <div className='navbar'>
      <div className='navbar-links'>
        <ul>
          <li>
              <li> 
              <button onClick={() => fetchBooks(setSelectedBooks)}>Books</button>
              </li>
            <li 
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <span>Categories</span>
              {showDropdown && (
                <ul className="dropdown-cat" >
                  {categories.map((category) => (
                    <li key={category.category_id}>
                       <button onClick={() => fetchBooksByCategoryId(category.category_id)}>
                        {category.name}</button>
                       </li>
                       
                  ))}
                  
                </ul>   
              )}
            </li>

            <li 
              onMouseEnter={() => setOpenDropdown(true)}
              onMouseLeave={() => setOpenDropdown(false)}
            >
              <span>Authors</span>
              {openDropdown && (
                <ul className="dropdown-auth" >
                  {authors.map((author) => (
                    <li key={author.author_id}> 
                    <button onClick={() => fetchBooksByAuthorId(author.author_id)}>
                      {author.name}</button>
                      </li>
                  ))}
                </ul>
              )}
            </li>
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
                  <li onClick={() => navigate("/profilePageAsUser")} >Profile</li>
                  <li onClick={() => navigate("/") }>Log out</li>
                </ul>
                </div>
            )}
        </div>

    </div>
    {selectedBooks && (
          <div className='book-container'>
              <ul className="book-list" >
              {selectedBooks.map((book) => ( 
                <li>
                       
                      <li className='book-item'>
                              <img src={`http://localhost:5038${book.image_url}`} alt={book.name} className='book-image' />
                              <span className='book-name'>{book.name}</span>
                              
                          </li>  
                  <li>
                    <button className="borrow-button" onClick={() => handleBorrow(book.book_id)}>Borrow</button>
                  </li>
                   
                </li>
))}
              </ul>            
              </div>
        )}
    </div>
  )
}

export default MainPageForUser;