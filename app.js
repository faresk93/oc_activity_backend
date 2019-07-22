const express = require('express');

// bodyParser to make data in request body easily available
const bodyParser = require('body-parser');

// allows extra persistence functionalities on top of MongoDB
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://faresk93:g5nVA5IVsP8LM8ni@cluster0-anf96.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true})
    .then(() => {
        console.log('successfully connected to MongoDB Atlas !');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas !');
        console.error(error);
    });

const app = express();

const Recipe = require('./models/recipe');

module.exports = app;

const route = '/api/recipes';

// add header for CORS handling
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// JSON body parser middleware
app.use(bodyParser.json());

// List Recipes
app.get(route, async (req, res, next) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (e) {
        console.log('Error getting recipes! \n' + e)
    }
});

// Get Recipe
app.get(route + '/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const recipe = await Recipe.findOne({_id: id});
        res.status(200).json(recipe);
    } catch (e) {
        res.status(404).json({
            error: 'Error: ' + e
        })
    }

});

// Create Recipe
app.post(route, async (req, res, next) => {
        const body = req.body;
        const recipe = new Recipe({
            title: body.title,
            ingredients: body.ingredients,
            instructions: body.instructions,
            difficulty: body.difficulty,
            time: body.time
        });
        try {
            await recipe.save();
            res.status(201).json(recipe);
            console.log(recipe)
        } catch (e) {
            res.status(400).json({
                error: 'Error: ' + e
            })
        }
    }
);

// Edit Recipe
app.put(route + '/:id', async (req, res, next) => {
        const id = req.params.id;
        const body = req.body;
        const recipe = new Recipe({
            _id: id,
            title: body.title,
            ingredients: body.ingredients,
            instructions: body.instructions,
            difficulty: body.difficulty,
            time: body.time
        });
        try {
            await Recipe.updateOne({_id: id}, recipe);
            res.status(200).json(recipe);
            console.log(recipe)
        } catch (e) {
            res.status(400).json({
                error: 'Error: ' + e
            })
        }
    }
);


// Delete Recipe
app.delete(route + '/:id', async (req, res, next) => {
        const id = req.params.id;
        try {
            await Recipe.deleteOne({_id: id});
            res.status(204).json({
                message: `Recipe with id: "${id}" deleted!`
            });
            console.log(`Recipe with id: "${id}" deleted!`)
        } catch (e) {
            res.status(400).json({
                error: 'Error: ' + e
            })
        }
    }
);
