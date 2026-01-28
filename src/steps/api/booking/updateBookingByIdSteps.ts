import { Given, When, expect } from "../../../fixtures/fixtures"
import UpdateBookingServiceAction from "../../../resources/services/updateBooking"
import { getCurrentRole } from "../../../utils/commands"
import { CustomAPIResponse } from "../../../utils/apiClient"

let response: CustomAPIResponse

When(
  "I update the booking {string} with the following data:",
  async ({ api, request }, id: string, dataTable) => {
    const updates = dataTable.rowsHash()

    if (updates.totalprice) updates.totalprice = Number(updates.totalprice)
    if (updates.depositpaid)
      updates.depositpaid = updates.depositpaid === "true"

    response = await UpdateBookingServiceAction.updateBookingById(
      request,
      id,
      getCurrentRole(),
      updates,
    )
  },
)

When(
  "I update the booking {string} changing {string} to {string}",
  async ({ api, request }, id: string, key: string, value: string) => {
    const payload: any = UpdateBookingServiceAction.getDefaultPayload()

    if (key.includes(".")) {
      const [parent, child] = key.split(".")
      if (payload[parent]) {
        payload[parent][child] = value
      }
    } else {
      payload[key] = value
    }

    response = await UpdateBookingServiceAction.updateBookingById(
      request,
      id,
      getCurrentRole(),
      payload,
    )
  },
)
