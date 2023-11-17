![logo](https://apollo-media.codio.com/media%2F1%2F7d707812d666c4d0863cefc06585b6e3-1b06377916d4983c.webp)

# React Project: Wikiverse The App
You are a creative content developer that needs a better system for publishing articles. You stumble across a great example called Wikipedia and decide to implement something like it, with a twist: You’ll build it as a Single Page Application, using React! This project will require that you utilize:
- Components
- Props
- State
- State
- Event
- AJAX (include different HTTP methods)
-Forms

##Starting Point
We will start with a pre-built db connection via Sequelize, including express routes serving up the data via different REST verbs (GET, POST, PUT, and DELETE).
We have 3 database models:
- Page
- User
- Tag


##Setup
This repository is a TEMPLATE repository. This is very similar to forking, but breaks the connection with the original repository so that you can
1. Select “Use this Template” for this repo.
2. Select “Create a new repository”
3. Give the project the EXACT SAME NAME as the original repository
4. Clone down YOUR TEMPLATE (not the original repo)


##Single Page View

The code in the project is built out on the back end. Follow the README instructions to start up the server with the seed script, server start and client (react) start script. You’ll need to have 2 terminals open to run both simultaneously. 

You’ll be working in the public folder, since that’s where the React front end code lives. Take a moment to familiarize yourself with the setup (in ./public/)

Once you’ve got the app started up, it’s time to make your first edit and add support for the single page view! Here are a few requirements:

1. When a user clicks a single article in the list, the details show the article’s:
 - Title
 - Author
 - Content
 - Tags
 - Date (createdAt)

2. You’ll have to:
    -Make a fetch request to the /wiki/:slug endpoint for the specific article.
    -Set the article data on state (a new piece of state)
    -Render the article data in a component

3. If a user clicks a “Back to Wiki List” button, the view shows original list of all the articles, no details (just title)


##Adding Page

We now have 2 different views (list view and single view). We now want to add support for creating pages!
1.	Create a button on the main page
2.	When the button is clicked, set a boolean to true on state (something like isAddingArticle or something
3.	When the boolean is true display a form (instead of the list of pages)
4.	The form should have inputs for all the required fields
o	Title
o	Content
o	Author name (should be sent as name in the body of the request)
o	Author email (should be sent as email in the body of the request)
o	Optionally, a list of tags, sent as a single string separated by spaces.
5.	When the form is submitted, the data should be sent in a POST request to POST /wiki, with the data as the body of the request. The data sent should look something like this:

7.	For future reference, check out this gist on using Fetch with different http methods, sending a body, and even using auth tokens!
8.	Finally, re-fetch all the articles, and switch the view to show the list of articles.



##Deleting Page

Finally, we want to  add a delete button that will remove the entry.
1.	Create a button on the single page view (the one with the details on that page)
2.	When the button is clicked, send a DELETE request to DELETE /wiki/:slug. Though we don’t need to send anything in the body of the request, we will need to call fetch a tad differently. This fetch is also not a GET, but a DELETE request. Here’s an example of how to create a DELETE request.

3.	Again, re-fetch all the articles, and switch the view to show the list of articles.
4.	That’s it! Your project is now has the minimum requirements. At this point, you can:
o	View all titles
o	Click to view details on an article/page
o	Add a page via form inputs
o	Delete a page
5.	If you’re done but want to build out your app more, read on! There are still extra credit stretch goals.


##Stretch Goals (Optional)
Here is a list of OPTIONAL stretch goals, if you have extra time!
•	Ability to update article
•	Ability to create new user
•	Single author view, with list of articles by the author
•	View for multiple authors, with link to the single author
•	Searching/filtering articles
•	CSS Styling



# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` &
