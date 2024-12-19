export const prerender = false

import { savePurchases } from '@/services/sheets/ff'
import type { Purchase, PurchaseSheet } from '@/types'
import type { APIRoute } from 'astro'

function calculatePayQuotaDate(baseDate: string, monthsToAdd: number): string {
    const payDate = new Date(baseDate) // Crear una copia de la fecha base
    payDate.setMonth(payDate.getMonth() + monthsToAdd) // Añadir el número de meses
    payDate.setDate(9) // Establecer el día al 10
    return payDate.toISOString().split('T')[0] // Devolver la fecha en formato 'YYYY-MM-DD'
}

export const POST: APIRoute = async ({ request }) => {
    const purchase: Purchase = await request.json()

    if (!purchase) {
        return new Response(undefined, { status: 400 })
    }

    try {
        // console.time('Save')
        if (purchase.condition === 'financed') {
            const quotas = Number(purchase.numberQuotas)

            if (!quotas) {
                return new Response(undefined, { status: 432 })
            }

            const parsedTotalAmount = parseFloat(
                purchase.totalAmount.replaceAll('.', '').replace(',', '.')
            )

            const amountQuotaValue = (
                parsedTotalAmount / quotas
            ).toLocaleString('es-ES', {
                useGrouping: false,
                roundingMode: 'floor'
            })

            const purchases: PurchaseSheet[] = Array.from(
                { length: quotas },
                (_, i) => ({
                    concept: purchase.concept,
                    purchaseDate: purchase.purchaseDate,
                    currency: purchase.currency,
                    totalAmount: purchase.totalAmount,
                    condition: purchase.condition,
                    numberQuota: String(i + 1),
                    amountQuota: amountQuotaValue,
                    payQuotaDate: calculatePayQuotaDate(
                        purchase.purchaseDate,
                        i + 1
                    )
                })
            )

            await savePurchases(purchases)
            return new Response(undefined, { status: 201 })
        }

        if (purchase.condition === 'cash') {
            const purchases: PurchaseSheet[] = [
                {
                    concept: purchase.concept,
                    purchaseDate: purchase.purchaseDate,
                    currency: purchase.currency,
                    totalAmount: purchase.totalAmount,
                    condition: purchase.condition,
                    numberQuota: '1',
                    amountQuota: purchase.totalAmount,
                    payQuotaDate: purchase.purchaseDate
                }
            ]
            await savePurchases(purchases)
            return new Response(undefined, { status: 201 })
        }

        // console.timeEnd('Save')
        return new Response(undefined, { status: 500 })
    } catch (error) {
        console.log(error)
        return new Response(undefined, { status: 500 })
    }
}
