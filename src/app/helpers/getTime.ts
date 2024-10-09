export default function getTime() {
  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const parseTime = (time: number) => {
    return time.toString().padStart(2, '0');
  }


  return `${parseTime(hours)}:${parseTime(minutes)}:${parseTime(seconds)}`;
}