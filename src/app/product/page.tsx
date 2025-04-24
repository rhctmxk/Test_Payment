// app/product/page.tsx (또는 원하는 위치)
import PaymentButton from '@/components/PaymentButton'

export default function ProductPage() {
    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">테스트 상품</h1>
            <PaymentButton
                amount={100}
                buyerEmail="customer@example.com"
                buyerName="홍길동"
            />
        </div>
    )
}
