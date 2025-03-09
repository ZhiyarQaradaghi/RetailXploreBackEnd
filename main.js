const express = require('express');
const app = express();
const port = 3003;

const cors = require('cors');
app.use(cors());

// Home
app.get('/', (req, res) => {

});

// Product List
app.get('/', (req, res) => {

});

// Search
app.get('/', (req, res) => {

});

// Shopping List
app.get('/', (req, res) => {

});


app.listen(port, () => {
    console.log(`This application is listening on port ${port}`);
})