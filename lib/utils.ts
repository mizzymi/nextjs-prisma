export const fmtEUR = (n?: number) =>
    typeof n === "number"
        ? new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n)
        : "—";