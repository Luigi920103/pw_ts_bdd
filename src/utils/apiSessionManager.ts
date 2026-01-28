import fs from "fs"
import path from "path"
import { APIRequestContext } from "@playwright/test"
import LoginServiceAction from "../resources/services/loginService"
import { setCurrentRole } from "./commands"

const TEMP_DIR = path.resolve("./src/resources/temp")
const CACHE_FILE = path.join(TEMP_DIR, "api_token_cache.json")

interface TokenCache {
  [role: string]: string
}

class ApiSessionManager {
  async getApiSession(
    request: APIRequestContext,
    role: string,
  ): Promise<string> {
    console.log(`🔑 Recovering session token for the role: ${role}`)
    const roleKey = role.toLowerCase()

    let tokenCache: TokenCache = this._readCache()

    if (!tokenCache[roleKey]) {
      console.log(
        `🚀 Generating new session token for [${roleKey}] in: ${CACHE_FILE}`,
      )

      const credentials = this._getCredentials(roleKey)
      const apiResponse = await LoginServiceAction.apiLogin(
        request,
        credentials.email || "",
        credentials.password || "",
      )

      if (Number(apiResponse.status) !== 200) {
        throw new Error(
          `Error login for ${roleKey}. Status: ${apiResponse.status}`,
        )
      }

      const body = apiResponse.body
      tokenCache[roleKey] = body.token

      this._writeCache(tokenCache)
    }

    console.log(`✅ Token recovered for: ${roleKey}`)
    setCurrentRole(roleKey)
    return tokenCache[roleKey]
  }

  private _readCache(): TokenCache {
    try {
      if (fs.existsSync(CACHE_FILE)) {
        const data = fs.readFileSync(CACHE_FILE, "utf-8")
        return JSON.parse(data)
      }
    } catch (e) {
      console.error("Error trying to read the cache tokens file:", e)
    }
    return {}
  }

  private _writeCache(cache: TokenCache): void {
    try {
      if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR, { recursive: true })
      }
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
    } catch (e) {
      console.error("Error trying to write the cache tokens file ", e)
    }
  }

  private _getCredentials(roleKey: string) {
    if (roleKey === "admin") {
      return {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      }
    }
    if (roleKey === "regular user") {
      return {
        email: process.env.REGULAR_USER_EMAIL,
        password: process.env.REGULAR_USER_PASSWORD,
      }
    }
    throw new Error(`Rol ${roleKey} is not configured.`)
  }
}

export default new ApiSessionManager()
