const express = require("express");
const { validate, body, matchedData } = require("../validate");
const { User } = require("../models");
const { error, ROUTE_AUTH } = require("../error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize");
const auth_router = express.Router();

const ERR_AUTH_INVALID_LOGIN = 0;
const ERR_AUTH_LOGIN_MSG = "invalid email or password";
const ERR_AUTH_EMAIL_TAKEN = 1;

let jwt_key;

/**
 * Returns the JWT key used to sign JWTs.
 * @returns {Buffer} The JWT key.
 */
function get_key() {
    if (jwt_key) return jwt_key;

    if (!process.env.JWT_KEY)
        throw new Error("JWT_KEY env not set");

    return Buffer.from(process.env.JWT_KEY);
}

/**
 * The JWT authentication middleware.
 * 
 * This sets `req.user` to the JWT's payload (if valid), unset
 * otherwise.
 * @param {import('express').Request} req - The request.
 * @param {import('express').Response} res - The response.
 * @param {import('express').NextFunction} next - The next handler.
 */
async function auth_handler(req, res, next) {
    const BEARER = "bearer ";
    const header = req.headers['authorization'];

    if (!header || !header.toLowerCase().startsWith(BEARER)) return next();

    const token = header.slice(BEARER.length)

    try {
        const payload = jwt.verify(token, get_key());
        req.user = payload;
    } catch (e) {
        if (e instanceof Error) throw e;
    }

    return next();
}

auth_router.post("/login", validate([
    body("email")
        .isEmail()
        .withMessage("invalid email"),
    body("password")
        .notEmpty()
        .withMessage("password must be provided")
]), async (req, res) => {
    // Get the matched data
    const { email, password } = matchedData(req);

    // Get the user
    const user = await User.findOne({
        where: { email }
    });

    // If the user was not found, or the
    // user does not have a password hash
    if (!user || !user.hash) {
        return res.status(401)
            .json(error(
                ROUTE_AUTH, 
                ERR_AUTH_INVALID_LOGIN, 
                ERR_AUTH_LOGIN_MSG
            ));
    }

    // Comparse hashes
    if (!(await bcrypt.compare(password, user.hash))) {
        // If the hash is incorrect
        return res.status(401)
            .json(error(
                ROUTE_AUTH, 
                ERR_AUTH_INVALID_LOGIN, 
                ERR_AUTH_LOGIN_MSG
            ));
    }

    // Generate a JWT
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name,
    }, get_key(), {
        expiresIn: "1d"
    });

    // Give the user the token
    res.status(200)
        .json({
            id: user.id,
            email: user.email,
            name: user.name,
            token
        });
});

auth_router.post("/register", validate([
    body("name")
        .notEmpty({ ignore_whitespace: true })
        .withMessage("a name must be provided")
        .isAlpha("en-GB", { ignore: " " })
        .withMessage("the name must only be formed of alphabetical characters"),
    body("email")
        .isEmail()
        .withMessage("email is invalid"),
    body("password")
        .notEmpty()
        .withMessage("a password must be provided")
]), async (req, res) => {
    const { name, email, password } = matchedData(req);

    // Calculate hash
    const hash = await bcrypt.hash(password, 12);

    try {
        // Create the user
        await User.create({
            name, email, hash
        });

        // Send a 204
        return res.status(204).send();
    } catch (e) {
        if (e instanceof UniqueConstraintError) {
            return res.status(403)
                .json(error(
                    ROUTE_AUTH,
                    ERR_AUTH_EMAIL_TAKEN,
                    "the email is already in use"
                ));
        }

        throw e;
    }
});

module.exports = { auth_handler, auth_router };
