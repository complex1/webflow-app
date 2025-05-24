import express from 'express';
import { landingController } from '../controllers/landing.controller';

const router = express.Router();

// Landing page route
router.get('/', landingController.renderLandingPage);

export default router;
