// import getTime from "@/app/helpers/getTime";
import getTime from "@/app/helpers/getTime";
import UpdateRateForm from "./UpdateRateForm";
import '../styles/main.scss';
// import { useEffect, useState } from "react";

export const getExchangeRate = async () => {
  const RATE_API_URL: string = process.env.RATE_API_URL || '';

  try {
    console.log('fetch this url:', RATE_API_URL)
    const response = await fetch('http://host.docker.internal:4000/rate');

    console.log('--- 1 ---')

    const data = await response.json();

    console.log('--- 2 ---')

    const { exchange_rate } = data;

    console.log('--- 3 ---')

  return {
    exchangeRate: exchange_rate,
    timestamp: getTime()
    }
  } catch (e) {
    return {
      error: e
    }
  }
};

export default async function Page() {
  // const exchangeRateDetails = await getExchangeRateDetails();

  // const [exchangeRate, setExchangeRate] = useState<null | number>(null);
  // const [exchangeRateFetchError, setExchangeRateFetchError] = useState<boolean>(false);

  // const [lastCurrencyRateUpdateTimestamp, setLastCurrencyRateUpdateTimestamp] =
  //   useState<string | null>(null);


  const exchangeRateCallResponse = await getExchangeRate();

  console.log('env url:', process.env.RATE_API_URL);

  console.log(exchangeRateCallResponse);

  if (exchangeRateCallResponse.error) {
    return 'Error occured';
  }

  const { exchangeRate, timestamp } = exchangeRateCallResponse;

  return (
    <main className="main">
        <h2 className="title title--2">Exchange rate</h2>

        <p>
          Exchange rate: <span data-cy="exchange-rate">{exchangeRate}</span>
        </p>

        {!!timestamp && (
          <p>Last exchange rate update: {timestamp}</p>
        )}

        <div>
          <UpdateRateForm />
        </div>

        {/* {exchangeRateFetchError && <p>An error occured while getting the exchange rate. Please try again.</p>} */}
    </main>
  )
}