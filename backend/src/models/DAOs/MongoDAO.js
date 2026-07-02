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
}

export default MongoDAO;
