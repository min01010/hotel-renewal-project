import React from "react";
import styled from "styled-components";

const PaymentButton = ({name, phone, email, price, onSuccess}) => {
  const onClickPayment = () => {
    if (!window.IMP) {
      alert("❌ 포트원 결제 모듈이 로드되지 않았습니다.");
      return;
    }

    const { IMP } = window;
    IMP.init("imp31325415"); // 본인의 가맹점 식별코드로 변경

    IMP.request_pay(
      {
        pg: "uplus", // PG사: toss
        pay_method: "card",
        merchant_uid: `mid_${new Date().getTime()}`,
        name: "토스 테스트 결제",
        amount: price,
        buyer_email: email,
        buyer_name: name,
        buyer_tel: phone,
      },
      function (rsp) {
        if (rsp.success) {
          // 결제 검증 요청 (백엔드로 imp_uid 전달)
          fetch("http://localhost:3001/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imp_uid: rsp.imp_uid }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                console.log("결제 검증 성공:", data.paymentInfo);
                // 부모 컴포넌트에 결제 정보 전달
                if (onSuccess) {
                  onSuccess({
                    ...data.paymentInfo,
                    imp_uid: rsp.imp_uid,
                    merchant_uid: rsp.merchant_uid,
                  });
                }
              } else {
                alert("❌ 결제 검증 실패");
              }
            })
            .catch((err) => {
              console.error("❌ 결제 검증 요청 실패:", err);
            });
        } else {
          alert("❌ 결제 실패: " + rsp.error_msg);
        }
      }
    );
  };

  return <PaymentStyledButton onClick={onClickPayment}>결제하기</PaymentStyledButton>;
};

const PaymentStyledButton = styled.button`
  padding: 20px;
  margin-top: auto;
  background-color: #5C3D2E;
  text-align: center;
  font-size: 20px;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #5C3D2E;
  }
`;
export default PaymentButton;
