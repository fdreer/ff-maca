import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

const GOOGLE_AUTH_EMAIL = import.meta.env.GOOGLE_AUTH_EMAIL
const GOOGLE_AUTH_KEY = import.meta.env.GOOGLE_AUTH_KEY
const SHEET_ID = import.meta.env.SHEET_ID

export const jsonwebtoken = new JWT({
    email: GOOGLE_AUTH_EMAIL,
    key: `${GOOGLE_AUTH_KEY}`.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
})

const doc = new GoogleSpreadsheet(SHEET_ID as string, jsonwebtoken)
await doc.loadInfo()
export default doc
