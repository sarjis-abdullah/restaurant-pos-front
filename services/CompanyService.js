import { HttpRequester } from "./HttpRequester";

export class CompanyService {
  static requester = HttpRequester.httpRequester();

  static async getAll(query = '') {
    try {
      return await HttpRequester.get(`company${query}`);
    } catch (err) {
      throw err;
    }
  }

  static async create(data) {
    try {
      return await HttpRequester.post('company', data);
    } catch (err) {
      throw err;
    }
  }

  static async delete(id) {
    try {
      return await HttpRequester.delete(`company/${id}`);
    } catch (err) {
      throw err;
    }
  }

  static async put(id, data) {
    try {
      return await HttpRequester.put(`company/${id}`, data);
    } catch (err) {
      throw err;
    }
  }
}
