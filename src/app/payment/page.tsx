/** payment/page.tsx */
// app/payment/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { products } from '@/data/products'
import { Product } from '@/types/product'
import Image from "next/image";
import Dialog from "@/components/Dialog";

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
        if (!userInfo.name || !userInfo.tel || !userInfo.email) return alert('사용자 정보를 모두 입력해주세요.')


        const { IMP } = window
        IMP.init('imp31675063') // PortOne 가맹점 식별코드

        IMP.request_pay(
            {
                pg: 'kakaopay', // or kakaopay
                pay_method: 'card',
                merchant_uid: `order_${new Date().getTime()}`,
                name: selectedProduct.name,
                amount: selectedProduct.price,
                buyer_email: userInfo.email,
                buyer_name: userInfo.name,
                buyer_tel: userInfo.tel,
                buyer_addr: userInfo.addr,
                buyer_postcode: userInfo.postcode,
                customer_uid: `user_${userInfo.tel}`, // 정기결제용 Billing Key 식별자
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
                        onClick={() => {
                            setSelectedProduct(p);
                            setOpen(true)
                        }}
                        className={`relative flex flex-col items-center p-4 border rounded-2xl shadow-md transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${selectedProduct?.id === p.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                    >
                        <Image src={p.image!} alt={p.name} width={200} height={200}
                               className="object-cover rounded-md mb-4" unoptimized/>
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

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                trigger={<></>} // trigger는 상품 선택 시 열리므로 공란
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-bold mb-4">구매자 정보 입력</h2>
                        <div className="space-y-3">
                            <input type="text" placeholder="이름" className="w-full border rounded p-2"
                                   value={userInfo.name}
                                   onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}/>
                            <input type="email" placeholder="이메일" className="w-full border rounded p-2"
                                   value={userInfo.email}
                                   onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}/>
                            <input type="tel" placeholder="전화번호" className="w-full border rounded p-2"
                                   value={userInfo.tel}
                                   onChange={(e) => setUserInfo({...userInfo, tel: e.target.value})}/>
                            <input type="text" placeholder="주소" className="w-full border rounded p-2"
                                   value={userInfo.addr}
                                   onChange={(e) => setUserInfo({...userInfo, addr: e.target.value})}/>
                            <input type="text" placeholder="우편번호" className="w-full border rounded p-2"
                                   value={userInfo.postcode}
                                   onChange={(e) => setUserInfo({...userInfo, postcode: e.target.value})}/>
                        </div>
                        <div className="mt-6 flex gap-4 justify-end">
                            <button className="px-4 py-2 rounded border" onClick={() => setOpen(false)}>취소</button>
                            <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handlePayment}>결제하기
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border">
                        <h3 className="text-lg font-bold mb-4">상품 정보</h3>
                        {selectedProduct && (
                            <div className="flex flex-col items-center text-center">
                                <Image src={selectedProduct.image!} alt={selectedProduct.name} width={180} height={180}
                                       className="rounded mb-4" unoptimized/>
                                <strong className="text-lg">{selectedProduct.name}</strong>
                                <p className="text-sm text-gray-500 mb-2">{selectedProduct.description}</p>
                                <p className="text-xl font-bold text-blue-600">{selectedProduct.price.toLocaleString()}원</p>
                            </div>
                        )}
                    </div>
                </div>
            </Dialog>
        </div>
    )
}