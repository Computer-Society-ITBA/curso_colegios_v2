const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const CHATBOT_URL = 'https://curso-colegios.uc.r.appspot.com/api';

app.use(express.json());
app.use(cors());

app.post('/chat', async (req, res) => {
    const { ID, personality, message } = req.body;
    try {
        const response = await axios.post(`${CHATBOT_URL}/chatbot`, {
            ID,
            personality,
            message
        }, {
            responseType: 'arraybuffer'
        });
        //casting a str
        const stringResponse = Buffer.from(response.data).toString('utf-8');
        const jsonResponse = JSON.parse(stringResponse);
        if (jsonResponse.hasOwnProperty('contentType') && jsonResponse.contentType === 'TEXT') {
            //texto o markdown
            res.json({
                responseType: 'TEXT',
                content: jsonResponse.content
            });
        } else if (jsonResponse.hasOwnProperty('responseType') && jsonResponse.responseType === 'IMAGE') {
            //url
            if(typeof jsonResponse.body === 'string' && jsonResponse.body.startsWith('http')){
                res.json({
                    responseType: 'IMAGE',
                    content: jsonResponse.body
                });
            } else {
            //base64
                const imageBase64 = Buffer.from(jsonResponse.body).toString('base64');
                res.json({
                    responseType: 'IMAGE',
                    content: `data:image/png;base64,${imageBase64}`
                });
            }
        } else {
            //default para que no explote
            res.status(400).json({
                content: 'Unsupported response type',
                responseType: 'TEXT'
            });
        }
    } catch (error) {
        console.error('Error al comunicarse con el chatbot:', error);
        res.status(500).json({ error: 'Error al comunicarse con el chatbot' });
    }
});

app.post('/text-to-speech', async (req, res) => {
    //audio
    const { ID, personality, message } = req.body;
    try {
        const response = await axios.post(`${CHATBOT_URL}/text-to-speech`, {
            ID,
            personality,
            message
        }, {
            responseType: 'arraybuffer'
        });
        const audioData64 = Buffer.from(response.data).toString('base64');
        const audioDataUri = `data:audio/ogg;base64,${audioData64}`;

        res.json({
            responseType: 'AUDIO',
            content: audioDataUri
        });
    } catch (error) {
        console.error('Error communicating with the text-to-speech service:', error);
        res.status(500).json({ error: 'Error communicating with the text-to-speech service' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
