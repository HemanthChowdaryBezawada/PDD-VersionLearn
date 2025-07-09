const express = require('express');
const db = require('../firebaseConfig');

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        const snapshot = await db.collection('users').get();
        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.status(200).json(users);
    } catch (err) {
        console.error("Error in fetching users: ",err);
        res.status(500).json({
            error: "Failed to fetch the users",
        });
    }
});

router.get("/chats/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const snapshot = await db
            .collection('chats')
            .where('participants', 'array-contains', userId)
            .orderBy('lastMessageTime', 'desc')
            .get();
        const chats = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.status(200).json(chats);
    } catch (err) {
        console.error("Error in fetching chats: ", err);
        res.status(500).json({
            error: "Failed to fetch chats",
        });
    } 
});

router.get("/messages/:chatId", async (req, res) => {
    const { chatId } = req.params;
    
    try {
        const messagesSnapshot = await db
            .collection('chats')
            .doc(chatId)
            .collection('messages')
            .orderBy('timestamp', 'asc')
            .get();
        const messages = messagesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.status(200).json(messages);
    } catch (err) {
        console.error("Error fetching messages: ", err);
        res.status(500).json({
            error: "Failed to fetch messages",
        });
    }
});

router.post('/messages/:chatId', async (req, res) => {
    const { chatId } = req.params;
    const { senderId, text } = req.body;

    try {
        const messageRef = db
            .collection('chats')
            .doc(chatId)
            .collection('messages');
        
        await messageRef.add({
            senderId,
            text,
            timestamp: new Date(),
        });

        await db.collection('chats').doc(chatId).update({
            lastMessage: text,
            lastMessageTimestamp: new Date(),
        });

        res.status(200).json({
            message: "Message sent",
        });
    } catch (err) {
        console.error("Error in sending message: ", err);
        res.status(500).json({
            message: "Failed to send message",
        });
    }
});

router.post('/chats', async (req, res) => {
    const { participants } = req.body;

    try {
        const existingChats = await db
            .collection('chats')
            .where('participants', 'in', [participants])
            .get();
        
        if (!existingChats.empty) {
            return res.status(200).json({
                message: 'chat already exists',
                chatId: existingChats.docs[0].id,
            });
        }

        const newChatRef = await db.collection('chats').add({
            participants,
            lastMessage: '',
            lastMessageTimestamp: new Date(),
        });

        res.status(201).json({
            message: 'chat created',
            chatId: newChatRef.id,
        });
    } catch (err) {
        console.error("Error in creating chat: ", error);
        res.status(500).json({
            error: 'Failed to create chat',
        });
    }
});

router.get('/users/:currentUserId', async (req, res) => {
    try {
        const { currentUserId } = req.params;

        const snapshot = await db.collection('users').get();

        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(user => user.id !== currentUserId);

        res.status(200).json(users);
    } catch (err) {
        console.error("Error in fetching users: ", err);
        res.status(500).json({
            error: "Failed to fetch users",
        });
    }
});

module.exports = router;