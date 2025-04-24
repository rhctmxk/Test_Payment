/** payment/page.tsx */
// app/payment/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { products } from '@/data/products'
import { Product } from '@/types/product'
import Image from "next/image";

declare global {
    interface Window {
        IMP: any
    }
}

export default function PaymentPage() {
    const [open, setOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        tel: '',
        addr: '',
        postcode: '',
    })

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js'
        script.async = true
        document.body.appendChild(script)
    }, [])

    const handlePayment = () => {
        if (!selectedProduct) return alert('상품을 선택해주세요.')

        const { IMP } = window
        IMP.init('imp31675063') // PortOne 가맹점 식별코드

        IMP.request_pay(
            {
                pg: 'kakaopay', // or kakaopay
                pay_method: 'card',
                merchant_uid: `order_${new Date().getTime()}`,
                name: selectedProduct.name,
                amount: selectedProduct.price,
                buyer_email: 'user@example.com',
                buyer_name: '홍길동',
                buyer_tel: '01012345678',
                buyer_addr: '서울시 구로구',
                buyer_postcode: '08390',
                customer_uid: 'user_12345678', // 정기결제용 Billing Key 식별자
            },
            (rsp: any) => {
                if (rsp.success) {
                    console.log('결제 응답', rsp)
                    alert('결제 성공!')
                    // TODO: 서버에 billing key 등록 요청
                } else {
                    alert(`결제 실패: ${rsp.error_msg}`)
                }
            }
        )
    }

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold text-center">정기결제 상품 선택</h1>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                    <li
                        key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        className={
                            `relative flex flex-col items-center p-4 border rounded-2xl shadow-md transition-all duration-300 cursor-pointer
                            hover:shadow-lg hover:-translate-y-1
                            ${selectedProduct?.id === p.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`
                        }
                    >
                        <Image
                            src={p.image}
                            alt={p.name}
                            width={200}
                            height={200}
                            className="object-cover rounded-md mb-4"
                            unoptimized
                        />
                        <strong className="text-lg font-semibold text-center">{p.name}</strong>
                        <div className="text-sm text-gray-500 text-center">{p.description}</div>
                        <p className="pt-3 text-lg font-bold text-blue-600">{p.price.toLocaleString()}원</p>

                        {selectedProduct?.id === p.id && (
                            <span
                                className="absolute top-2 right-2 text-xs text-white bg-blue-600 px-2 py-0.5 rounded-full">선택됨</span>
                        )}
                    </li>
                ))}
            </ul>

            <div className="text-center">
                <button
                    onClick={handlePayment}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer"
                >
                    결제하기
                </button>
            </div>
        </div>
    )
}