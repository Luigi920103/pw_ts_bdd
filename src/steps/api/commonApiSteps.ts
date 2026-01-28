import { Given, When, Then, expect, test } from "../../fixtures/fixtures"
import { getLastApiResponse } from "../../utils/commands"
import ApiClient from "../../utils/apiClient"
import * as baseSchema from "../../resources/schemas/indexSchema"
import fs from "fs"
import path from "path"

When(
  "the service responds with status code {string}",
  async ({}, statusCode: string) => {
    expect(getLastApiResponse().status).toBe(Number(statusCode))
  },
)

When(
  "the service responds in less than {string} ms",
  async ({}, expected: string) => {
    const currentTime = Number(getLastApiResponse().responseTimeMs)
    const expectedTime = Number(expected)
    expect(
      currentTime,
      `❌ Response time ${currentTime}ms is greater than expected ${expectedTime}ms`,
    ).toBeLessThan(expectedTime)
  },
)

When(
  "the service responds with the schema {string}",
  async ({}, schema: string) => {
    const schemaValidator = (baseSchema as any)[schema]

    if (!schemaValidator) {
      throw new Error(`❌ Schema "${schema}" not found in baseSchema`)
    }

    const response = getLastApiResponse().body
    const { error } = schemaValidator.validate(response, { abortEarly: false })

    if (error) {
      throw new Error(
        `❌ Schema response is not valid:\n${JSON.stringify(error.details, null, 2)}`,
      )
    }
    console.log(`✅ Schema "${schema}" validated successfully`)
  },
)

When(
  "In the error response, the path field is {string} and the message says {string}",
  async ({}, pathString: string, expectedMessage: string) => {
    const apiResponse = getLastApiResponse().body.data.error[0]

    expect
      .soft(apiResponse.path[0], `path should be ${pathString}`)
      .toBe(pathString)
    expect
      .soft(apiResponse.message, `message should be ${expectedMessage}`)
      .toBe(expectedMessage)

    expect(test.info().errors).toHaveLength(0)
  },
)

When(
  "In the error response, the path field is {string} and the message contains {string}",
  async ({}, pathString: string, expectedMessage: string) => {
    const apiResponse = getLastApiResponse().body.data.error[0]

    expect
      .soft(apiResponse.path[0], `path should be ${pathString}`)
      .toBe(pathString)
    expect
      .soft(apiResponse.message, `message should be ${expectedMessage}`)
      .toContain(expectedMessage)

    expect(test.info().errors).toHaveLength(0)
  },
)

When(
  "I mock the {string} service using the file {string}",
  async ({ api, request }, urlPattern: string, fileName: string) => {
    const mockPath = path.resolve(`./src/resources/mocks/${fileName}.json`)

    if (!fs.existsSync(mockPath)) {
      throw new Error(`there is no file with in the path ${mockPath}`)
    }

    const mockData = JSON.parse(fs.readFileSync(mockPath, "utf-8"))

    ApiClient.setMock(request, urlPattern, {
      status: mockData.status || 200,
      headers: {
        ...mockData.headers,
        "Content-Type": mockData.contentType || "application/json",
      },
      body: mockData.body,
    })
    console.log(
      `✅ Mock activated "${urlPattern}" using the file "${fileName}.json"`,
    )
  },
)
