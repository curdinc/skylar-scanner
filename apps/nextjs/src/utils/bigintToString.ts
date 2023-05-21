interface props {
  value: bigint;
  decimal: number;
}
export default function bigintToString(value: bigint, decimal: number) {
  const val = value.toString();
  const start = val.slice(0, val.length - decimal);
  return (
    (start.length > 0 ? start : "0") +
    "." +
    val.slice(val.length - decimal, val.length - decimal + 3)
  );
}
