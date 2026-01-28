import { Given, When, Then, expect } from "../../fixtures/fixtures"
import { getPgConnection, setPostgresData } from "../../utils/commands"

When("I insert a data on Postgres", async () => {
  const insertResult = await getPgConnection().insert(
    "users",
    ["name", "age"],
    ["Luis Ruiz", 33],
  )
  console.log("🟢 User inserted:", insertResult.rows[0])
})

When("I search for a data on Postgres", async () => {
  const users = await getPgConnection().find("users", "name = $1", [
    "Luis Ruiz",
  ])
  console.log("🔍 Users Found:", users.rows)
})

When(
  "I get data from table {string} using the condition {string} and filter {string}, expecting {string} records",
  async (
    {},
    table: string,
    condition: string,
    filter: string,
    expectedRecords: string,
  ) => {
    const data = await getPgConnection().find(table, condition, [filter])
    setPostgresData(data.rows)

    expect(data.rows.length).toBe(Number(expectedRecords))
  },
)

When("I update a data on Postgres", async () => {
  const updateResult = await getPgConnection().update(
    "users",
    { age: 35 },
    "name = $2",
    ["Luis Ruiz"],
  )
  console.log("🟡 Updated record:", updateResult.rows[0])
})

When("I delete a data on Postgres", async () => {
  const deleteResult = await getPgConnection().delete("users", "name = $1", [
    "Luis Ruiz",
  ])
  console.log("🔴 User deleted:", deleteResult.rows[0])
})
