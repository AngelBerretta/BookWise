import fs      from "node:fs";
import path    from "node:path";
import { fileURLToPath } from "node:url";          // ← necesario para recrear __dirname
import BaseDAO from "./BaseDAO.js";

// En ESM __dirname no existe — se reconstruye así:
const __filename = fileURLToPath(import.meta.url);  // ruta absoluta de este archivo
const __dirname  = path.dirname(__filename);         // directorio de este archivo

const DATA_DIR = path.join(__dirname, "../../../data");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

class FileSystemDAO extends BaseDAO {
  constructor(collectionName) {
    super();
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    this._ensureFile();
  }

  // ── Métodos privados ────────────────────────────────────────────────────────

  _ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  _read() {
    return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  // ── Métodos públicos (BaseDAO) ──────────────────────────────────────────────

  async getAll(filters = {}) {
    const data = this._read();
    if (!Object.keys(filters).length) return data;
    return data.filter((item) =>
      Object.entries(filters).every(([k, v]) => item[k] === v)
    );
  }

  async paginate(filters = {}, { page = 1, limit = 10, sort = {} } = {}) {
    let data = await this.getAll(filters);

    // Ordenamiento simple por un campo
    const [sortField, sortOrder] = Object.entries(sort)[0] || [];
    if (sortField) {
      data = data.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === 1 ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 1 ? 1 : -1;
        return 0;
      });
    }

    const totalDocs = data.length;
    const totalPages = Math.ceil(totalDocs / limit);
    const skip = (page - 1) * limit;
    const docs = data.slice(skip, skip + limit);
    return { docs, totalDocs, totalPages, page };
  }

  async getById(id) {
    const data = this._read();
    return data.find((item) => item._id === id) || null;
  }

  async create(payload) {
    const data    = this._read();
    const newDoc  = {
      _id: this._generateId(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.push(newDoc);
    this._write(data);
    return newDoc;
  }

  async update(id, updates) {
    const data = this._read();
    const idx  = data.findIndex((item) => item._id === id);
    if (idx === -1) return null;
    data[idx]  = { ...data[idx], ...updates, updatedAt: new Date().toISOString() };
    this._write(data);
    return data[idx];
  }

  async delete(id) {
    const data      = this._read();
    const idx       = data.findIndex((item) => item._id === id);
    if (idx === -1) return null;
    const [deleted] = data.splice(idx, 1);
    this._write(data);
    return deleted;
  }

  async findOne(filters) {
    const data = this._read();
    return (
      data.find((item) =>
        Object.entries(filters).every(([k, v]) => item[k] === v)
      ) || null
    );
  }

   async deleteMany(ids) {
   const data = this._read();
   const idSet = new Set(ids);
   const remaining = data.filter((item) => !idSet.has(item._id));
   this._write(remaining);
   return data.length - remaining.length;
 }

   async updateMany(ids, updates) {
   const data = this._read();
   const idSet = new Set(ids);
   let modifiedCount = 0;
   const updated = data.map((item) => {
     if (!idSet.has(item._id)) return item;
     modifiedCount++;
     return { ...item, ...updates, updatedAt: new Date().toISOString() };
   });
   this._write(updated);
   return modifiedCount;
 }

    async getMaxPrice(filters = {}) {
    const data = await this.getAll(filters);
    if (!data.length) return 0;
    return Math.max(...data.map((d) => d.price ?? 0));
  }

}

export default FileSystemDAO;