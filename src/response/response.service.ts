import { Injectable, HttpStatus } from '@nestjs/common';

export interface ResponseData {
  status: number;
  message: string;
  data?: any;
  img?: string;
}

@Injectable()
export class ResponseService {
  successResponse = function (res, msg) {
    let data = {
      status: 200,
      message: msg,
    };
    return res.status(200).json(data);
  };

 

successResponseWithData = function (res: any, msg: string, data: any, img?: string) {
  let resData: ResponseData = {
    status: 200,
    message: msg,
    data: data
  };
  if (img) {
    resData.img = img;  // Add img only if it is not undefined
  }
  return res.status(200).json(resData);
};




  ErrorResponse = function (res, msg) {
    let data = {
      status: 500,
      message: msg,
    };
    return res.status(500).json(data);
  };

  notFoundResponse = function (res, msg) {
    let data = {
      status: 400,
      message: msg,
    };
    return res.status(400).json(data);
  };

  validationErrorWithData = function (res, msg, data) {
    let resData = {
      status: 403,
      message: msg,
      data: data,
    };
    return res.status(403).json(resData);
  };

  unauthorizedResponse = function (res, msg) {
    let data = {
      status: 401,
      message: msg,
    };
    return res.status(401).json(data);
  };
}
