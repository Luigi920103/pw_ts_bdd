import { APIRequestContext } from "@playwright/test"
import apiClient, { CustomAPIResponse } from "../../utils/apiClient"
import { apiPaths } from "../../utils/constants"
import ApiSessionManager from "../../utils/ApiSessionManager"

const baseUrl: string = process.env.AUTOMATION_API_BASE_URL || ""

interface BookingPayload {
  firstname?: string
  lastname?: string
  totalprice?: number
  depositpaid?: boolean
  bookingdates?: {
    checkin: string
    checkout: string
  }
  additionalneeds?: string
}

class UpdateBookingServiceAction {
  getDefaultPayload(): BookingPayload {
    return {
      firstname: "John",
      lastname: "Smith",
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01",
      },
      additionalneeds: "Breakfast",
    }
  }

  async updateBookingById(
    request: APIRequestContext,
    id: string | number,
    role: string = "admin",
    customPayload: Partial<BookingPayload> = {},
    config: any = null,
  ): Promise<CustomAPIResponse> {
    const payload = { ...this.getDefaultPayload(), ...customPayload }
    if (!config) {
      console.log(
        `Using role "${role}" to get session token for UpdateBookingById`,
      )
      const session =
        (await ApiSessionManager.getApiSession(request, role)) ?? ""

      config = {
        headers: {
          Cookie: `token=${session}`,
        },
      }
    }

    const getBookingPath = apiPaths.Booking.ByID.replace("{id}", String(id))

    return await apiClient.put(
      request,
      baseUrl,
      getBookingPath,
      payload,
      config,
    )
  }
}

export default new UpdateBookingServiceAction()
