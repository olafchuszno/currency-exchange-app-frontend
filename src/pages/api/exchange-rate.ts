import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiUrl = process.env.NEST_EXCHANGE_RATE_API_URL || '';

  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }

      return response.json();
    })
    .then((data) => {
      res.status(200).json({ exchange_rate: data.exchange_rate });
    })
    .catch((error) =>
      res.status(500).json({
        error: error?.message
      })
    );
}
