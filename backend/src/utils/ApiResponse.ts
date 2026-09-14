export class ApiResponse<T>{
  readonly message: string;
  readonly data: T;
  constructor(data: T, message: string = "Success"){
    this.message = message;
    this.data = data;
  }
}