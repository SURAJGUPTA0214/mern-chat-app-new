
const express = require('express');
const { accessChat, createGroupChat, fetchChats } = require('../controller/chatControllers');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChats);
router.route('/groupchat').post(protect, createGroupChat);
// router.route('/rename').put(protect, renameGroupChat);
// router.route('/groupremove').put(protect, removeFromGroupChat);
// router.route('/groupadd').post(protect, addToGroupChat);








module.exports = router;