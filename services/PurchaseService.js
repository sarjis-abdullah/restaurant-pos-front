import { HttpRequester } from "./HttpRequester";

export class PurchaseService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`purchase${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async create(data) {
    try {
      return await HttpRequester.post('purchase', data);
    } catch (err) {
      throw err;
    }
  }
  static async delete(id) {
    try {
      return await HttpRequester.delete('purchase/' + id);
    } catch (err) {
      throw err;
    }
  }
  static async put(id, data) {
    try {
      return await HttpRequester.put('purchase/' + id, data);
    } catch (err) {
      throw err;
    }
  }
}
