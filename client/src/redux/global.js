import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    modal: false,
    error: "",
    isError: false,
    isFetfching: true
};
  
  const global = createSlice({
    name: "global",
    initialState,
    reducers: {
      setModal: (state, action) => {
        state.modal = action.payload;
      },
      setError: (state, action) => {
        state.error = action.payload;
        state.isError = true;
      }
    }
  });
  
  export const { setModal, setError } = global.actions
  export default global.reducer;

