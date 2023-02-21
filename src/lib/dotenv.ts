import * as dotenv from 'dotenv'

dotenv.config()

let dbbname = "iam"
let dbbport = 5432

if (!process.env.DBB_ADDR) throw Error("Dbb addr is undefined")
if (!process.env.DBB_USERNAME) throw Error("Dbb username is undefined")
if (!process.env.DBB_PASSWORD) throw Error("dbb password is undefined")
if (!process.env.NODE_ENV) throw Error("NODE_ENV is undefined")
if (!process.env.FASTIFY_PORT) throw Error("FASTIFY_PORT is undefined")
if (!process.env.FASTIFY_ADDR) throw Error("FASTIFY_ADDR is undefined")
if (!process.env.FASTIFY_COOKIES_SECRET) throw Error("FASTIFY_COOKIES_SECRET is undefined")

if (isNaN(parseInt(process.env.FASTIFY_PORT))) throw Error("FASTIFY_PORT not in a correct format")

// Gérer le cas d'environnement de dev
if (process.env.NODE_ENV === "test") {
    dbbname = "iam_test"
    dbbport = 5433
}

export const DBB_ADDR = process.env.DBB_ADDR
export const DBB_USERNAME = process.env.DBB_USERNAME
export const DBB_PASSWORD = process.env.DBB_PASSWORD
export const DBB_NAME = dbbname
export const DBB_PORT = dbbport

export const FASTIFY_PORT = parseInt(process.env.FASTIFY_PORT)
export const FASTIFY_ADDR = process.env.FASTIFY_ADDR
export const FASTIFY_COOKIES_SECRET = process.env.FASTIFY_COOKIES_SECRET