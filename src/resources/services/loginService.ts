import { APIRequestContext } from "@playwright/test"
import apiClient, { CustomAPIResponse } from "../../utils/apiClient"
import { apiPaths } from "../../utils/constants"

const baseUrl: string = process.env.AUTOMATION_API_BASE_URL || ""
const authPath: string = apiPaths.Login.auth

class LoginServiceAction {
  async apiLogin(
    request: APIRequestContext,
    user: string,
    password: string,
    config: object = {},
  ): Promise<CustomAPIResponse> {
    const payload = {
      username: user,
      password: password,
    }

    return await apiClient.post(request, baseUrl, authPath, payload, config)
  }
}

export default new LoginServiceAction()
