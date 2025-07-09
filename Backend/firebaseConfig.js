const admin = require('firebase-admin');
const serviceAccount = require('./versionlearn-e22a5-firebase-adminsdk-fbsvc-4ea5c2e39b.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;