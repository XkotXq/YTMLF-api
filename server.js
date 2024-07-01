const express = require('express');
const app = express();
const port = 3001;
const { getSong } = require('genius-lyrics-api');

require('dotenv').config()

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.post('/lyrics', async (req, res) => {
    const { title, artist } = req.body;
    if (!title || !artist) {
        return res.status(400).json({ error: 'Both title and artist are required' });
    }
    
    const options = {
        apiKey: process.env.GENIUS_SECRET_KEY,
        title: title,
        artist: artist,
        optimizeQuery: true
    }
    // const lyrics = await getLyrics(options).then((lyrics) => {return lyrics})
    const song = await getSong(options).then((lyrics) => {return lyrics})
    if (song) {
        res.status(201).json({
            lyrics: song.lyrics ? song.lyrics : "brak tekstu",
            title: song.title,
            albumArt: song.albumArt
        });
    } else {
        res.status(404).json({ error: "Song not found" });
    }
    
})

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
