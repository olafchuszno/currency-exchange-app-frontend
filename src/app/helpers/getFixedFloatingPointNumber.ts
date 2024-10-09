export const getFixedFloatingPointNumber = (number: number) => {
  return Math.round(number * 100) / 100
}