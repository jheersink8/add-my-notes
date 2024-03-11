// Import Express.js and Node.js package to 'path
const express = require('express');
const path = require('path');

// Bring node.js FS module into script and uuid
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Define port number
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware methods:
app.use(express.json());
app.use(express.static('public'));

// Import db.json
const dbData = require('./db/db.json');
const { json } = require('body-parser');


// -------------GET ROUTING DEFINITIONS------------- //
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
// Routing to notes folder
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html')));

// Get route to all notes in db.json (including newly added)
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        const parsedNotes = JSON.parse(data);
        res.json(parsedNotes);
    });
});

// Get route to specific note in db.json (not 100% necessary now, but maybe for future development)
app.get('/api/notes/:id', (req, res) => {
    const requestedId = req.params.id
    for (let i = 0; i < dbData.length; i++) {
        if (requestedId === dbData[i].id) {
            return res.json(dbData[i])
        }
    }
    return res.json('No match found');
});

// -------------POST ROUTING DEFINITIONS------------- //
// Write new note data to db.json file
app.post('/api/notes', (req, res) => {
    // Verify user input exists
    const { title, text } = req.body
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        }
        // Read json file
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNote = JSON.parse(data);
                parsedNote.push(newNote);
                // Write new notes to json file
                fs.writeFile('./db/db.json', JSON.stringify(parsedNote, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info(`Successfully created new note with title ${newNote.title}!`));
            }
        });
        // Read new/updated json file to output to client
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            const parsedNotes = JSON.parse(data);
            res.json(parsedNotes);
        });
    }
});

// -------------DELETE ROUTING DEFINITIONS------------- //
app.delete('/api/notes/:id', (req, res) => {
    // Read json file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        // Delete targeted note
        const jsonData = JSON.parse(data);
        const requestedId = req.params.id;
        for (let i = 0; i < jsonData.length; i++) {
            if (requestedId === jsonData[i].id) {
                jsonData.splice(i, 1);
            }
        }
        // Write to db.json file 
        fs.writeFile('./db/db.json', JSON.stringify(jsonData, null, 4),
            (err) =>
                err
                    ? console.error(err)
                    : console.info(`Successfully deleted note`));
    })
    // Read and responde with newest json file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        const parsedNotes = JSON.parse(data);
        res.json(parsedNotes);
    })
});

// Wildcard route 
app.get('*', (req, res) => { res.status(404).send('404: Page Not Found') });

// Listen for connection
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));