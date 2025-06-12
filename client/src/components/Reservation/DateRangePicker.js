// DateRangePicker.js
import React, { useState, useRef} from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import styled from "styled-components";
import { ko } from "date-fns/locale"; // 한국어 설정

const DateRangePicker = ({ selectedDates, setSelectedDates }) => {
  const pickerRef = useRef(null);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [tempDates, setTempDates] = useState({
    startDate: selectedDates.startDate || today,
    endDate: selectedDates.endDate || tomorrow,
  });
  const [calendarFocus, setCalendarFocus] = useState(undefined); // calendarFocus 상태 관리
  const leftCalendarRef = useRef(today); // 현재 보이는 왼쪽 달력의 월 저장

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
 // 현재 보이는 왼쪽 달력의 연도/월
 const leftMonth = leftCalendarRef.current.getMonth();
 const leftYear = leftCalendarRef.current.getFullYear();

 // 오른쪽 달력의 연도/월 (왼쪽 달력의 다음 달)
 const rightDate = new Date(leftCalendarRef.current);
 rightDate.setMonth(leftMonth + 1);
 const rightMonth = rightDate.getMonth();
 const rightYear = rightDate.getFullYear();

 // 선택한 날짜가 왼쪽 달력인지 확인
 const isLeft =
   startDate.getFullYear() === leftYear && startDate.getMonth() === leftMonth;

 // 선택한 날짜가 오른쪽 달력인지 확인
 const isRight =
   startDate.getFullYear() === rightYear && startDate.getMonth() === rightMonth;

  // console.log("현재 보이는 왼쪽 달력:", leftYear, leftMonth + 1, "월");
  // console.log("현재 보이는 오른쪽 달력:", rightYear, rightMonth + 1, "월");
  // console.log("선택한 날짜:", startDate);
  // console.log("왼쪽 달력에서 선택?", isLeft);
  // console.log("오른쪽 달력에서 선택?", isRight);

  //   console.log("tempDates.startDate: ", tempDates.startDate);
  //   console.log("startDate: ", startDate);
  //   console.log("tempDates.endDate: ",tempDates.endDate);
  //   console.log("endDate: ",endDate);
  //   console.log("==============================================");
    
    let focus = "forward";
     if(isRight){
        focus ="backwards";
      }else if(isLeft){
        focus = "forward";
      }
    // 시작 날짜만 선택한 경우
    if (!tempDates.startDate || startDate.getTime() !== tempDates.startDate.getTime()) {
      setTempDates({ startDate, endDate: null });
    } else if (endDate && startDate.getTime() !== endDate.getTime()) {
      // 시작 날짜와 종료 날짜를 선택한 경우
      setTempDates({ startDate, endDate }); // 우리가 클릭
      setSelectedDates({ startDate, endDate }); // 예약바
    }  else if (tempDates.startDate && startDate.getTime() === tempDates.startDate.getTime()) {
      setTempDates({ startDate, endDate: null });
    }
    setCalendarFocus(focus);
  };
  const handleShownDateChange = (date) => { // date는 내가 선택한 달(날짜?)
    const leftDate = new Date(date);
    // 왼쪽 달력을 한 달 전으로 설정
    if (calendarFocus === "backwards") {
      leftDate.setMonth(date.getMonth() - 1);
    }
    console.log("왼쪽 달력 월 업데이트 :", leftDate);
    // leftCalendarRef를 업데이트
    leftCalendarRef.current = leftDate;
  };
  return (
    <DateRangeContainer>
      <DateRange
        ref={pickerRef}
        editableDateInputs={true}
        onChange={handleSelect}
        moveRangeOnFirstSelection={false}
        onShownDateChange={handleShownDateChange}
        showMonthAndYearPickers={false}  // 연도 및 월 선택 드롭다운 제거
        showDateDisplay={false} // 선택한 날짜 표시되는 네모 박스 제거
        // onShownDateChange={(date) => {
        //   const leftDate = new Date(date);
        //   leftDate.setMonth(date.getMonth()); // 오른쪽 달력 기준이므로 왼쪽 달력은 한 달 전
        //   console.log("왼쪽 달력 월 업데이트 :", leftDate);
        //   leftCalendarRef.current = leftDate;
        // }}
        ranges={[{
          startDate: tempDates.startDate,
          endDate: tempDates.endDate || tempDates.startDate, // endDate가 없으면 startDate로 설정
          key: "selection",
        }]}
        calendarFocus={calendarFocus} 
        months={2}
        direction="horizontal"
        rangeColors={["#3d91ff"]}
        minDate={today}
        locale={ko}
      />
    </DateRangeContainer>
  );
};


const DateRangeContainer = styled.div`
  display: flex; 
  width: auto; /* 크기를 내용에 맞춤 display:inline-block + width:auto */
  height: 30%;
  padding: 30px;

  .rdrMonthAndYearPickers {
    display: none; // 연도 및 월 표시 숨김
  }

  .rdrCalendarWrapper {
    display: inline-block;
    //display: flex;
    flex-wrap: wrap;  /* 여러 줄로 배치되도록 설정 */
    font-size: 15px;
  }

  .rdrMonthAndYearWrapper {
    display: flex;
    justify-content:space-between;
  }
    
  .rdrNextPrevButton {
    position: relative;
    width: 15px;
    height: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
  }
  .rdrNextPrevButton i {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
}
.rdrNextButton::after,
.rdrPprevButton::after {
  content: '›'; /* 또는 '‹' */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  color: black;
  pointer-events: none;
}

.rdrPprevButton::after {
  content: '‹';
}
.rdrPprevButton {
  order: 1;  /* 1번 */
}

.rdrNextButton {
  order: 4;  /* 2번 (나중에 표시될 순서) */
}
.rdrMonthName{
  font-size:20px;
  text-align: center;
  padding: 0px;
  margin-bottom: 16px;
  color: #333;
}
/* 달력 두개 div */
.rdrMonths {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between; /* 달력을 좌우로 균등 배치 */
  gap: 10px;
  width: 100%;
}
/* 각 달력 */
.rdrMonth {
  order: 2;  /* 3번 */
  //flex: 1; /* 달력이 가로로 유동적으로 배치되도록 설정 */
  //width: 50%
  //min-width: 0; /* flex 아이템이 자동으로 줄어들 수 있도록 설정 */
  width: 350px;  
  height: auto; 
  margin-top: -40px;
}

.rdrMonth + .rdrMonth {
  order: 3;  /* 4번 (두 번째 월) */
}
  
/* 클릭된 날짜(기간) */
.rdrSelected,
.rdrStartEdge,
.rdrEndEdge,
.rdrInRange,
.rdrDayInRange {
  background-color: #83583B !important;
}
.rdrDayInRange {
  border: 2px solid #83583B !important; 
}

/* 날짜에 마우스 올렸을 때 */
.rdrDayHovered{
  color: #83583B !important;
}
.rdrDayStartPreview { // 시작
  color: #83583B !important;
}
.rdrDayInPreview { // 중간
  color: #83583B !important;
}
.rdrDayEndPreview { // 끝
  color: #83583B !important;
}
/* 오늘 날짜 표시 */
.rdrDayToday span ::after{
  background:  #83583B;
}



/* 선택된 날짜의 텍스트 색상 */
.rdrDayNumber span {
  // color: white !important; /* 텍스트 색상 변경 */
}

`;
export default DateRangePicker;