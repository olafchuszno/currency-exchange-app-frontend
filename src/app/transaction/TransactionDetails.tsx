import { TransactionData } from '@/pages/api/transaction';
import parseTransactionTime from '@/app/helpers/parseTransactionTime';
import './TransactionDetails.scss';

interface Props {
  transaction: TransactionData;
}

export default function TransactionDetails({ transaction }: Props) {
  const headers = ['EUR', 'PLN', 'EUR/PLN', 'Time'];

  return (
    <table className="transaction-table">
      <thead>
        <tr className="transaction-table__row transaction-table-header-row">
          {headers.map((header: string) => (
            <th className="transaction-table__header" key={header}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {!!transaction && (
          <tr className="transaction-table__row">
            <td className="transaction-table__data">
              {transaction.transaction_eur_amount}
            </td>
            <td className="transaction-table__data">
              {transaction.transaction_pln_amount}
            </td>
            <td className="transaction-table__data">
              {transaction.currenty_exchange_rate}
            </td>
            <td className="transaction-table__data">
              {parseTransactionTime(transaction.createdAt)}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
