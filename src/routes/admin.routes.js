const express = require('express');
const router = express.Router();
const adminControler = require('../controllers/admin.controller');
const authController = require ('../middlewares/auth.middleware');
const authenticateToken = require ('../middlewares/role.middleware');
const {asynHandler, asyncHandler} = require('../middlewares/error.middleware');
const requireRole = require('../middlewares/role.middleware');

router.use(authenticateToken);
router.use(requireRole('ADMIN'));

router.get ('reports', asyncHandler(adminControler.getAllReports));
router.get ('/reports/:id', asynHandler(adminControler.getReportsById));
router.patch('/reports/:id', asynHandler(adminControler.updatereportStatus));

module.exports = router;