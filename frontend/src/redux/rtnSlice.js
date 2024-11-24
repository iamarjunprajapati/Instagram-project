import { createSlice } from "@reduxjs/toolkit";
const rtnSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        likeNotification: [],
    },
    reducers: {
        // Actions
        setLikeNotification: (state, action) => {
            if (!state.likeNotification) {
                state.likeNotification = [];
            }
            if (action.payload && action.payload.type === 'like') {
                state.likeNotification.push(action.payload);
            } else if (action.payload && action.payload.type === 'dislike') {
                state.likeNotification = state.likeNotification.filter((item)=> item.userId !== action.payload.userId)
            }
        },

    }
});

export const { setLikeNotification } = rtnSlice.actions;
export default rtnSlice.reducer;