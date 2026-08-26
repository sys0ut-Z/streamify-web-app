export class ApiResponse{
  readonly message: string;
  readonly data: any;
  constructor(data: any, message: string = "Success"){
    this.message = message;
    this.data = data;
  }
}