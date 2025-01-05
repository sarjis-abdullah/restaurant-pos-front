export class BaseHttpRequester {
  static DEVELOPMENT_API_URL = "http://localhost:8199/api/v1/";
  static getToken() {
    return window.localStorage.getItem("ACCESS_TOKEN");
  }
  static getHeaders() {
    const token = this.getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Adjust content type as needed
      },
    };
  }
}
