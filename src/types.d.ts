type Purchase = {
    concept: string
    purchaseDate: string
    currency: Currency
    totalAmount: string
    condition: 'cash' | 'financed'
    numberQuotas: string
}

type PurchaseSheet = Omit<Purchase, 'numberQuotas'> & {
    numberQuota: string
    amountQuota: string
    payQuotaDate: string
}

enum Currency {
    ARS = 'ARS',
    USD = 'USD'
}

export type Income = {
    concept: string
    incomeDate: string
    currency: Currency
    totalAmount: string
}
