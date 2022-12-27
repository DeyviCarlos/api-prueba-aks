import { config } from "dotenv";

config()

export const PORT= process.env.PORT || 3000
export const DB_name = process.env.DB_name || 'sananatural'
export const DB_hostname = process.env.DB_hostname || 'localhost'
export const DB_username = process.env.DB_username || 'root'
export const DB_password = process.env.DB_password || ''
export const DB_port = process.env.DB_port || 3306
export const HOST= process.env.HOST || 'localhost'
