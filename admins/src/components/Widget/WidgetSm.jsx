import React, { useState, useEffect} from 'react';
import { userRequest } from '../../useFetch';
import { Button, Text, VisuallyHidden } from '@chakra-ui/react';
import "./WidgetSm.css";
import {
  MdVisibility
} from 'react-icons/md'
import { Link } from 'react-router-dom';

export default function WidgetSm() {

  const [ users, setUsers ] = useState([]);

  // useEffect(() => {
  //   const getUsers = async () => {
  //     try {
  //       const res = await userRequest.get("/users/?new=true")
  //       setUsers(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getUsers();
  // }, [])

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await userRequest.get("/profiles/?new=true")
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, [])

  console.log(users)

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <ul className="widgetSmList">
        { users?.map((user) => (
          <li className="widgetSmListItem">
          <img
            src={user.img}
            alt="img"
            className="widgetSmImg"
            />
          {user.userId?.username ?
          <div className="widgetSmUser">
            <span className="widgetSmUsername">{user.userId?.username}</span>
          </div>
          :
          <div className="widgetSmUser">
            {/* <span className="widgetSmUsername">This person does not have profile yet.</span> */}
            <Text className="widgetSmUsername" textAlign="center">This person does not have profile yet.</Text>
          </div>
          }
          {user.userId?.username ?
          <Link to={`/user/${user.userId?._id}`}>
            <Button leftIcon={<MdVisibility />} className="widgetSmButton">
              Display
            </Button>
          </Link>
          :
          <Link>
            <Button leftIcon={<MdVisibility />} className="widgetSmButton" isDisabled>
              Display
            </Button>
          </Link>
          }
          </li>
        ))}
      </ul>
    </div>
  );
}
