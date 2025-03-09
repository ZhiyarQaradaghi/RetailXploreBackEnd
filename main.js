const express = require('express');
const app = express();
const port = 3003;

const cors = require('cors');
app.use(cors());


app.listen(port, () => {
    console.log(`This application is listening on port ${port}`);
})