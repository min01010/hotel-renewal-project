// 사용자 상태 관리
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null,
  method: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      const { id, user_name, method } = action.payload;
      state.user = { id, user_name, method };
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.method = null; // 로그아웃 시 method도 초기화
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
