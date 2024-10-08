import type { NextApiRequest, NextApiResponse } from 'next';

interface TransactionData {
  transaction_amount: number
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const transactionAmount = (req.body as TransactionData).transaction_amount;

  if (!transactionAmount || transactionAmount < 0) {
    throw new Error('Error - Wrong transaction amount')
  }

  return fetch('http://localhost:3030/transaction', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({amountToExchange: transactionAmount})
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }

      return response.json();
    })
    .then((transactionData: TransactionData) => {
      res.status(200).json({transaction_amount: transactionData.transaction_amount});
    })
    .catch((error) => {
      res.status(500).json({
        error: error?.message + 'OOPSY' || 'A server occurred',
      })
    }
    );
}
