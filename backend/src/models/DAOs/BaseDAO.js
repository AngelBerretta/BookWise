/**
 * Abstract Base DAO.
 * All DAOs (FileSystemDAO, MongoDAO) must extend this class.
 */
class BaseDAO {
  async getAll(filters = {}) {
    throw new Error("getAll() not implemented");
  }

  async getById(id) {
    throw new Error("getById() not implemented");
  }

  async create(data) {
    throw new Error("create() not implemented");
  }

  async update(id, data) {
    throw new Error("update() not implemented");
  }

  async delete(id) {
    throw new Error("delete() not implemented");
  }

  async findOne(filters) {
    throw new Error("findOne() not implemented");
  }

  async deleteMany(ids) {
    throw new Error("deleteMany() not implemented");
  }

  async updateMany(ids, data) {
    throw new Error("updateMany() not implemented");
  }


  async getMaxPrice(filters = {}) {
    throw new Error("getMaxPrice() not implemented");
    }
  
}

export default BaseDAO;
