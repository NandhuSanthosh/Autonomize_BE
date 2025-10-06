export default class CustomError extends Error {
  constructor(status, message, responseCode) {
    super(message);
    this.status = status;
    console.log(responseCode || "001");
    this.responseCode = responseCode || "001"; // 000 means no consoling error message, 001 means consoles error message
  }
}
