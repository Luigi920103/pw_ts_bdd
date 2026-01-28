import { Given, When, Then } from "../../fixtures/fixtures"
import { getMongoConnection } from "../../utils/commands"

When("I insert a data on MongoDB", async () => {
  const insertResult = await getMongoConnection().insertOne("users", {
    name: "Luis Ruiz",
    age: 33,
  })
  console.log("🟢 Inserted user:", insertResult.insertedId)
})

When("I search for a data on MongoDB", async () => {
  const users = await getMongoConnection().find("users", { name: "Luis Ruiz" })
  console.log("🔍 Users Found:", users)
})

When("I update a data on MongoDB", async () => {
  const updateResult = await getMongoConnection().updateOne(
    "users",
    { name: "Luis Ruiz" },
    { age: 35 },
  )
  console.log("🟡 Updated record:", updateResult.modifiedCount)
})

When("I delete a data on MongoDB", async () => {
  const deleteResult = await getMongoConnection().deleteOne("users", {
    name: "Luis Ruiz",
  })
  console.log("🔴 User deleted:", deleteResult.deletedCount)
})
