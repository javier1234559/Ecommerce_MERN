"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * Checks if the req.params.id is a valid Mongoose ObjectId.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @throws {Error} Throws an error if the ObjectId is invalid.
 */
function checkObjectId(req, res, next) {
    if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
        res.status(404);
        throw new Error(`Invalid ObjectId of:  ${req.params.id}`);
    }
    next();
}
exports.default = checkObjectId;
