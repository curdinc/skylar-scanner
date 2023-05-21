export function convertToDisplayAddress(value: string) {
  return value.substring(0, 5) + "..." + value.substring(value.length - 4);
}
