const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const path = require('path');
var clickurl="https://romv.de/verteiler"
const app = express();
const port = process.env.PORT || 3000;

// VAPID-Schlüssel einfügen
const publicVapidKey = 'BCm1tKjCO0dTBHsc4Hrcxh_ZY5oszla0Ekmoqyrev2A8ZI1RQXC_ZvOozooVeW5HUlYtBGuBrzaqSl5rP2dhL_s';
const privateVapidKey = 'ogRd6oA-6iiVasg6nSbPPDTYk810QG3ivRMm6ImUc4s';

webpush.setVapidDetails('mailto:example@example.com', publicVapidKey, privateVapidKey);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-Memory-Speicherung der Abonnements
let subscriptions = [];

// Route für das Abonnieren
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
    
    const payload = JSON.stringify({
        title: 'Erfolgreich abonniert!',
        body: 'Du wirst nun Benachrichtigungen erhalten.',
        url: clickurl // Füge die URL hinzu
    });
    webpush.sendNotification(subscription, payload).catch(error => console.error(error));
});

// Route für das Abmelden
app.post('/unsubscribe', (req, res) => {
    const subscription = req.body;
    subscriptions = subscriptions.filter(sub => sub.endpoint !== subscription.endpoint);
    res.status(200).json({});
  
    console.log('Abonnement entfernt:', subscription.endpoint);
});

// Route zum Senden von Benachrichtigungen
app.post('/sendNotification', (req, res) => {
    
    const { subscription, message } = req.body;
    const payload = JSON.stringify({
        title: 'Benachrichtigung Mathe',
        body: message,
        url: clickurl // Füge die URL hinzu
    });
    webpush.sendNotification(subscription, payload).catch(error => console.error(error));
    res.status(200).json({});
});

app.listen(port, () => console.log(`Server läuft auf Port ${port}`));
