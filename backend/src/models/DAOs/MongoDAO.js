import BaseDAO from "./BaseDAO.js";

/**
 * Generic Mongoose-based DAO.
 * Instantiated once per Model and reused by all controllers.
 */
class MongoDAO extends BaseDAO {
  constructor(Model) {
    super();
    this.Model = Model;
  }

  async getAll(filters = {}) {
    return this.Model.find(filters).lean();
  }

  /**
   * Paginated query — used by GET /api/products
   * @param {object} filters  - Mongoose filter object
   * @param {object} options  - { page, limit, sort }
   * @returns {{ docs, totalDocs, totalPages, page }}
   */
  async paginate(filters = {}, { page = 1, limit = 10, sort = {} } = {}) {
    const skip = (page - 1) * limit;
    const [docs, totalDocs] = await Promise.all([
      this.Model.find(filters).sort(sort).skip(skip).limit(limit).lean(),
      this.Model.countDocuments(filters),
    ]);
    const totalPages = Math.ceil(totalDocs / limit);
    return { docs, totalDocs, totalPages, page };
  }

  async getById(id) {
    return this.Model.findById(id).lean();
  }

  async create(data) {
    const doc = new this.Model(data);
    return doc.save();
  }

  async update(id, data) {
    return this.Model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async delete(id) {
    return this.Model.findByIdAndDelete(id).lean();
  }

  async findOne(filters) {
    return this.Model.findOne(filters).lean();
  }

 async deleteMany(ids) {
   const result = await this.Model.deleteMany({ _id: { $in: ids } });
   return result.deletedCount ?? 0;
 }

 async updateMany(ids, data) {
   const result = await this.Model.updateMany(
     { _id: { $in: ids } },
     data,
     { runValidators: true }
   );
   return result.modifiedCount ?? 0;
 }


   /**
  * Precio máximo del catálogo completo (ignora paginación).
  * Usado por el frontend para calibrar el slider de rango de precio.
  */
  async getMaxPrice(filters = {}) {
    const result = await this.Model.aggregate([
      { $match: filters },
      { $group: { _id: null, max: { $max: "$price" } } },
    ]);
    return result[0]?.max ?? 0;
  }

}

export default MongoDAO;
