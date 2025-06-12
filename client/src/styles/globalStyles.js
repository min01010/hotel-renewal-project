import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    font-family: 'Nanum Myeongjo', serif;
    /* font-family: 'Shippori Mincho', serif; */
    /* font-family: 'Waterfall', cursive;*/
    margin: 0 !important;
    padding: 0 !important;
    textDecoration: "none"
  }

  ol, ul {
	  list-style: none;
  }

  /* Link 태그도 내부적으로 a 태그를 사용하기 때문에 a에 전역적으로 스타일 지정하면 됨됨 */
  a {
    text-decoration: none; /* 모든 링크의 밑줄 제거 */
  }

  a:visited {
    color: inherit; /* 방문한 후에도 같은 색상 유지 */
  }

  button {
    all: unset;  /* 모든 기본 스타일 제거 */
    background: none; /* 배경 제거 */
    border: none; /* 테두리 제거 */
    padding: 0; /* 패딩 제거 */
    font: inherit; /* 폰트 스타일을 부모로부터 상속 */
    cursor: pointer; /* 마우스를 올렸을 때 포인터로 변경 */
  }
`;

export default GlobalStyle;
