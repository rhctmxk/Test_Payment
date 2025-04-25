// components/PaymentButton.tsx
'use client'

import { useEffect } from 'react'

declare global {
    interface Window {
        IMP: any
    }
}

interface PaymentButtonProps {
    amount: number
    buyerEmail: string
    buyerName: string
}

export default function PaymentButton({ amount, buyerEmail, buyerName }: PaymentButtonProps) {
    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js'
        script.async = true
        document.body.appendChild(script)
    }, [])

    const onClickPayment = () => {
        if (!window.IMP) return
        const { IMP } = window
        IMP.init('imp31675063') // ★ 본인의 가맹점 식별코드로 대체

        IMP.request_pay(
            {
                pg: 'html5_inicis', // or kakaopay, tosspay 등
                // pay_method: 'phone', // 'card', 'vbank', 'phone' 등
                merchant_uid: `mid_${new Date().getTime()}`, // 주문 고유번호
                name: '상품명 예시',
                amount: amount,
                buyer_email: buyerEmail,
                buyer_name: buyerName,
                buyer_tel: '01012345678',
                buyer_addr: '서울특별시 강남구',
                buyer_postcode: '01181',
            },
            (rsp: any) => {
                if (rsp.success) {
                    // TODO: 백엔드에 결제정보 전달 + DB 저장
                    alert('결제 성공')
                } else {
                    alert(`결제 실패: ${rsp.error_msg}`)
                }
            }
        )
    }

    return <button onClick={onClickPayment} className="bg-blue-600 text-white p-3 rounded-md">결제하기</button>
}
