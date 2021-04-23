/**
 * Dependencies
 */
const fs = require('fs');
const path = require('path');
const express = require('express');

/**
 * Init Express
 */
const app = express();
const PORT = process.env.PORT || 8080;

/**
 * Sets up the Express app to handle data parsing
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * Serve static files from these directory
 */
app.use(express.static('public'));
app.use(express.static('db'));

/**
 * Routes and responses used by Express
 */
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, "./public/notes.html")));
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    let notes = JSON.parse(data);
    res.json(notes);
  });
});
app.post('/api/notes', (req, res) => {
    const note = req.body;
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        let notes = JSON.parse(data);
        note.id = getRandom(1000);
        notes.push(note);
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
                throw err;
            }
            console.log(`Successfully saved id:${note.id}`);
            res.json(notes);
        });
    });
});
app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        let notes = JSON.parse(data);
        notes = notes.filter((note) => note.id !== id);
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
                throw err;
            }
            console.log(`Successfully deleted id:${id}`);
            res.json(notes);
        });
    });
});
app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        let notes = JSON.parse(data);
        notes = notes.filter((note) => note.id === id);
        res.json(notes);
    });
});

/**
 * Get random integer between 0 - input
 * @param {Number} input - upper limit for random
 * @return {Number} random int
 */
const getRandom = (input) => {
    return Math.floor(Math.random() * input);
}

/**
 * Start the server and begin listening
 */
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
