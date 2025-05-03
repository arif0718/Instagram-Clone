import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:[],
    },
    reducers:{
        //actions
        setAuthUser:(state,action) => {
            state.user = action.payload;
        },
        setSuggestedUsers:(state,action) => {
            state.suggestedUsers = action.payload;
        }
    }
});
export const {setAuthUser, setSuggestedUsers} = authSlice.actions;
export default authSlice.reducer;