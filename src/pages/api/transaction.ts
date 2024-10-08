import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('--- request recieved ---')

  return fetch('http://localhost:3030/transaction', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({amountToExchange: 200})
  })
    .then((response) => {
      console.log('--- response ---', response)
      console.log('--- response.status ---', response.status)
      if (!response.ok) {
        console.log('--- response NOT OKAY - THROW ---')
        throw new Error('Failed to fetch exchange rate');
      }

      return response.json();
    })
    .then((data) => {
      res.status(200).json({transaction_amount: data.transaction_amount});
    })
    .catch((error) => {
      res.status(500).json({
        error: error?.message + 'OOPSY' || 'A server occurred',
      })
    }
    );
}
