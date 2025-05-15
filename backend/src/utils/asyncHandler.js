import { Promise } from "mongoose";

export default function asyncHandler(requestHandler) {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next).catch((err) => next(err)));
  };
}
