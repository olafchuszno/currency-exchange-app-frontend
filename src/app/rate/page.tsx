import UpdateRateForm from './UpdateRateForm';
import getEnvVariable from '../helpers/getEnvVariable';
import RateFetchError from './RateFetchError';
import getTime from '@/app/helpers/getTime';
import '../styles/main.scss';

type FetchError = {
  error: Error
};

type ExchangeRateData = {
  exchangeRate: number,
  timestamp: string
};

export const getExchangeRate = async (): Promise<ExchangeRateData | FetchError> => {
  const RATE_API_URL = getEnvVariable('DOCKER_INTERNAL_API_URL', '/rate');

  try {
    const response = await fetch(RATE_API_URL);

    const data = await response.json();

    const { exchange_rate } = data;

    return {
      exchangeRate: exchange_rate,
      timestamp: getTime(),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Error occured while getting the exchange rate.'),
    };
  }
};

export default async function Page() {
  const exchangeRateCallResponse = await getExchangeRate();

  const hasFetchError = 'error' in exchangeRateCallResponse;

  const { exchangeRate, timestamp } = (exchangeRateCallResponse as ExchangeRateData);

  return (
    <main className="main">
      <h2 className="title title--2">Exchange rate</h2>

      {hasFetchError ? (
        <RateFetchError />
      ) : (
        <UpdateRateForm exchangeRate={exchangeRate} timestamp={timestamp} />
      )}

    </main>
  );
}
