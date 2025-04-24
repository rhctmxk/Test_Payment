// utils/payment/recurring.ts
import axios from 'axios'


/**
 * @desc: 추후 정기결제 실행(예: 매월 1일 자동 실행)
 * */
export async function requestRecurringPayment(customer_uid: string, amount: number, name: string) {
    const tokenRes = await axios.post('https://api.iamport.kr/users/getToken', {
        imp_key: process.env.IMP_KEY,
        imp_secret: process.env.IMP_SECRET,
    })

    const access_token = tokenRes.data.response.access_token

    const response = await axios.post(
        'https://api.iamport.kr/subscribe/payments/again',
        {
            customer_uid,
            merchant_uid: `order_${new Date().getTime()}`,
            amount,
            name,
        },
        {
            headers: { Authorization: access_token },
        }
    )

    return response.data
}
