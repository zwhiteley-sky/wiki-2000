const express = require("express");
const image_router = express.Router();
const path = require("path");
const uuid = require("uuid");
const sharp = require("sharp");
const { error, ROUTE_ALL, ERR_ALL_AUTH } = require("../error");
const { validate, param, matchedData } = require("../validate");
const { ROUTE_IMAGE } = require("../error");
const fs = require("fs").promises;

const images_directory = path.join(__dirname, "..", "..", "database", "images");

/**
 * The image is invalid (e.g., a text file was posted
 * to masquerade as an image file).
 */
const ERR_IMAGE_INVALID = 0;

/**
 * The image was not found.
 */
const ERR_IMAGE_NOT_FOUND = 1;

image_router.get("/:id", validate([
    param("id")
        .isUUID(4)
        .withMessage("id must be a valid UUIDv4")
]), async (req, res) => {
    const { id } = matchedData(req);

    try {
        // NOTE: this should be safe as the validation already
        // guarantees a valid UUID has been provided, which
        // only contains hexadecimal characters and dashes,
        // preventing any security issues (e.g., including a
        // `..` to traverse to a parent directory)
        const image = await fs.readFile(path.join(images_directory, id));

        // Set the content type
        res.setHeader("Content-Type", "image/jpeg");
        res.status(200).send(image);
    } catch (e) {
        res.status(404).json(error(
            ROUTE_IMAGE,
            ERR_IMAGE_NOT_FOUND,
            "image not found"
        ));
    }
});

image_router.post("/", express.raw({
    // Accept an image
    inflate: true,
    limit: "1mb",
    type: (t) => t.headers['content-type'].startsWith("image/")
}), async (req, res) => {
    // Check the user is authenticated 
    // (otherwise non-users may spam us with images!)
    if (!req.user) {
        return res.status(401)
            .send(error(
                ROUTE_ALL,
                ERR_ALL_AUTH,
                "you must be authenticated to make this requerst"
            ));
    }

    // Generate the id of the new image
    const id = uuid.v4();

    if (!(req.body instanceof Buffer)) {
        return res.status(400).json(error(
            ROUTE_IMAGE,
            ERR_IMAGE_INVALID,
            "the image provided is invalid"
        ));
    }

    try {
        // Attempt to load the image
        const image = await sharp(req.body)
            // Convert the image to a JPEG
            // (this is a fairly standard format with
            // decent compression) to provide a
            // consistent image format to all requests
            .jpeg({ quality: 50 })
            
            // Convert it back to a buffer
            .toBuffer();

        // Write the image to a file 
        await fs.writeFile(path.join(images_directory, id), image);
        
        // Return the id of the image
        res.status(200).json({ id })
    } catch (e) {
        res.status(400).json(error(
            ROUTE_IMAGE,
            ERR_IMAGE_INVALID,
            "the image provided is invalid"
        ));
    }
});

module.exports = { image_router };