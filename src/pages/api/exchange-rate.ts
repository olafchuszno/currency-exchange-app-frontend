import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.NEST_EXCHANGE_RATE_API_KEY || '';  
  const apiUrl = process.env.NEST_EXCHANGE_RATE_API_URL || '';
  const apiKeyHeader = process.env.API_KEY_HEADER || '';

  return fetch(apiUrl, {
    headers: {
      [apiKeyHeader]: apiKey,
    },
  })
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

  // try {
  //   const response = await fetch(apiUrl, {
  //     headers: {
  //       [apiKeyHeader]: apiKey,  // Send the API key securely in the server-side request
  //     },
  //   });

  //   if (!response.ok) {
  //     throw new Error('Failed to fetch exchange rate');
  //   }

  //   const data = await response.json();

  //   res.status(200).json({ exchange_rate: data.exchange_rate });

  // } catch (error) {
  //   if (error instanceof Error) {
  //     res.status(500).json({ error: error.message });
  //   } else {
  //     res.status(500).json({ error: 'There has been a server error' });
  //   }
  // }
}
