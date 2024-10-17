import { TransactionData } from "@/pages/api/transaction"
import parseTransactionTime from "@/app/helpers/parseTransactionTime"
import './TransactionDetails.scss';

interface Props {
  transaction: TransactionData
};

export default function TransactionDetails({ transaction }: Props) {
  const headers = ['EUR', 'PLN', 'EUR/PLN', 'Time']

  return (
    <main className="main">
      <h1>Single transaction details</h1>
    <table className="transactions-table">
      <thead>
        <tr className="transactions-table__row">
          {headers.map((header: string) => (
            <th className="transactions-table__header" key={header}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {!!transaction &&
          <tr className="transactions-table__row">
            <td className="transactions-table__data">{transaction.transaction_eur_amount}</td>
            <td className="transactions-table__data">{transaction.transaction_pln_amount}</td>
            <td className="transactions-table__data">{transaction.currenty_exchange_rate}</td>
            <td className="transactions-table__data">{parseTransactionTime(transaction.createdAt)}</td>
          </tr>
        }
      </tbody>
      </table>
    </main>
  )
}

