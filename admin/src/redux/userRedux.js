import { createSlice } from '@reduxjs/toolkit'


const userSlice = createSlice({
    name: "user",
    initialState: {
       currentUser: null,
       userList: [],
       isFetching: false,
       error: false
    },
    reducers: {
        loginStart: (state) => {
            state.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = action.payload;
        },
        loginFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        logout: (state) => {
            state.currentUser = null
        },
         //GET ALL
        getUsersStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        getUsersSuccess: (state, action) => {
            state.isFetching = false;
            state.userList = action.payload;
        },
        getUsersFailure: (state) => {
            state.isFetching = true;
            state.error = true;
        },
        //DELETE
        deleteUsersStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        deleteUsersSuccess: (state, action) => {
            state.isFetching = false;
            state.userList.splice(
                state.userList.findIndex((item) => item._id === action.payload),1
            )
        },
        deleteUsersFailure: (state) => {
            state.isFetching = true;
            state.error = true;
        },
        //UPDATE
        updateUsersStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateUsersSuccess: (state, action) => {
            state.isFetching = false;
            state.userList[state.userList.findIndex((item) => item._id === action.payload.id)] = action.payload.user;
        },
        updateUsersFailure: (state) => {
            state.isFetching = true;
            state.error = true;
        },
        //ADD
        addUsersStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        addUsersSuccess: (state, action) => {
            state.isFetching = false;
            state.userList.push(action.payload);
        },
        addUsersFailure: (state) => {
            state.isFetching = true;
            state.error = true;
        },
        }
})

export const { 
    loginStart, 
    loginSuccess, 
    loginFailure, 
    logout,
    getUsersStart,
    getUsersSuccess,
    getUsersFailure,
    deleteUsersStart,
    deleteUsersSuccess,
    deleteUsersFailure,
    updateUsersStart,
    updateUsersFailure,
    updateUsersSuccess,
    addUsersStart,
    addUsersSuccess,
    addUsersFailure
} = userSlice.actions
export default userSlice.reducer;