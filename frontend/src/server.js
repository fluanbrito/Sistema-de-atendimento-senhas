const express = require('express');
const cors = require('cors');
const ejs = require('ejs');

const env = require('./env');

const app = express();
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', __dirname+'/pages');

app.use(express.static(__dirname+'/pages/style'))

// app.get('/tv', (req, res) => {
//     res.render('tv');
// });

app.get('/ts', (req, res) => {
    res.render('ts');
});

app.get('/tv', (req, res) => {
    res.render('tv02');
});

app.get('/ta', (req, res) => {
    res.render('ta');
});

app.listen(env.server.port, () => {
    console.log({ server: 'Server online' });
});