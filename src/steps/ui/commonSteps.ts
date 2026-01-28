import { When, expect } from "../../fixtures/fixtures"

When("I want to debug from this point", async ({ page }) => {
  if (process.env.PAUSE_APP_ON_DEBUG?.toLowerCase() === "true") {
    await page.pause()
  }
})

When("I wait for {string} mili seconds", async ({ page }, time) => {
  await page.waitForTimeout(Number(time))
})

When(
  "I check the {string} page to see if there is any change to the previous version of the UI {string}",
  async ({ page, homePage }, pageName: string, snapshotName: string) => {
    const pagesMap: Record<string, any> = {
      home: homePage,
    }
    const key = pageName.toLowerCase()
    const targetPageObject = pagesMap[key]

    if (!targetPageObject) {
      throw new Error(
        `Page object for "${pageName}" not found in pagesMap. Registered pages: ${Object.keys(pagesMap).join(", ")}`,
      )
    }

    await expect(targetPageObject.page).toHaveScreenshot(snapshotName, {
      fullPage: true,
      animations: "disabled",
    })
  },
)
