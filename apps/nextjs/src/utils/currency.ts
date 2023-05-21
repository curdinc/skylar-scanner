export function formatCurrency(value: string, currency: "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    Number(value),
  );
}
