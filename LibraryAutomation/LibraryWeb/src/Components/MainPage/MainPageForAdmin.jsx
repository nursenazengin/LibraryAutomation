import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { fetchBooks } from '../../api';
import person from '../Assets/person.png'
import { useNavigate } from "react-router";

const MainPageForAdmin = () => {
  const [showBookDropdown, setShowBookDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [openBook,setOpenBook] = useState(false);
  const [openBooks,setOpenBooks] = useState(false);
  const [openCategory,setOpenCategory] = useState(false);
  const [openCategories,setOpenCategories] = useState(false);
  const [openAuthor,setOpenAuthor] = useState(false);
  const [openAuthors,setOpenAuthors] = useState(false);
  const [openUsers, setOpenUsers] = useState(false);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const formattedCategoryId = categoryId.toString();
  const formattedAuthorId = authorId.toString();
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {

      axios.get("https://localhost:7253/api/Categories")
      .then(response => setCategories(response.data))
      .catch(error => console.error("API'den veri çekerken hata:", error));

      axios.get("https://localhost:7253/api/Authors")
      .then(response => setAuthors(response.data))
      .catch(error => console.error("API'den veri çekerken hata:", error));

      axios.get("https://localhost:7253/api/Users")
      .then(response => setUsers(response.data))
      .catch(error => console.error("API'den veri çekerken hata:", error));

      if (openBook.current && !openBook.current.contains(event.target)) {
        setOpenBook(false);
      }
      if (openCategory.current && !openCategory.current.contains(event.target)) {
        setOpenCategory(false);
      }
      if (openBooks.current && !openBooks.current.contains(event.target)) {
        setOpenBooks(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (openCategories.current && !openCategories.current.contains(event.target)) {
        setOpenCategories(false);
      }
    };


    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  })

   const fetchAddBook = async () => {

      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("author_id", formattedAuthorId);
        formData.append("stock", stock);
        formData.append("category_id", formattedCategoryId);
        if (image) {
          formData.append("image_url", image);
        }
        
        console.log("Gönderilen API Verisi:", formData);
      
        const response = await axios.post(`https://localhost:7253/api/Books`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      
        console.log(response.data);
  
        if (response.status === 200) {
          alert("Book created correctly!");
          window.location.reload();
        }
      
      } catch (error) {
        console.error("Error adding book:", error);
        alert("An error occurred while adding the book.");
      }
}

  const fetchAddCategory = async () => {
    try{
      const response = await axios.post(`https://localhost:7253/api/Categories`, {
        name: categoryName
      });
      alert("Category created successfully!");
      window.location.reload();

  } catch(err) {
    alert("An error occurred while adding the category.");
  }

  }

  const fetchAddAuthor = async () => {
    try {
      const response = await axios.post(`https://localhost:7253/api/Authors`, {
        name: authorName
      });
      alert("Author created successfully!");
      window.location.reload();

    } catch(err) {
      alert("An error occurred while adding the author.");
    }
  }

  useEffect(() => {
    fetchBooks(setBooks)
  },[]);

  const fetchDeleteBook = async (book_id) => {
    try {
      const response = await axios.delete(`https://localhost:7253/api/Books/${book_id}`
      )
      console.log(response.data);
      alert("Book deleted successfully!");
      window.location.reload();
    }
    catch(err) {
      alert("An error occurred while deleting the book.");
    }
  }

  const fetchDeleteCategory = async (category_id) => {
    try{
      const response = await axios.delete(`https://localhost:7253/api/Categories/${category_id}`)
      alert("Category deleted successfully!");
      window.location.reload();
    }
    catch(err) {
      alert("An error occurred while deleting the category.");
    }
  }

  const fetchDeleteAuthor = async (author_id) => {
    try{
      const response = await axios.delete(`https://localhost:7253/api/Authors/${author_id}`)
      alert("Author deleted successfully!");
      window.location.reload();
    }
    catch(err) {
      alert("An error occurred while deleting the category.");
    }
  }

  const fetchDeleteUser = async (id) => {
    try{
      const response = await axios.delete(`https://localhost:7253/api/Users/${id}`)
      alert("User deleted successfully!");
      window.location.reload();
    }
    catch(err) {
      alert("An error occurred while deleting the user.");
    }
  }

  return (
    <div className='navbar-container'>
      <div className='navbar'>
        <div className='navbar-links'>
          <ul>
            <li onMouseEnter={() => setShowBookDropdown(true)}
              onMouseLeave={() => setShowBookDropdown(false)}
              >
                <span>Books</span>
                {showBookDropdown && (
                  <ul className='dropdown-book'>
                    <li><button onClick={() => setOpenBook(!openBook)}>
                      Add Book</button></li>
                    <li><button onClick={() => {fetchBooks(setBooks); setOpenBooks(!openBooks)}}>
                      Delete Book</button></li>     
                  </ul>
                )}
              </li>
              <li onMouseEnter={() => setShowCategoryDropdown(true)}
              onMouseLeave={() => setShowCategoryDropdown(false)}
              >
                <span>Categories</span>
                {showCategoryDropdown && (
                  <ul className='dropdown-cat'>
                      <li><button onClick={() => setOpenCategory(!openCategory)}>
                        Add Category</button></li>
                      <li><button onClick={() => {setOpenCategories(!openCategories)}}>
                        Delete Category</button></li> 
                  </ul>
                )}
              </li>
              <li onMouseEnter={() => setShowAuthorDropdown(true)}
              onMouseLeave={() => setShowAuthorDropdown(false)}
              >
                <span>Authors</span>
                {showAuthorDropdown && (
                  <ul className='dropdown-auth'>
                      <li><button onClick={() => setOpenAuthor(!openAuthor)}>
                        Add Author</button></li>
                      <li><button onClick={() => setOpenAuthors(!openAuthors)}>
                        Delete Author</button></li> 
                  </ul>
                )}
              </li>

              <li onMouseEnter={() => setShowUserDropdown(true)}
              onMouseLeave={() => setShowUserDropdown(false)}
              >
                <span>Users</span>
                {showUserDropdown && (
                  <ul className='dropdown-user'>
                      <li><button onClick={() => setOpenUsers(!openUsers)}>
                        Delete User</button></li> 
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
                        <li onClick={() => navigate("/profilePageAsAdmin")}>Profile</li>
                        <li onClick={() => navigate("/") }>Log out</li>
                      </ul>
                      </div>
                  )}
              </div>

      </div>

      {openBook && (
        <div className='wrapper-profile'>
          <div className='input-box'>
            <input type="text"
            value={name}
            placeholder='Book Name'
            onChange={(e) => setName(e.target.value)}
             />
          </div>
          <div className='input-box'>
            <input type="text"
            value={categoryId}
            placeholder='Category Id'
            onChange={(e) => setCategoryId(e.target.value)}
             />
          </div>
          <div className='input-box'>
            <input type="text"
            value={authorId}
            placeholder='Author Id'
            onChange={(e) => setAuthorId(e.target.value)}
             />
          </div>
          <div className='input-box'>
            <input type="text"
            value={stock}
            placeholder='Stock'
            onChange={(e) => setStock(e.target.value)}
             />
          </div>
          <div className='input-box'>
            <input type="file"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
             />
          </div>
          <button className='admin-button' onClick={() => fetchAddBook()}>
            Add</button>
        </div>
      )}

      {openCategory && (
        <div className='wrapper-profile'>
          <div className='input-box'>
          <input type="text" 
          placeholder='Category Name'
          value={categoryName} 
          onChange={(e) => setCategoryName(e.target.value)}/>
        </div>
        <button className='admin-button' onClick={() => fetchAddCategory()}>
          Add
        </button>
        </div>
      )}

      {openAuthor && (
        <div className='wrapper-profile'>
          <div className='input-box'>
            <input type="text" 
            value={authorName}
            placeholder='Author Name'
            onChange={(e) => setAuthorName(e.target.value)}/>
          </div>
          <button className='admin-button' onClick={() => fetchAddAuthor()}>
            Add
          </button>
        </div>
      )}

      {openBooks && (
          <div className='book-container'>
              <ul className="book-list" >
              {books.map((book) => ( 
                <li>
                       
                      <li className='book-item'>
                              <img src={`http://localhost:5038${book.image_url}`} alt={book.name} className='book-image' />
                              <span className='book-name'>{book.name}</span>
                              
                          </li>                  
                  <li>
                    <button className="borrow-button" 
                    onClick={() => fetchDeleteBook(book.book_id)}>
                      Delete</button>
                  </li>
                   
                </li>
))}
              </ul>            
              </div>
        )}

      {openCategories && (
          <div className='book-container'>
              <ul className="book-list" >
              {categories.map((category) => ( 
                <li>
                       
                      <li className='book-item'>
                              <span className='book-name'>{category.name}</span>
                              
                          </li>                  
                  <li>
                    <button className="borrow-button" 
                    onClick={() => fetchDeleteCategory(category.category_id)}>
                      Delete</button>
                  </li>
                   
                </li>
))}
              </ul>            
              </div>
        )}

      {openAuthors && (
          <div className='book-container'>
              <ul className="book-list" >
              {authors.map((author) => ( 
                <li>
                       
                      <li className='book-item'>
                              <span className='book-name'>{author.name}</span>
                              
                          </li>                  
                  <li>
                    <button className="borrow-button" 
                    onClick={() => fetchDeleteAuthor(author.author_id)}>
                      Delete</button>
                  </li>
                   
                </li>
))}
              </ul>            
              </div>
        )}

      {openUsers && (
          <div className='book-container'>
              <ul className="book-list" >
              {users.map((user) => ( 
                <li>
                       
                      <li className='book-item'>
                              <span className='book-name'>{user.email}</span>
                              
                          </li>                  
                  <li>
                    <button className="borrow-button" 
                    onClick={() => fetchDeleteUser(user.id)}>
                      Delete</button>
                  </li>
                   
                </li>
))}
              </ul>            
              </div>
        )}

    </div>
  )
}

export default MainPageForAdmin;
