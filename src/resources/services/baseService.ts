import { APIRequestContext } from "../../fixtures/fixtures"
import ApiClient, { CustomAPIResponse } from "../../utils/apiClient"
import { ExtractRouteParams } from "../../utils/constants"

export abstract class BaseService {
  protected readonly baseUrl: string

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || ""
    if (!this.baseUrl) {
      console.warn("⚠️ API_BASE_URL is not defined")
    }
  }

  protected buildPath<T extends string>(
    path: T,
    params: Record<ExtractRouteParams<T>, string | number>,
  ): string {
    let finalPath: string = path

    Object.entries(params).forEach(([key, value]) => {
      finalPath = finalPath.replace(`{${key}}`, String(value))
    })

    return finalPath
  }
}
