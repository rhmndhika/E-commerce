import React from 'react';
import {createContext, useState} from "react"
export const IsUserProfile = createContext({});
export default function UserProvileProvider({children}) {
  const [ userProfileData, setUserProfileData] = useState([]);
  return (
    <IsUserProfile.Provider value={{ userProfileData, setUserProfileData }}>
     {children}
    </IsUserProfile.Provider>
  );
}