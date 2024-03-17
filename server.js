// server.js
const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.get('/weather/:zip', async (req, res) => {
    const { zip } = req.params;
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${zip}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Ошибка при запросе к OpenWeatherMap API:', error);
        res.status(500).json({ error: 'Ошибка при запросе к OpenWeatherMap API' });
    }
});

app.listen(3001, () => {
    console.log('Сервер запущен на порту 3001');
});
