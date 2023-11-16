const express = require("express");
const { validate, query, param, body, matchedData } = require("../validate");
const { User, Article, Tag } = require("../models");
const { error, ROUTE_ARTICLE, ROUTE_ALL, ERR_ALL_AUTH } = require("../error");
const { Op } = require("sequelize");
const article_router = express.Router();

const PAGE_SIZE = 10;

const ERR_ARTICLE_NOT_FOUND = 0;
  
article_router.get("/", validate([
    query("page").optional().isInt(),
    query("tag").optional().notEmpty(),
    query("by").optional().isAlpha("en-GB", { ignore: " " })
]), async (req, res) => {
    const { page, tag, by } = matchedData(req);

    // The sequelize request body
    const body = {
        attributes: ["id", "title", "summary", "image_id"],
        include: [],
        limit: PAGE_SIZE
    };

    // Set the page
    if (page) body.offset = PAGE_SIZE * page;

    // Search for the author
    if (by) {
        body.include.push({
            model: User,
            as: "author",
            attributes: ["name"],
            where: {
                name: {
                    // NOTE: sequelize unfortunately uses LIKE
                    // under the hood, which allows an injection
                    // esque attack whereby the attacker includes
                    // wildcards (e.g., `%`) in the name to
                    // slow down the query. This should be
                    // prevented by validation but is definitely
                    // something to be weary of.
                    [Op.startsWith]: by
                }
            }
        });
    } else {
        body.include.push({
            model: User,
            as: "author",
            attributes: ["name"],
        });
    }

    // Search for articles with a specific tag
    if (tag) {
        body.include.push({
            model: Tag,
            attributes: ["name"],
            where: {
                name: tag
            },
            through: { attributes: [] }
        });
    } else {
        body.include.push({
            model: Tag,
            attributes: ["name"],
            through: { attributes: [] }
        });
    }

    // Find all articles using the body we generated
    const articles = (await Article.findAll(body))
        // Convert them to the correct format
        .map((article) => {
            return {
                id: article.id,
                title: article.title,
                summary: article.summary,
                image_id: article.image_id,
                author: {
                    id: article.author.id,
                    name: article.author.name
                },
                tags: article.tags.map((tag) => tag.name)
            }
        });

    res.status(200).json(articles);
});

article_router.get("/:id", validate([
    param("id")
        .isInt()
        .withMessage("path parameter must be an integer")
]), async (req, res) => {
    // Get the id path parameter
    const { id } = matchedData(req);

    // Get the article
    const article = await Article.findByPk(id, {
        include: [
            {
                model: User,
                as: "author",
                attributes: ["id", "name"]
            },
            {
                model: Tag,
                through: { attributes: [] }
            }
        ]
    });

    // If the article exists, return it
    if (article) res.status(200).json(article);
    
    // Otherwise, return an error
    else res.status(404).json(error(
        ROUTE_ARTICLE,
        ERR_ARTICLE_NOT_FOUND,
        "no article was found with the id specified"
    ));
});

article_router.post("/", validate([
    body("title")
        .notEmpty({ ignore_whitespace: true })
        .withMessage("article must have a title"),
    body("summary")
        .notEmpty({ ignore_whitespace: true })
        .withMessage("article must have a summary"),
    body("text")
        .notEmpty({ ignore_whitespace: true })
        .withMessage("article must have a body"),
    body("image_id")
        .isUUID(4)
        .withMessage("image id must be a UUIDV4"),
    body("tags")
        .optional()
        .isArray()
        .withMessage("tags must be an array of strings"),
    body("tags.*")
        .notEmpty({ ignore_whitespace: true })
        .withMessage("tags must not be empty")
]), async (req, res) => {
    // If the user is not authenticated
    if (!req.user) {
        return res.status(401).json(error(
            ROUTE_ALL,
            ERR_ALL_AUTH,
            "you must be authenticated to create an article"
        ));
    }

    const { title, summary, text, image_id, tags: tag_strings } = matchedData(req);

    // Create the article
    const article = await Article.create({
        title,
        summary,
        text,
        image_id,
        author_id: req.user.id
    });

    // Get the tags
    if (tag_strings) {
        const tags = [];

        for (const tag_string of tag_strings) {
            tags.push((await Tag.findOrCreate({
                where: { name: tag_string },
                defaults: { name: tag_string }
            }))[0]);
        }

        await article.addTags(tags);
    }

    res.status(204).send();
});

module.exports = { article_router };