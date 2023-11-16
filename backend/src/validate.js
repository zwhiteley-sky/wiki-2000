const { validationResult, body, param, query, matchedData, oneOf } = require("express-validator");
const { ROUTE_ALL, ERR_ALL_INVALID } = require("./error");

/**
 * Automatically handle validation chain error reporting.
 * @param {import('express-validator').ValidationChain[]} validations - The validation chains.
 * @returns A validator function.
 */
function validate(validations) {
    return async function(req, res, next) {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }
    
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
    
        res.status(400)
            .json({ 
                error_code: (ROUTE_ALL << 16) | ERR_ALL_INVALID,
                errors: errors.array() 
            });
    }
}

module.exports = { 
    validate, 
    body, 
    param, 
    query, 
    oneOf,
    matchedData 
};