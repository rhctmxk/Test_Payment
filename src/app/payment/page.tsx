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
interface CartItem extends Product {
    quantity: number
}

/**
 * @desc: 결제 페이지에서 상품 선택 -> 결제
 * */
export default function PaymentPage() {
    const [open, setOpen] = useState(false)
    const [cart, setCart] = useState<CartItem[]>([])
    const [userInfo, setUserInfo] = useState({
        name: '이지현',
        email: 'jhlee@gmail.com',
        tel: '010-1234-5678',
        addr: '주소1',
        postcode: '12345',
    })

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js'
        script.async = true
        document.body.appendChild(script)
    }, [])

    const toggleCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id)
            if (existing) {
                return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)
            } else {
                return [...prev, { ...product, quantity: 1 }]
            }
        })
    }

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item =>
            item.id === productId
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
        ))
    }

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(p => p.id !== productId))
    }

    const handlePayment = () => {
        if (cart.length === 0) return alert('상품을 선택해주세요.')
        if (!userInfo.name || !userInfo.tel || !userInfo.email) return alert('사용자 정보를 모두 입력해주세요.')

        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const productNames = cart.map(item => `${item.name} x${item.quantity}`).join(', ')

        const { IMP } = window
        IMP.init('imp31675063')

        IMP.request_pay({
            pg: 'nice', // nice, html5_inicis
            // pay_method: 'card',
            merchant_uid: `order_${new Date().getTime()}`,
            name: `${productNames} 외 ${cart.length}건`,
            amount: totalAmount,
            buyer_email: userInfo.email,
            buyer_name: userInfo.name,
            buyer_tel: userInfo.tel,
            buyer_addr: userInfo.addr,
            buyer_postcode: userInfo.postcode,
            // customer_uid: `user_${userInfo.tel}`,
        }, (rsp: any) => {
            if (rsp.success) {
                alert('결제 성공!')
                console.log('결제 응답', rsp)
                setOpen(false)
            } else {
                alert(`결제 실패: ${rsp.error_msg}`)
            }
        })
    }

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold text-center">정기결제 상품 선택</h1>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                    <li
                        key={p.id}
                        onClick={() => toggleCart(p)}
                        className={`relative flex flex-col items-center p-4 border rounded-2xl shadow-md transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${cart.find(item => item.id === p.id) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                    >
                        <Image src={p.image!} alt={p.name} fill={false} width={300} height={200}
                               className="w-full h-[200px] object-cover rounded-md mb-4" unoptimized/>
                        <strong className="text-lg font-semibold text-center">{p.name}</strong>
                        <div className="text-sm text-gray-500 text-center">{p.description}</div>
                        <p className="pt-3 text-lg font-bold text-blue-600">{p.price.toLocaleString()}원</p>
                        {cart.find(item => item.id === p.id) && (
                            <span
                                className="absolute top-2 right-2 text-xs text-white bg-blue-600 px-2 py-0.5 rounded-full">담김</span>
                        )}
                    </li>
                ))}
            </ul>


            <div className="text-center">
                <button
                    onClick={() => setOpen(true)}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer"
                >
                    장바구니 결제하기
                </button>
            </div>

            <Dialog open={open} onClose={() => setOpen(false)} trigger={<></>}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-bold mb-4">구매자 정보 입력</h2>
                        <div className="space-y-3">
                            <input type="text" placeholder="이름" className="w-full border rounded p-2" value={userInfo.name} onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} />
                            <input type="email" placeholder="이메일" className="w-full border rounded p-2" value={userInfo.email} onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} />
                            <input type="tel" placeholder="전화번호" className="w-full border rounded p-2" value={userInfo.tel} onChange={(e) => setUserInfo({ ...userInfo, tel: e.target.value })} />
                            <input type="text" placeholder="주소" className="w-full border rounded p-2" value={userInfo.addr} onChange={(e) => setUserInfo({ ...userInfo, addr: e.target.value })} />
                            <input type="text" placeholder="우편번호" className="w-full border rounded p-2" value={userInfo.postcode} onChange={(e) => setUserInfo({ ...userInfo, postcode: e.target.value })} />
                        </div>
                        <div className="mt-6 flex gap-4 justify-end">
                            <button className="px-4 py-2 rounded border cursor-pointer" onClick={() => setOpen(false)}>취소</button>
                            <button className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer" onClick={handlePayment}>결제하기</button>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border overflow-y-auto max-h-[400px]">
                        <h3 className="text-lg font-bold mb-4">장바구니 목록</h3>
                        {cart.map(product => (
                            <div key={product.id} className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Image src={product.image!} alt={product.name} width={64} height={64} className="rounded" unoptimized />
                                    <div>
                                        <div className="font-medium">{product.name}</div>
                                        <div className="text-sm text-gray-500">{product.price.toLocaleString()}원</div>
                                        <div className="text-sm flex items-center gap-2 mt-1">
                                            <button onClick={() => updateQuantity(product.id, -1)} className="px-2 py-1 border rounded">-</button>
                                            <span>{product.quantity}</span>
                                            <button onClick={() => updateQuantity(product.id, 1)} className="px-2 py-1 border rounded">+</button>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(product.id)} className="text-red-500 text-sm hover:underline cursor-pointer">삭제</button>
                            </div>
                        ))}
                        <div className="text-right font-bold text-blue-700 text-lg mt-6">
                            총 결제금액: {cart.reduce((sum, p) => sum + p.price * p.quantity, 0).toLocaleString()}원
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}