import { APIRequestContext } from "@playwright/test"
import apiClient, { CustomAPIResponse } from "../../utils/apiClient"
import { apiPaths } from "../../utils/constants"

const baseUrl: string = process.env.AUTOMATION_API_BASE_URL || ""

class GetBookingServiceAction {
  async getBookingById(
    request: APIRequestContext,
    id: string | number,
    config: object = {},
  ): Promise<CustomAPIResponse> {
    let getBookingPath: string = apiPaths.Booking.ByID
    getBookingPath = getBookingPath.replace("{id}", String(id))
    return await apiClient.get(request, baseUrl, getBookingPath, config)
  }
}

export default new GetBookingServiceAction()
