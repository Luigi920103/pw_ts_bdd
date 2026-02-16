import { APIRequestContext } from "../../fixtures/fixtures"
import apiClient, { CustomAPIResponse } from "../../utils/apiClient"
import { apiPaths } from "../../utils/constants"
import { BaseService } from "./baseService"
class GetBookingServiceAction extends BaseService {
  async getBookingById(
    request: APIRequestContext,
    idExpected: string | number,
    config: object = {},
  ): Promise<CustomAPIResponse> {
    let getBookingPath: string = this.buildPath(apiPaths.Booking.ByID, {
      id: idExpected,
    })
    return await apiClient.get(request, this.baseUrl, getBookingPath, config)
  }
}

export default new GetBookingServiceAction()
