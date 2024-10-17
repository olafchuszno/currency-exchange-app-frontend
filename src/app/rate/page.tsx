
import getTime from "@/app/helpers/getTime";
import UpdateRateForm from "./UpdateRateForm";
import { getEnvVariable } from "../helpers/getEnvVariable";
import '../styles/main.scss';

export const getExchangeRate = async () => {
  const RATE_API_URL = getEnvVariable('DOCKER_INTERNAL_API_URL', '/rate');

  console.log('//// RATE_API_URL:', RATE_API_URL)

  try {
    const response = await fetch(RATE_API_URL);

    const data = await response.json();

    const { exchange_rate } = data;

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