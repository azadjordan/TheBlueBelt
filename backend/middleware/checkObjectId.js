import { isValidObjectId } from "mongoose";

function checkObjectId(req, res, next) {
    if(!isValidObjectId(req.params.id)){
        const error = new Error(`Invalid Object of: ${req.params.id}`);
        error.status = 404;
        return next(error);
    }
    next();
}

export default checkObjectId;
