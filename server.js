// Import db.json
const dbData = require('./db/db.json')

// Import Express.js, define port number, and Node.js package to 'path
const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

// Bring node.js FS module into script 
const fs = require('fs');

// Middleware methods:
app.use(express.static('public'));
app.use(express.json());

// -------------ROUTING DEFINITIONS------------- //
// Routing to notes folder
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html')));

// Write new note data to db.json file
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body
    if (title && text) {
        const newNote = {
            title,
            text
            // Add unique ID here later
        }
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNote = JSON.parse(data);
                  parsedNote.push(newNote);
                fs.writeFile('./db/db.json', JSON.stringify(parsedNote),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated!'));
            }
        });

        const response = { status: 'success', body: newNote };
        console.log(response);
        res.status(201).json(response);

    } else {
        res.status(500).json('Error posting');
    }
});

// Route db.json
app.get('/api/notes', (req, res) => res.json(dbData));

// Wildcard route 
app.get('*', (req, res) => { res.status(404).send('404: Page Not Found') });

// Listen for connection
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));