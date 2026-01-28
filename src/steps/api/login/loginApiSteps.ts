import { When } from "../../../fixtures/fixtures"
import LoginServiceAction from "../../../resources/services/loginService"
import ApiSessionManager from "../../../utils/apiSessionManager"
import { CustomAPIResponse } from "../../../utils/apiClient"

let response: CustomAPIResponse

When(
  "I login with a {string} profile using the API",
  async ({ request }, role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        response = await LoginServiceAction.apiLogin(
          request,
          process.env.ADMIN_EMAIL || "",
          process.env.ADMIN_PASSWORD || "",
        )
        break
      case "regular user":
        response = await LoginServiceAction.apiLogin(
          request,
          process.env.REGULAR_USER_EMAIL || "",
          process.env.REGULAR_USER_PASSWORD || "",
        )
        break
      default:
        console.log(
          `This role ${role} has not been configured on the automation framework`,
        )
    }
  },
)

When(
  "I use a session with a {string} profile using the API",
  async ({ request }, role: string) => {
    await ApiSessionManager.getApiSession(request, role)
  },
)
