import { HttpRequester } from "./HttpRequester";

export class MembershipService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`membership${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async create(data) {
    try {
      return await HttpRequester.post('membership', data);
    } catch (err) {
      throw err;
    }
  }
  static async delete(id) {
    try {
      return await HttpRequester.delete('membership/' + id);
    } catch (err) {
      throw err;
    }
  }
  static async put(id, data) {
    try {
      return await HttpRequester.put('membership/' + id, data);
    } catch (err) {
      throw err;
    }
  }
}
