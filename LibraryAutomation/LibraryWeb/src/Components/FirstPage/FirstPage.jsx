//rafc
import React from 'react'
import './FirstPage.css'
import { Link } from "react-router-dom";

export const FirstPage = () => {
  return (
    <div className='lib'>
      <h1 className='title'>LIBRARY</h1>
        <div className='loginButtons'>
          <Link to = "/loginAsAdmin"><button>Login as Admin</button></Link>
          <Link to = "/loginAsUser"><button>Login as User</button></Link> 
        </div>

        <div className='registerButtons'>
          <Link to = "/registerAsAdmin"><button>Register as Admin</button></Link>
          <Link to = "/registerAsUser"><button>Register as User</button></Link> 
        </div>
        
    </div>
  )

}
export default FirstPage;
