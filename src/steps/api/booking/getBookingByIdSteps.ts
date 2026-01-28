import { Given, When, expect } from "../../../fixtures/fixtures"
import GetBookingServiceAction from "../../../resources/services/getBooking"
import { CustomAPIResponse } from "../../../utils/apiClient"

let response: CustomAPIResponse

When(
  "I get a booking by the id {string}",
  async ({ api, request }, id: string) => {
    response = await GetBookingServiceAction.getBookingById(request, id)
  },
)

When("the name is {string}", async ({}, firstName: string) => {
  expect(response.body.firstname).toBe(firstName)
})
