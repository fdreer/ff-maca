export const prerender = false

import { saveIncome } from '@/services/sheets/ff'
import type { Income } from '@/types'
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
    const data: Income = await request.json()

    try {
        // console.time('Save')

        await saveIncome(data)

        // console.timeEnd('Save')
        return new Response(undefined, { status: 201 })
    } catch (error) {
        console.log(error)
        return new Response(undefined, { status: 500 })
    }
}
