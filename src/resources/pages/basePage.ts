import { Page, Locator } from "../../fixtures/fixtures"

export class BasePage {
  public readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async navigate(path: string = "/") {
    this.page.goto(path)
  }
}
