import { Given, When, Then, expect } from "../../fixtures/fixtures"

Given("I visit the home page", async ({ homePage }) => {
  await homePage.navigate()
})

When(
  "I add to car a {string} from home page",
  async ({ homePage }, product: string) => {
    await homePage.addFeaturedElement(product)
  },
)

Then(
  "I should see a success alert with message {string}",
  async ({ homePage }, expectedMessage: string) => {
    const alertText = await homePage.getSuccessAlertText()
    expect(alertText).toContain(expectedMessage)
  },
)
