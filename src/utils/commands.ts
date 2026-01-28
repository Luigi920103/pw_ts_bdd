import dayjs from "dayjs"
import fs from "fs"
import path from "path"
import { Page } from "@playwright/test"
import MongoDBClient from "./mongoClient"
import PostgresClient from "./postgresClient"
import { CustomAPIResponse } from "./apiClient"

let sharedTestData: any
let apiResponse: CustomAPIResponse | null
let currentRole: string
let mongoConnection: MongoDBClient
let pgConnection: PostgresClient
let mongoDocument: any
let postgresData: any
let apiLoginResponse: any = {}
let dataSource: any

const emailInput = '[type="email"] input'
const passwordInput = '[type="password"] input'
const loginButton = "div.form-group.w-100 > button"

export function setMongoDocument(data: any): void {
  mongoDocument = data
}
export function getMongoDocument(): any {
  return mongoDocument
}

export function setPostgresData(data: any): void {
  postgresData = data
}
export function getPostgresData(): any {
  return postgresData
}

export function shareData(data: any): void {
  sharedTestData = data
}
export function getSharedData(): any {
  return sharedTestData
}

export function setLastApiResponse(data: CustomAPIResponse | null | any): void {
  apiResponse = data
}
export function getLastApiResponse(): CustomAPIResponse | null | any {
  return apiResponse
}

export function setLoginApiResponse(data: any): void {
  apiLoginResponse = data
}
export function getLoginApiResponse(): any {
  return apiLoginResponse
}

export function setCurrentRole(role: string): void {
  currentRole = role
}
export function getCurrentRole(): string {
  return currentRole
}

export async function loadDataSource(fileName: string): Promise<void> {
  const rawData = fs.readFileSync(
    `./src/resources/dataSource/${fileName}.json`,
    "utf8",
  )
  dataSource = JSON.parse(rawData)
}

export async function login(
  page: Page,
  username: string,
  password: string,
): Promise<void> {
  await page.fill(emailInput, username)
  await page.fill(passwordInput, password)
  await page.click(loginButton)
}

/**
 * Limpia el estado global entre ejecuciones
 */
export function cleanVariables(): void {
  sharedTestData = ""
  apiResponse = null
  apiLoginResponse = {}
  mongoDocument = ""
  postgresData = ""
}

export async function mongoConnect(
  connection: string,
  db: string,
): Promise<void> {
  mongoConnection = new MongoDBClient(connection, db)
  await mongoConnection.connect()
}

export function getMongoConnection(): MongoDBClient {
  return mongoConnection
}

export async function pgConnect(
  newHost: string,
  newPort: string | number,
  newDatabase: string,
  newUser: string,
  pass: string,
  maxNumberOfConnections: number = 10,
): Promise<void> {
  const config = {
    host: newHost,
    port: Number(newPort),
    database: newDatabase,
    user: newUser,
    password: pass,
    max: maxNumberOfConnections,
  }
  pgConnection = new PostgresClient(config)
  await pgConnection.connect()
}

export function getPgConnection(): PostgresClient {
  return pgConnection
}

export function getDate(addDays: number, format: string): string {
  const newDate = dayjs().add(addDays, "day")
  return newDate.format(format)
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log(`🗑️  The file ${filePath} has been deleted.`)
    }
  } catch (error: any) {
    console.error(`⚠️  Error deleting the file: ${filePath} => `, error.message)
  }
}
