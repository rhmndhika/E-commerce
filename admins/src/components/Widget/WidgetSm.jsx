import React, { useState, useEffect} from 'react';
import { userRequest } from '../../useFetch';
import { Button, VisuallyHidden } from '@chakra-ui/react';
import "./WidgetSm.css";
import {
  MdVisibility
} from 'react-icons/md'
import { Link } from 'react-router-dom';

export default function WidgetSm() {

  const [ users, setUsers ] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await userRequest.get("/users/?new=true")
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, [])

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <ul className="widgetSmList">
        { users.map((user) => (
          <li className="widgetSmListItem">
          <img
            src={user.img || "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"}
            alt="img"
            className="widgetSmImg"
            />
          <div className="widgetSmUser">
            <span className="widgetSmUsername">{user.username}</span>
          </div>
          <Link to={`/user/${user._id}`}>
            <Button leftIcon={<MdVisibility />} className="widgetSmButton">
              Display
            </Button>
          </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
