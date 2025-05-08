// 날짜 관련 유틸 함수
import { isWeekend } from "date-fns";

// 주말 비활성화 함수
export const isDisabledDate = (date) => isWeekend(date);

// 최대 선택 가능 일수 제한
export const isValidRange = (startDate, endDate, maxDays = 30) => {
  const diff = (endDate - startDate) / (1000 * 60 * 60 * 24);
  return diff <= maxDays;
};
