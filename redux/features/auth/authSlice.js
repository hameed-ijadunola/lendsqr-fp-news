import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
  token: null,
  token2: null,
  changeCode: '',
  location: false,
  camera: false,
  audio: false,
  photo: false,
};

export const authSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    saveUser: (state, { payload }) => {
      state.user = payload;
    },
    saveToken: (state, { payload }) => {
      state.token = payload;
    },

    logout: (state) => {
      state.token = '';
      state.user = {};
    },
  },
});

export const { saveUser, saveToken, logout } = authSlice.actions;

export default authSlice.reducer;
