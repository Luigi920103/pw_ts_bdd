import {
  MongoClient,
  Db,
  Collection,
  Document,
  Filter,
  OptionalId,
} from "mongodb"

// 1. Eliminamos el import estático de arriba y declaramos una variable para uuid
let uuidv5: any

interface BaseDocument extends Document {
  _id: string
}

class MongoDBClient {
  private uri: string
  private dbName: string
  private client: MongoClient
  private db!: Db

  constructor(uri: string, dbName: string) {
    this.uri = uri
    this.dbName = dbName
    this.client = new MongoClient(this.uri)
  }

  async connect(): Promise<Db> {
    // 2. Cargamos uuid dinámicamente durante la conexión
    if (!uuidv5) {
      const uuidModule = await import("uuid")
      uuidv5 = uuidModule.v5
    }

    if (!(this.client as any).topology?.isConnected()) {
      await this.client.connect()
      console.log("✅ connected to MongoDB")
    }
    this.db = this.client.db(this.dbName)
    return this.db
  }

  generateCustomUUID(collection: string, extraKey: string): string {
    const keyword = `${process.env.BASE_KEYWORD_ID}-${collection}-${extraKey}`
    const nameSpace = process.env.UUID_NAMESPACE || ""

    // 3. Verificamos que uuidv5 esté cargado por si se llama antes de connect
    if (!uuidv5) {
      throw new Error("UUID library not loaded. Call connect() first.")
    }

    return uuidv5(keyword, nameSpace)
  }

  // ... (Resto de tus métodos: getDocumentsBy, updateOne, deleteOne, etc. se mantienen igual)

  async getDocumentsBy(
    collectionName: string,
    projection: Document = { _id: 1 },
  ): Promise<any[]> {
    const collection = this.db.collection(collectionName)
    return await collection.find({}, { projection }).toArray()
  }

  async updateOne(
    collectionName: string,
    filter: Filter<BaseDocument>,
    update: Record<string, any>,
  ) {
    const collection = this.db.collection<BaseDocument>(collectionName)
    return await collection.updateOne(filter, { $set: update })
  }

  async deleteOne(collectionName: string, filter: Filter<BaseDocument>) {
    const collection = this.db.collection<BaseDocument>(collectionName)
    const result = await collection.deleteOne(filter)

    if (process.env.API_DEBUG === "true") {
      console.log(
        `🗑️ MongoDB Delete: ${result.deletedCount} document removed from ${collectionName}`,
      )
    }

    return result
  }

  private getCollection<T extends Document = BaseDocument>(
    name: string,
  ): Collection<T> {
    return this.db.collection<T>(name)
  }

  async insertOne(collectionName: string, data: OptionalId<any>) {
    return await this.getCollection(collectionName).insertOne(data)
  }

  async countDocuments(
    collectionName: string,
    filter: Filter<BaseDocument> = {},
  ): Promise<number> {
    return await this.getCollection(collectionName).countDocuments(filter)
  }

  async find(
    collectionName: string,
    query: Filter<BaseDocument> = {},
  ): Promise<any[]> {
    return await this.getCollection(collectionName).find(query).toArray()
  }

  async checkBeforeClone(
    collectionName: string,
    extraKey: string,
  ): Promise<string> {
    const id = this.generateCustomUUID(collectionName, extraKey)
    const query: Filter<BaseDocument> = { _id: id }

    const collection = this.getCollection(collectionName)
    const docs = await collection.find(query).toArray()

    return docs.length === 0 ? "the UUID is unique on the collection" : id
  }

  async cloneAndModifyDocument(
    collectionName: string,
    filter: Filter<BaseDocument>,
    modifications: any,
    extraKey: string = "",
  ): Promise<{ result: any; newDoc: any }> {
    const collection = this.getCollection(collectionName)
    const originalDoc = await collection.findOne(filter)

    if (!originalDoc) {
      throw new Error("Document not found")
    }

    const newDoc = {
      ...originalDoc,
      ...modifications,
      _id: this.generateCustomUUID(collectionName, extraKey),
      createdAt: new Date(),
    }

    const result = await collection.insertOne(newDoc)
    return { result, newDoc }
  }

  async close(): Promise<void> {
    await this.client.close()
    console.log("🔴 MongoDB connection closed")
  }
}

export default MongoDBClient
