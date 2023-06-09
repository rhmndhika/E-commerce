import React, { useEffect, useContext } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { IsUserProfile } from './helper/UserProfileProvider';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const { userProfileData } = useContext(IsUserProfile);

  useEffect(() => {
    if (userProfileData.length === 0) {
      navigate("/welcome");
    }
    
  }, [userProfileData, navigate]);

  return <>{children}</>;
};

export default PrivateRoute;
