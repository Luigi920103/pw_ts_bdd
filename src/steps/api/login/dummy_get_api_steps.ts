import { Given, When, Then, expect } from "../../../fixtures/fixtures"
import DummyServiceAction from "../../../resources/services/dummy_get_service"
import { CustomAPIResponse } from "../../../utils/apiClient"

let response: CustomAPIResponse

Given("I check the dummy get service", async ({ request }) => {
  const config: { headers: Record<string, string> } = {
    headers: {
      test: "123",
    },
  }

  response = await DummyServiceAction.dummyGet(request, config)
})
