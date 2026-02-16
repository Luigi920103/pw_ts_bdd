import { Page, Locator } from "../../fixtures/fixtures"
import { BasePage } from "./basePage"

export default class HomePage extends BasePage {
  readonly url: string
  readonly productsContainer: Locator
  readonly productThumb: Locator
  readonly successAlert: Locator

  constructor(page: Page) {
    super(page)
    this.url = `${process.env.UI_BASE_URL}`
    this.productsContainer = page.locator("#content div.row")
    this.productThumb = page.locator('div[class="product-thumb transition"]')
    this.successAlert = page.locator(".alert-success")
  }

  async navigateToHome(): Promise<void> {
    await this.navigate()
    await this.productsContainer.first().waitFor()
  }

  async addFeaturedElement(productTitle: string): Promise<void> {
    const productCard = this.productThumb.filter({
      has: this.page.getByAltText(productTitle),
    })
    await productCard.getByRole("button", { name: /add to cart/i }).click()
  }

  async getSuccessAlertText(): Promise<string> {
    return await this.successAlert.innerText()
  }

  async thisIsATest(): Promise<string> {
    return await this.successAlert.innerText()
  }
}
