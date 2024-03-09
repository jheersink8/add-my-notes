// Import Express.js, define port number, and Node.js package to 'path
const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));

// Middleware methods:
app.use(express.static('public'));

// -------------ROUTING DEFINITIONS------------- //
// Routing to notes folder
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);
// Wildcard route 
app.get('*', (req, res) => { res.status(404).send('404: Page Not Found') });