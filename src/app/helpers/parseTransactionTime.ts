export default function parseTransactionTime(timestamp: string) {
  const date = new Date(timestamp);

  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}