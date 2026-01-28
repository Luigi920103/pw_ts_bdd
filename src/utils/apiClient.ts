import { APIRequestContext, APIResponse } from "@playwright/test"
import { setLastApiResponse } from "./commands"
import * as allure from "allure-js-commons"

export interface CustomAPIResponse {
  curl: string
  status: number
  statusText: string
  headers: Record<string, string>
  body: any
  responseTimeMs: string
}

interface MockEntry {
  pattern: RegExp
  response: {
    status?: number
    headers?: Record<string, string>
    body?: any
  }
}

const timeoutValue = 60000
const mockRegistry = new Map<APIRequestContext, MockEntry[]>()

class ApiClient {
  /**
   * Registra un mock manual.
   */
  static setMock(
    request: APIRequestContext,
    pattern: string | RegExp,
    mockResponse: any,
  ): void {
    if (!mockRegistry.has(request)) {
      mockRegistry.set(request, [])
    }

    const finalPattern =
      typeof pattern === "string"
        ? new RegExp(pattern.replace(/^["']|["']$/g, ""))
        : pattern

    mockRegistry.get(request)?.push({
      pattern: finalPattern,
      response: mockResponse,
    })
  }

  static clearMocks(request: APIRequestContext): void {
    mockRegistry.delete(request)
  }

  private static async _handleRequest(
    request: APIRequestContext,
    requestFunction: () => Promise<APIResponse>,
    method: string,
    baseURL: string,
    path: string,
    config: any,
    data: any = null,
  ): Promise<CustomAPIResponse> {
    const url = `${baseURL}${path}`
    const activeMocks = mockRegistry.get(request) || []
    let apiResponse: CustomAPIResponse

    const isDebug = process.env.API_DEBUG?.toLowerCase() === "true"

    if (isDebug) {
      console.log(`\n🔍 [Checking]: ${method} ${url}`)
      console.log(`   - Active mocks: ${activeMocks.length}`)
    }

    const matchedMock = activeMocks.find((m) => m.pattern.test(url))

    if (matchedMock) {
      apiResponse = {
        curl: this.generateCurl(method, baseURL, path, config, data),
        status: matchedMock.response.status || 200,
        statusText: "OK (Mocked)",
        headers: matchedMock.response.headers || {
          "content-type": "application/json",
        },
        body: matchedMock.response.body || {},
        responseTimeMs: "0.00",
      }
      if (process.env.API_DEBUG?.toLowerCase() === "true") {
        console.log(`🎯 [MOCK MATCHED] Blocking real request to: ${url}`)
      }
    } else {
      const start = performance.now()
      const response = await requestFunction()
      const end = performance.now()

      apiResponse = await this._parseResponse(
        response,
        end - start,
        baseURL,
        method,
        path,
        config,
        data,
      )
    }

    if (isDebug) {
      console.log(
        `\n🔴 <<<<<<<<<< DEBUG ${method} ${matchedMock ? "(MOCKED)" : ""} 🔴`,
      )
      console.log(apiResponse.curl)
      console.log(
        `STATUS: ${apiResponse.status} | TIME: ${apiResponse.responseTimeMs}ms`,
      )
      console.log("RESPONSE:", JSON.stringify(apiResponse.body, null, 2))
      console.log("🔴🔴 >>>>>>>>>> 🔴🔴\n")

      await allure.step(
        `🌐 API ${method}: ${path} [${apiResponse.status}]`,
        async () => {
          await allure.attachment(
            "Request CURL",
            apiResponse.curl,
            "text/plain",
          )
          await allure.attachment(
            "Response Body",
            JSON.stringify(apiResponse.body, null, 2),
            "application/json",
          )
        },
      )
    }

    setLastApiResponse(apiResponse)
    return apiResponse
  }
  static async get(
    request: APIRequestContext,
    baseURL: string,
    path: string,
    config: any = {},
  ): Promise<CustomAPIResponse> {
    config.headers = this._setDefaultHeaders(config.headers)
    return this._handleRequest(
      request,
      () =>
        request.get(`${baseURL}${path}`, { ...config, timeout: timeoutValue }),
      "GET",
      baseURL,
      path,
      config,
    )
  }

  static async post(
    request: APIRequestContext,
    baseURL: string,
    path: string,
    data: any,
    config: any = {},
  ): Promise<CustomAPIResponse> {
    config.headers = this._setDefaultHeaders(config.headers)
    return this._handleRequest(
      request,
      () =>
        request.post(`${baseURL}${path}`, {
          ...config,
          data,
          timeout: timeoutValue,
        }),
      "POST",
      baseURL,
      path,
      config,
      data,
    )
  }

  static async put(
    request: APIRequestContext,
    baseURL: string,
    path: string,
    data: any,
    config: any = {},
  ): Promise<CustomAPIResponse> {
    config.headers = this._setDefaultHeaders(config.headers)
    return this._handleRequest(
      request,
      () =>
        request.put(`${baseURL}${path}`, {
          ...config,
          data,
          timeout: timeoutValue,
        }),
      "PUT",
      baseURL,
      path,
      config,
      data,
    )
  }

  static async delete(
    request: APIRequestContext,
    baseURL: string,
    path: string,
    config: any = {},
  ): Promise<CustomAPIResponse> {
    config.headers = this._setDefaultHeaders(config.headers)
    return this._handleRequest(
      request,
      () =>
        request.delete(`${baseURL}${path}`, {
          ...config,
          timeout: timeoutValue,
        }),
      "DELETE",
      baseURL,
      path,
      config,
    )
  }

  static generateCurl(
    method: string,
    baseURL: string,
    path: string,
    config: any = {},
    data: any = null,
  ): string {
    let curl = `curl -X ${method.toUpperCase()} "${baseURL}${path}"`
    if (config.headers) {
      for (const [key, value] of Object.entries(config.headers)) {
        curl += ` -H "${key}: ${value}"`
      }
    }
    if (data !== null) curl += ` -d '${JSON.stringify(data)}'`
    return curl
  }

  private static _setDefaultHeaders(userHeaders: any = {}): any {
    return { "Content-Type": "application/json", ...userHeaders }
  }

  private static async _parseResponse(
    response: APIResponse,
    responseTimeMs: number,
    baseURL: string,
    method: string,
    path: string,
    config: any,
    data: any = null,
  ): Promise<CustomAPIResponse> {
    let body: any
    const text = await response.text()
    try {
      body = JSON.parse(text)
    } catch {
      body = text
    }
    return {
      curl: this.generateCurl(method, baseURL, path, config, data),
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      body,
      responseTimeMs: responseTimeMs.toFixed(2),
    }
  }
}

export default ApiClient
