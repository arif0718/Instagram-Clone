import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [], // [1,2,3]
  },
  reducers: {
    setLikeNotification: (state, action) => {
      if (action.payload.type === "like") {
        state.likeNotification.push(action.payload);
      } else if (action.payload.type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== action.payload.userId
        );
      }
    },
    clearLikeNotification: (state) => {
      state.likeNotification = [];
    },
  },
});
export const { setLikeNotification, clearLikeNotification } = rtnSlice.actions;
export default rtnSlice.reducer;
