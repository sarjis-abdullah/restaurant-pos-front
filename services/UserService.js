import { HttpRequester } from "./HttpRequester";

export class UserService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`user${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async create(data) {
    try {
      return await HttpRequester.post('user', data);
    } catch (err) {
      throw err;
    }
  }
  static async login(data) {
    try {
      return await HttpRequester.post('login', data, false, 'login');
    } catch (err) {
      throw err;
    }
  }
  static async delete(id) {
    try {
      return await HttpRequester.delete('user/' + id);
    } catch (err) {
      throw err;
    }
  }
}
