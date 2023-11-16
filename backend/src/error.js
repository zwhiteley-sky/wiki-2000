// Route Codes
/**
 * The all route (for errors which apply to all or
 * multiple routes)
 */
const ROUTE_ALL = 0;

/**
 * The authentication router code.
 */
const ROUTE_AUTH = 1;

/**
 * The article router code.
 */
const ROUTE_ARTICLE = 2;

/**
 * The image router code.
 */
const ROUTE_IMAGE = 3;

// all error codes

/**
 * A miscellaneous error occurred.
 */
const ERR_ALL_MISC = 0;

/**
 * The payload provided is invalid (e.g., missing fields).
 * 
 * This is not considered a route-specific error as an invalid
 * body is considered a development issue, and should be handled
 * as such (i.e., generally speaking, it should be impossible
 * for the end user to cause a body invalidity error, as they
 * will be using a GUI and not the API directly).
 */
const ERR_ALL_INVALID = 1;

/**
 * The route you are accessing requires valid authentication.
 * 
 * This error code may be returned if authentication is provided,
 * but is invalid.
 */
const ERR_ALL_AUTH = 2;

/**
 * You are attempting to perform an operation you are not
 * authorised to do.
 */
const ERR_ALL_PERM = 3;

/**
 * Create an error object.
 * @param {number} route - The route code.
 * @param {number} code - The error code.
 * @param {string} message - The error message.
 */
function error(route, code, message) {
    return {
        error_code: (route << 16) | code,
        error_message: message
    };
}

module.exports = {
    ROUTE_ALL,
    ROUTE_ARTICLE,
    ROUTE_AUTH,
    ROUTE_IMAGE,
    ERR_ALL_MISC,
    ERR_ALL_INVALID,
    ERR_ALL_AUTH,
    ERR_ALL_PERM,
    error
};