import { HttpRequester } from "./HttpRequester";

export class SupplierService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`supplier${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async create(data) {
    try {
      return await HttpRequester.post('supplier', data);
    } catch (err) {
      throw err;
    }
  }
  static async get(query) {
    try {
      return await HttpRequester.get('supplier/' + query);
    } catch (err) {
      throw err;
    }
  }
  static async delete(id) {
    try {
      return await HttpRequester.delete('supplier/' + id);
    } catch (err) {
      throw err;
    }
  }
  static async put(id, data) {
    try {
      return await HttpRequester.put('supplier/' + id, data);
    } catch (err) {
      throw err;
    }
  }
}
