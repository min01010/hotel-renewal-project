// 사용자 상태 관리
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  userInfo: null

  // userInfo: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      console.log("payload", action.payload); 
      const { id, user_name, method } = action.payload;
      state.isLoggedIn = true;
      state.userInfo = { id, user_name, method };
      console.log("로그인 상태 변경됨", JSON.parse(JSON.stringify(state)));
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userInfo = null;
      //state.method = null; // 로그아웃 시 method도 초기화
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
