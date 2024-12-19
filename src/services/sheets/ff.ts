import doc from '@/services/sheets/index'
import type { Income, PurchaseSheet } from '@/types'

export const savePurchases = async (purchases: PurchaseSheet[]) => {
    const purchaseSheet = doc.sheetsByTitle['TABLA_EGRESOS']

    if (!purchaseSheet) {
        throw new Error('No se ha encontrado la hoja "TABLA_EGRESOS"')
    }

    // await cotSheet.loadCells('B2:C7')
    // const cotBlue = cotSheet.getCellByA1('C5').numberValue as number

    if (purchases.length > 1) {
        for await (const purchase of purchases) {
            await purchaseSheet.addRow({
                FECHA_COMPRA: purchase.purchaseDate.split('T')[0],
                CONCEPTO: purchase.concept,
                MONEDA: purchase.currency,
                IMPORTE_TOTAL: purchase.totalAmount,
                CUOTA_NUMERO: purchase.numberQuota,
                FECHA_PAGO_CUOTA: purchase.payQuotaDate,
                MONTO_X_CUOTA: purchase.amountQuota,
                ESTA_PAGO: 'NO',
                CONDICION: 'FINANCIADO'
            })
        }

        return
    }

    for await (const purchase of purchases) {
        await purchaseSheet.addRow({
            FECHA_COMPRA: purchase.purchaseDate.split('T')[0],
            CONCEPTO: purchase.concept,
            MONEDA: purchase.currency,
            IMPORTE_TOTAL: purchase.totalAmount,
            CUOTA_NUMERO: purchase.numberQuota,
            MONTO_X_CUOTA: purchase.amountQuota,
            FECHA_PAGO_CUOTA: purchase.purchaseDate,
            ESTA_PAGO: 'SI',
            CONDICION: 'CONTADO'
        })
    }

    return
}

export const saveIncome = async (income: Income) => {
    const sheet = doc.sheetsByTitle['TABLA_INGRESOS']

    if (!sheet) {
        throw new Error('No se ha encontrado la hoja "TABLA_INGRESOS"')
    }

    await sheet.addRow({
        FECHA_INGRESO: income.incomeDate.split('T')[0],
        CONCEPTO: income.concept,
        MONEDA: income.currency,
        IMPORTE_TOTAL: income.totalAmount,
        ESTA_COBRADO: 'SI'
    })

    return
}
