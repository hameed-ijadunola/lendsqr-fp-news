import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  newsFeed: [],
};

export const newsSlice = createSlice({
  name: 'newsFeed',
  initialState,
  reducers: {
    setNewsFeed: (state, { payload }) => {
      state.newsFeed = payload;
    },
  },
});

export const { setNewsFeed } = newsSlice.actions;

export default newsSlice.reducer;
