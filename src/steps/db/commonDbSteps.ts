import { Given, When, Then, expect } from "../../fixtures/fixtures"
import {
  mongoConnect,
  getMongoConnection,
  pgConnect,
  getPgConnection,
} from "../../utils/commands"

let mongoNumberOfElements: number | string,
  pgNumberOfElements: number | string,
  newMongoNumberOfElements: number | string,
  newPgNumberOfElements: number | string,
  pgRows: string[],
  mongoDocs: string[]

When("I connect to Mongo", async () => {
  await mongoConnect(
    process.env.MONGODB_CONNECTION || "",
    process.env.MONGODB_DB || "",
  )
})

When("I disconnect from Mongo", async () => {
  await getMongoConnection().close()
})

When(
  "I count the number of elements of the collection {string} on Mongo",
  async ({}, collection: string) => {
    mongoNumberOfElements =
      await getMongoConnection().countDocuments(collection)
    console.log("Number Of documents:", mongoNumberOfElements)
  },
)

When(
  "I count the new number of elements of the collection {string} on Mongo",
  async ({}, collection: string) => {
    newMongoNumberOfElements =
      await getMongoConnection().countDocuments(collection)
    console.log("New number Of documents:", newMongoNumberOfElements)
  },
)

When(
  "I get {string} of all documents of the collection {string} on Mongo",
  async ({}, field: string, collection: string) => {
    const parsedField = JSON.parse(field.replace(/'/g, '"'))
    const docs = await getMongoConnection().getDocumentsBy(
      collection,
      parsedField,
    )
    mongoDocs = docs.map((doc: any) => doc._id.toString())
  },
)

When(
  "I print by console the records there is in Mongo but not in PostgresSql",
  async ({}) => {
    const missingInPostgres = mongoDocs.filter(
      (value) => !pgRows.includes(value),
    )
    console.log(
      "Elements on collection but not in the table:",
      missingInPostgres,
    )
  },
)

When("I connect to Postgres", async () => {
  await pgConnect(
    process.env.POSTGRESSQL_HOST || "",
    process.env.POSTGRESSQL_PORT || "",
    process.env.POSTGRESSQL_DB || "",
    process.env.POSTGRESSQL_USER || "",
    `${process.env.POSTGRESSQL_PASSWORD || ""}`,
  )
})

When("I disconnect from Postgres", async () => {
  await getPgConnection().close()
})

When(
  "I count the number of elements of the table {string} on Postgres",
  async ({}, table: string) => {
    pgNumberOfElements = await getPgConnection().countDocuments(table)
    console.log("Number OF elements on table:", pgNumberOfElements)
  },
)

When(
  "I count the new number of elements of the table {string} on Postgres",
  async ({}, table: string) => {
    newPgNumberOfElements = await getPgConnection().countDocuments(table)
    console.log("Number OF elements on table:", newPgNumberOfElements)
  },
)

When(
  "I get {string} of all rows of the table {string} on PostgresSql",
  async ({}, field: string, table: string) => {
    pgRows = await getPgConnection().getRowsBy(table, field)
  },
)

When(
  "I print by console the records there is in PostgresSql but not in Mongo",
  async ({}) => {
    const extraInPostgres = pgRows.filter((value) => !mongoDocs.includes(value))
    console.log("Elements on table but not in the collection:", extraInPostgres)
  },
)

When(
  "The difference between the original number of elements on Mongo and the current one should be {string}",
  async ({}, result: string) => {
    expect(
      Number(newMongoNumberOfElements) - Number(mongoNumberOfElements),
    ).toBe(Number(result))
  },
)

When(
  "The difference between the original number of elements on Postgres and the current one should be {string}",
  async ({}, result: string) => {
    expect(Number(newPgNumberOfElements) - Number(pgNumberOfElements)).toBe(
      Number(result),
    )
  },
)

When(
  "The number of elements of the Mongo collection should be equal to the Postgres table",
  async ({}) => {
    expect(Number(pgNumberOfElements)).toBe(Number(mongoNumberOfElements))
  },
)
