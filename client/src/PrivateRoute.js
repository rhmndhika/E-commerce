import React, { useEffect, useState } from 'react';
import { Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { userMethod } from './useFetch';


const PrivateRoute = ({ element: Element, ...rest }) => {
  const [userProfile, setUserProfile] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userMethod.get(`/profile/${tokenUserId}`);
        setUserProfile(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserProfile();
  }, [location.pathname]);

  if (userProfile) {
    return <Element />;
  } else {
    return <Navigate to="/welcome" replace={true} />;
  }
};

export default PrivateRoute;
