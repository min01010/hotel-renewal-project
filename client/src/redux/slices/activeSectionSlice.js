// redux/slices/activeSectionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeSection: 0, // 초기 섹션은 0
};

const activeSectionSlice = createSlice({
  name: 'activeSection',
  initialState,
  reducers: {
    setActiveSection(state, action) {
      state.activeSection = action.payload; // 새로운 섹션 번호로 업데이트
    },
  },
});

export const { setActiveSection } = activeSectionSlice.actions;
export default activeSectionSlice.reducer;
