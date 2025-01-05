import { HttpRequester } from "./HttpRequester";

export class ProductService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`product${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async create(data) {
    try {
      return await HttpRequester.post('product', data);
    } catch (err) {
      throw err;
    }
  }
  static async get(query) {
    try {
      return await HttpRequester.get('product/' + query);
    } catch (err) {
      throw err;
    }
  }
  static async delete(id) {
    try {
      return await HttpRequester.delete('product/' + id);
    } catch (err) {
      throw err;
    }
  }
  static async put(id, data) {
    try {
      return await HttpRequester.put('product/' + id, data);
    } catch (err) {
      throw err;
    }
  }
}
