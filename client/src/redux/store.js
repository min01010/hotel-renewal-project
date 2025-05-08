import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import roomReducer from "./slices/roomSlice";
import activeSectionReducer from "./slices/activeSectionSlice"; // 추가

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

// persist 설정
const persistConfig = {
  key: "root",
  storage, // 저장 위치(redux-persist/lib/storage->브라우저의 localStorage를 기본 저장소로 사용)
  whitelist: ["user"], // user 상태만 persist 적용
};

// 개별 persistReducer 설정
const userPersistedReducer = persistReducer(persistConfig, userReducer);

// 루트 리듀서 설정
const rootReducer = combineReducers({
  user: userPersistedReducer,
  rooms: roomReducer,
  activeSection: activeSectionReducer, // activeSection 상태는 persist 적용하지 않음
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// persistor 생성
const persistor = persistStore(store);

export default store;
export { persistor };
