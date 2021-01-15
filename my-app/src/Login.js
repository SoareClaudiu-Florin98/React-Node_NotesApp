
import './Login.css';
import Notes4You from './Notes4You';
import React, { useContext, useEffect, useState } from 'react'

const Login=() =>{
const [isActive,setIsActine]= useState(true) ; 
const handleButtonLogin = ()=>{
  setIsActine(false) ; 
}

if(isActive){
  return(
    <div> 
      <form>
      <div class="login">
      <h1>Login</h1>           
          <input type="text"  placeholder="Username" required="required" />
            <input type="password"  placeholder="Password" required="required" />
            <button type="submit" class="btn btn-primary btn-block btn-large"  onClick={handleButtonLogin} >Let me in.</button>
      </div>
      </form>
    
      </div>
    ) 
}
else{
  return(
    <div>
      <Notes4You/>

    </div>

  )

}

}
export default Login