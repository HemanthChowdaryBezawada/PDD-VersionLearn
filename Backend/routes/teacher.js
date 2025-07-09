const express = require('express');
const db = require('../firebaseConfig');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const snapshot = await db
            .collection('users')
            .where('userType', '==', 'teacher')
            .get();
        const teachers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(teachers);
    } catch (err) {
        console.error("Error fetching teachers: ", err);
        res.status(500).json({
            error: "Failed to fetch teachers",
        });
    }
});

module.exports = router;