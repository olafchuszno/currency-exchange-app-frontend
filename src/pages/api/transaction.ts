// import { TransactionDataToNextApi } from '@/app/page';
// import type { NextApiRequest, NextApiResponse } from 'next';

export interface TransactionData {
  id: number,
  transaction_eur_amount: number;
  transaction_pln_amount: number;
  currenty_exchange_rate: number;
  createdAt: string;
}

// interface TransactionError {
//   message: string,
// }

// export default function handler(req: NextApiRequest, res: NextApiResponse<TransactionData | {transactions: TransactionData[]} | TransactionError>) {
//   if (req.method === 'GET') {
//     fetch('http://localhost:4000/transaction')
//       .then((response) => response.json())
//       .then((transactions: TransactionData[]) => {
//         return res.status(200).json({transactions})
//       })
//       .catch((error) => {
//         return res.status(500).json({
//           message: error?.message || 'A server error without spesicif message occurred',
//         })
//       })
//     return;
//   }

//   const transactionEurAmount = (req.body as TransactionDataToNextApi).transaction_eur_amount;

//   if (!transactionEurAmount || transactionEurAmount < 0) {
//     throw new Error('Error - Wrong transaction amount')
//   }

//   return fetch('http://localhost:4000/transaction', {
//     method: "POST",
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({transaction_eur_amount: transactionEurAmount})
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error('Failed to fetch exchange rate');
//       }

//       return response.json();
//     })
//     .then((transactionData: TransactionData) => {
//       res.status(200).json(transactionData);
//     })
//     .catch((error) => {
//       return res.status(500).json({
//         message: error?.message || 'A server error without spesicif message occurred',
//       })
//     }
//     );
// }
