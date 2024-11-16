import { HttpRequester } from "./HttpRequester";

export class ReportService {
  static requester = HttpRequester.httpRequester();
  static async getTransaction(query='') {
    try {
      return await HttpRequester.get(`report/transaction${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async getVehicle(query='') {
    try {
      return await HttpRequester.get(`report/vehicle${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async getSlotReport(query='') {
    try {
      return await HttpRequester.get(`report/slot`);
    } catch (err) {
      throw err;
    }
  }
  static async getDetailVehicleReport(query='') {
    try {
      return await HttpRequester.get(`report/vehicle-details${query}`);
    } catch (err) {
      throw err;
    }
  }
}
