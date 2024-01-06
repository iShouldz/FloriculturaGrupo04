import { createSlice } from "@reduxjs/toolkit";

const initialUsersState = { users: [], isLogado: false, cart: [] };

const userSlice = createSlice({
  name: "users",
  initialState: initialUsersState,
  reducers: {
    handleUpdateLogin(state){
        state.isLogado = !state.isLogado
    },
    handleCartAdd(state, action){
      console.log(action.payload)
        state.cart.push(action.payload)
    }
  },
});

export default userSlice;
export const userActions = userSlice.actions;
