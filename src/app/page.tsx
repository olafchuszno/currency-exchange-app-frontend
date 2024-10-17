'use client'

// import { getFixedFloatingPointNumber } from './helpers/getFixedFloatingPointNumber';
// import TransactionDetails from './components/TransactionDetails/TransactionDetails';
// import getTime from './helpers/getTime';
import './styles/main.scss';
// import TransactionsSection from './components/TransactionsSection/TransactionsSection';
// import ExchangeRate from './components/ExchangeRate/ExchangeRate';
// import ConversionCalculator from './components/ConversionCalculator/ConversionCalculator';

export interface TransactionDataToNextApi {
  transaction_eur_amount: number;
}

export default function Page() {

  // const [lastCurrencyRateUpdateTimestamp, setLastCurrencyRateUpdateTimestamp] =
  //   useState<string | null>(null);

  // const [allTransactions, setAllTransactions] = useState<
  //   null | TransactionData[]
  // >(null);
  // const [isFetchingAllTransactions, setIsFetchingAllTransactions] =
  //   useState<boolean>(false);
  // const [fetchAllTransactionError, setFetchAllTransactionError] =
  //   useState<boolean>(false);

  // useEffect(() => {
  //   if (transactionAmount && exchangeRate) {
  //     setForecastedTransactionPlnAmount(
  //       getFixedFloatingPointNumber(transactionAmount * exchangeRate)
  //     );
  //   } else {
  //     setForecastedTransactionPlnAmount(null);
  //   }
  // }, [exchangeRate, transactionAmount]);


  // const getAllTransactions = () => {
  //   setIsFetchingAllTransactions(true);
  //   setFetchAllTransactionError(false);

  //   fetch('http://localhost:4000/transaction')
  //     .then((response) => response.json())
  //     .then((transactionsResponse: TransactionData[]) => {
  //       setAllTransactions(transactionsResponse);
  //     })
  //     .catch(() => {
  //       setFetchAllTransactionError(true);
  //     })
  //     .finally(() => {
  //       setIsFetchingAllTransactions(false);
  //     });
  // };





  return (
    <main className="main">
      <h1>Welcome to the Exchange rate app.</h1>

      <div>
        <p>Written in Next.js + Nest.js</p>
      </div>
      {/* <section className="section-tile">
        <ExchangeRate />
      </section>

      <section className="section-tile">
        <ConversionCalculator />
      </section> */}

      {/* <section className="section-tile">
        <h2 className="title title--2">Make a Transaction</h2>

        <form
          onSubmit={(event) => {
            event.preventDefault();

            if (!transactionAmount) {
              alert('Wrong transaction amount - not submittign the form!');
              return;
            }

            finaliseTransaction(transactionAmount);
          }}
          action=""
        >
          <div className='button-pair'>
            <input
              onChange={handleTransactionAmountInputChange}
              value={transactionAmount || ''}
              placeholder="Euro amount"
              type="number"
              className='button-pair__child'
            />

            <button className='button button-pair__child' type="submit">Make a transaction</button>
          </div>
        </form>

        {/* {forecastedTransactionPlnAmount &&
          !transactionDetails &&
          !isFinalisingTransaction && (
            <div>
              <p>Forecasted amonut in PLN: {forecastedTransactionPlnAmount}</p>
              <p>(exchange rate is fluctuating and is likely to change)</p>
            </div>
          )} */}

        {/* {isFinalisingTransaction && <p>Finalising the transaction...</p>}

        {transactionError && (
          <p>{transactionError.message}. Please try again.</p>
        )}

        {transactionDetails && <p>Transaction completed!</p>}

        {transactionDetails && (
          <TransactionDetails transaction={transactionDetails} />
        )}
      </section> */}

      {/* <section className="section-tile">
        <TransactionsSection />
      </section> */}
    </main>
  );
}
