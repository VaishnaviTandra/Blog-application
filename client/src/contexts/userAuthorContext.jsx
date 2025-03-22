import { createContext ,useState,useEffect} from "react";
export const userAuthorContextobj=createContext();
import React from 'react'

function userAuthorContext({children}) {
    let [currentUser,setCurrentUser]=useState({
        firstName:'',
        lastName:" ",
        email:" ",
        profileImageUrl:" ",
        role:""
    })
    useEffect(()=>{
      const userInStorage=localStorage.getItem('currentUser')
      if(userInStorage){
        setCurrentUser(JSON.parse(userInStorage))
      }
    },[])
  return (
   <userAuthorContextobj.Provider value={{currentUser,setCurrentUser}}>
    {children}
   </userAuthorContextobj.Provider>
  )
}
export default userAuthorContext