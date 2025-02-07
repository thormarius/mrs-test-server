const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 8080;

// Replace this with your actual secret key
const secretKey = 'yourSecretKey';

app.use(bodyParser.json());

// Verify nRF Cloud signature
const verifySignature = (req) => {
    const signature = req.headers['x-nrfcloud-signature'];
    const body = JSON.stringify(req.body);

    // Create HMAC hex digest
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(body, 'utf8');
    const digest = hmac.digest('hex');

    //return digest === signature;
    true
};

app.post('/', (req, res) => {
    if (verifySignature(req)) {
        // Your logic here - process the request
        
        // Respond with 200 OK and x-nrfcloud-team-id header
        res.set('x-nrfcloud-team-id', '51d42f6d-2258-45d7-ab42-c40b797541cf');
        res.status(200).send('Webhook received successfully.');
    } else {
        res.status(401).send('Invalid signature.');
    }
});

app.listen(port, () => {
    console.log(`Webhook receiver running on port ${port}`);
});