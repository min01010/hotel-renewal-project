const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

// 전체 이미지 조회 
router.get('/get-main-images', mainController.getMainImages);

module.exports = router;