import { APIRequestContext } from "@playwright/test"
import apiClient, { CustomAPIResponse } from "../../utils/apiClient"

const dummyPath = "/account/login"
const baseUrl: string = process.env.AUTOMATION_API_BASE_URL || ""

class DummyServiceAction {
  async dummyGet(
    request: APIRequestContext,
    config: object = {},
  ): Promise<CustomAPIResponse> {
    return await apiClient.get(request, baseUrl, dummyPath, config)
  }
}

export default new DummyServiceAction()
