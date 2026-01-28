import { Pool, PoolClient, QueryResult, PoolConfig } from "pg"

interface CustomPostgresConfig extends PoolConfig {
  idleTimeoutMillis?: number
  connectionTimeoutMillis?: number
}

class PostgresClient {
  private pool: Pool
  private client: PoolClient | null

  constructor(config: CustomPostgresConfig = {}) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      max: config.max || 10,
      idleTimeoutMillis: config.idleTimeoutMillis || 30000,
      connectionTimeoutMillis: config.connectionTimeoutMillis || 10000,
      ...(process.env.POSTGRESSQL_SSL === "true" && {
        ssl:
          process.env.POSTGRESSQL_SSL === "true"
            ? ({ rejectUnauthorized: false } as any)
            : false,
      }),
      ...config,
    })
    this.client = null
  }

  async connect(): Promise<void> {
    if (!this.client) {
      this.client = await this.pool.connect()
      console.log("✅ connected to PostgreSQL")
    }
  }

  async query(queryText: string, params: any[] = []): Promise<QueryResult> {
    if (!this.client) {
      throw new Error(
        "❌ There is no active connection to PostgreSQL. Call connect() first.",
      )
    }
    const res = await this.client.query(queryText, params)
    return res
  }

  async insert(
    table: string,
    columns: string[],
    values: any[],
  ): Promise<QueryResult> {
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ")
    const queryText = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`
    return await this.query(queryText, values)
  }

  async countDocuments(
    table: string,
    condition: string = "1=1",
    params: any[] = [],
  ): Promise<string | number> {
    const queryText = `SELECT COUNT(*) FROM ${table} WHERE ${condition}`
    const result = await this.query(queryText, params)
    return result.rows[0].count
  }

  async getRowsBy(
    table: string,
    field: string = "id",
    params: any[] = [],
  ): Promise<string[]> {
    const queryText = `SELECT ${field} FROM ${table}`
    const { rows } = await this.query(queryText, params)
    return rows.map((row) => row[field]?.toString())
  }

  async find(
    table: string,
    condition: string = "1=1",
    params: any[] = [],
  ): Promise<QueryResult> {
    const queryText = `SELECT * FROM ${table} WHERE ${condition}`
    return await this.query(queryText, params)
  }

  async update(
    table: string,
    updates: Record<string, any>,
    condition: string,
    conditionParams: any[],
  ): Promise<QueryResult> {
    const setColumns = Object.keys(updates)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(", ")

    const queryText = `UPDATE ${table} SET ${setColumns} WHERE ${condition} RETURNING *`
    return await this.query(queryText, [
      ...Object.values(updates),
      ...conditionParams,
    ])
  }

  async delete(
    table: string,
    condition: string,
    params: any[],
  ): Promise<QueryResult> {
    const queryText = `DELETE FROM ${table} WHERE ${condition} RETURNING *`
    return await this.query(queryText, params)
  }

  async close(): Promise<void> {
    if (this.client) {
      this.client.release()
      console.log("🔴 PostgreSQL connection released")
      this.client = null
    }
  }
}

export default PostgresClient
