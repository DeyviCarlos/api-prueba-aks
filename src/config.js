import { config } from "dotenv";

config()

export const PORT= process.env.PORT || 3000
export const DB_name = process.env.DB_name || 'sananatural'
export const DB_hostname = process.env.DB_hostname || 'localhost'
export const DB_username = process.env.DB_username || 'root'
export const DB_password = process.env.DB_password || ''
export const DB_port = process.env.DB_port || 3306
export const HOST= process.env.HOST || 'localhost'
export const PAYPAL_API_CLIENT = 'AQyxvbC5hQALoo3GkeatkLLOp31MZS3FfVsWlmf8qudXvbDM-BPFFkrO1Wj1_tCbq6Ng5L7VT7xAaPmr'
export const PAYPAL_API_SECRET = 'EPtq8MfjJmvT3_6CJx2M0RqTEAaD91Nelkxl0XSMDqf5T9P5137ZeLuvfjxenrDfn_pyFuBUqyABFyf5'
export const PAYPAL_API = 'https://api-m.sandbox.paypal.com'

