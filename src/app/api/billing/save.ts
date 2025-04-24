// pages/api/billing/save.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

/**
 * @desc: 서버 측 billing key 저장 로직(예시)
 * */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { imp_uid, customer_uid } = req.body

    try {
        const { data } = await axios.post('https://api.iamport.kr/users/getToken', {
            imp_key: process.env.IMP_KEY,
            imp_secret: process.env.IMP_SECRET,
        })

        const access_token = data.response.access_token

        const billingResult = await axios.get(
            `https://api.iamport.kr/subscribe/customers/${customer_uid}`,
            { headers: { Authorization: access_token } }
        )

        // TODO: billingKey 저장 로직 (DB 등)
        res.status(200).json({ message: 'Billing Key 저장 완료', billing: billingResult.data })
    } catch (e) {
        res.status(500).json({ error: 'Billing Key 저장 실패' })
    }
}
