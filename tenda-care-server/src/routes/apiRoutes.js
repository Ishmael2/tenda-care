// src/routes/apiRoutes.js
import express from 'express';
import { logInteraction } from '../controllers/interactionController.js';
import { validateInteraction } from '../middlewares/validateData.js';

const router = express.Router();

// Define the POST endpoint with the middleware and controller
router.post('/interaction', validateInteraction, logInteraction);

export default router;