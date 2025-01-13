"use strict";

export function logger(req, res, next) {
  console.log(`${new Date()} - ${req.method} request to ${req.url}`);
  next();
}
