import { test as base, createBdd } from "playwright-bdd"
import ApiClient from "../utils/apiClient"
import { cleanVariables, deleteFile } from "../utils/commands"
import path from "path"
import HomePage from "../resources/pages/homePage"

type MyFixtures = {
  api: typeof ApiClient
  homePage: HomePage
}

const CACHE_FILE = path.resolve("./src/resources/temp/api_token_cache.json")

export const test = base.extend<MyFixtures>({
  api: async ({ request }, use) => {
    ApiClient.clearMocks(request)
    cleanVariables()

    await use(ApiClient)

    ApiClient.clearMocks(request)
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
})

export { expect } from "@playwright/test"
const { Given, When, Then, BeforeAll, AfterAll, Before, After } =
  createBdd(test)

BeforeAll(async () => {
  console.log("🧹 Cleaning cache tokens...")
  await deleteFile(CACHE_FILE)
})

export { Given, When, Then, BeforeAll, AfterAll, Before, After }
