// data/products.ts
import { Product } from '@/types/product'

export const products: Product[] = [
    { id: 'p001', name: 'KSV-1001', price: 1000000, description: '일시불', image: '/images/hardware/KSV.png' },
    { id: 's001', name: '어선안전법(6개월)', price: 300000, description: '6개월 정기결제', image: '/images/solution/fishing_boat1.png' },
    { id: 'p002', name: 'VMS', price: 33000, description: '매월 정기결제', image: '/images/solution/VMS.png' },
]
