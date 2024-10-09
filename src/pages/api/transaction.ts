import { TransactionDataToNextApi } from '@/app/page';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface TransactionData {
  transaction_eur_amount: number,
  timestamp: string,
}

interface TransactionError {
  message: string,
}

export default function handler(req: NextApiRequest, res: NextApiResponse<TransactionData | TransactionError>) {
  const transactionAmount = (req.body as TransactionDataToNextApi).transaction_eur_amount;

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
      const { transaction_eur_amount, timestamp } = transactionData;

      res.status(200).json({ transaction_eur_amount, timestamp });
    })
    .catch((error) => {
      res.status(500).json({
        message: error?.message || 'A server error without spesicif message occurred',
      })
    }
    );
}
