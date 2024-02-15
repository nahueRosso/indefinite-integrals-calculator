// import { NextApiRequest, NextApiResponse } from 'next'
// import { sampleUserData } from '../../../utils/sample-data'

// const handler = (_req: NextApiRequest, res: NextApiResponse) => {
//   try {
//     if (!Array.isArray(sampleUserData)) {
//       throw new Error('Cannot find user data')
//     }

//     res.status(200).json(sampleUserData)
//   } catch (err: any) {
//     res.status(500).json({ statusCode: 500, message: err.message })
//   }
// }

// export default handler

import axios, { AxiosInstance } from 'axios';

interface ApiInstance extends AxiosInstance {}

const api: ApiInstance = axios.create({
  baseURL: 'http://localhost:8000',
});

export default api;
