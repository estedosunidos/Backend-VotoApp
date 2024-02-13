"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const serviceAccount = require("../src/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});
const db = admin.firestore();
// Start writing functions
// https://firebase.google.com/docs/functions/typescript
//Express
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.get('/gotty', async (req, res) => {
    const gottyRef = db.collection('goty');
    try {
        const docSnap = await gottyRef.get();
        const juego = docSnap.docs.map(doc => doc.data()); // Corregir aquí
        console.log(juego);
        res.json(juego);
    }
    catch (error) {
        console.error('Error al obtener datos de Firestore:', error);
        res.status(500).json({ error: 'Error al obtener datos de Firestore' });
    }
});
app.post('/gotty/:id', async (req, res) => {
    const id = req.params.id;
    const gameRef = db.collection('goty').doc(id);
    const gameSanp = await gameRef.get();
    if (!gameSanp.exists) {
        return res.status(404).json({
            message: "No se encontró el juego"
        });
    }
    else {
        const game = gameSanp.data() || { votos: 0 };
        await gameRef.update({
            voto0: game.voto0 + 1
        });
    }
    return res.status(200).json({
        ok: true,
        mesaje: 'Gracia por tu votos del juego del año '
    });
});
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map