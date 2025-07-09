const express = require('express');
const db = require('../firebaseConfig');

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const snapshot = await db.collection('tracks').get();
        const tracks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.status(200).json(tracks);
    } catch (err) {
        console.error("Error in fetching tracks: ", err);
        res.status(500).json({
            error: "Failed to fetch tracks",
        });
    }
});

module.exports = router;