// Import Express.js and Node.js package to 'path
const express = require('express');
const path = require('path');
// Bring node.js FS module into script and uuid
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
// Define port number
const PORT = process.env.port || 3000;
const app = express();

// Middleware methods:
app.use(express.json());
// Keep or delete??????
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Import db.json
const dbData = require('./db/db.json')


// -------------ROUTING DEFINITIONS------------- //
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
// Routing to notes folder
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html')));

// Route db.json
app.get('/api/notes', (req, res) => res.json(dbData));


// Write new note data to db.json file
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body
    if (title && text) {
        const newNote = {
            title,
            text,
            noteId: uuidv4()
        }
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNote = JSON.parse(data);
                parsedNote.push(newNote);
                fs.writeFile('./db/db.json', JSON.stringify(parsedNote, null, 4),
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

// Wildcard route 
app.get('*', (req, res) => { res.status(404).send('404: Page Not Found') });

// Listen for connection
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));