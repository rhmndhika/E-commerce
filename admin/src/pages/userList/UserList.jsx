import React, { useState, useEffect } from "react";
import "./userList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { userRows } from "../../dummyData";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getUserList } from "../../redux/apiCalls";
import { format } from "timeago.js";

export default function UserList() {
  const [data, setData] = useState(userRows);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.userList);

  console.log(users)

  useEffect(() => {
    getUserList(dispatch)
  }, [dispatch])


  const handleDelete = (id) => {
    // setData(data.filter((item) => item.id !== id));
    deleteUser(dispatch, id)
  };
  
  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "user",
      headerName: "User",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.avatar} alt="" />
            {params.row.username}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "isAdmin",
      headerName: "Admin",
      width: 120,
    },
    // {
    //   field: "transaction",
    //   headerName: "Transaction Volume",
    //   width: 160,
    // },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      width: 180,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            {format(params.row.createdAt)}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/user/" + params.row._id}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="userList">
      <DataGrid
        rows={users}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}
