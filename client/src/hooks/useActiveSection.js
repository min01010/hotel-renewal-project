// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setActiveSection } from "../redux/slices/activeSectionSlice"; // 올바른 경로로 수정

// const useActiveSection = (sectionRefs, options = {}) => {
//   const dispatch = useDispatch();
//   const activeSection = useSelector((state) => state.activeSection.activeSection); // 리덕스에서 값 가져오기

//   useEffect(() => {
//     const observers = [];
//     const observerOptions = {
//       root: null,
//       rootMargin: "0px",
//       threshold: 0.6,
//       ...options,
//     };

//     sectionRefs.forEach((ref, index) => {
//       if (!ref.current) return;

//       const observer = new IntersectionObserver(([entry]) => {
//         if (entry.isIntersecting) {
//           dispatch(setActiveSection(index));
//         }
//       }, observerOptions);

//       observer.observe(ref.current);
//       observers.push(observer);
//     });

//     return () => {
//       observers.forEach((observer) => observer.disconnect());
//     };
//   }, [sectionRefs, options, dispatch]);

//   return activeSection; // 리덕스에서 가져온 현재 섹션 값 반환
// };

// export default useActiveSection;


// ------------------------------------------------
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSection } from "../redux/slices/activeSectionSlice"; // 올바른 경로로 수정

const useActiveSection = (sectionRefs, options = {}) => {
  const dispatch = useDispatch();
  //const activeSection = useSelector((state) => state.activeSection); 

  useEffect(() => {
    const observers = [];
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
      ...options,
    };

    sectionRefs.forEach((ref, index) => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(([entry]) => {
        //if (entry.isIntersecting && index !== activeSection) {
        if (entry.isIntersecting) {
          dispatch(setActiveSection(index));
        }
      }, observerOptions);

      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sectionRefs, options, dispatch]);
  // 의존성배열 activeSection 추가(푸터 때문에 해봤던거)
};

export default useActiveSection;
