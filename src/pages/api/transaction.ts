import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('--- request recieved ---')
  return fetch('http://localhost:3030/transaction')
    .then((response) => {
      console.log('--- response ---', response)
      if (!response.ok) {
        console.log('--- response NOT OKAY - THROW ---')
        throw new Error('Failed to fetch exchange rate');
      }

      return response.json();
    })
    .then((data) => {
      res.status(200).json({response: data.response});
    })
    .catch((error) => {
      res.status(500).json({
        error: error?.message + 'OOPSY' || 'A server occurred',
      })
    }
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
