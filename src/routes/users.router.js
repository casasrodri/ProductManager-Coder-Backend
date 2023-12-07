import { Router } from '../services/errors/customRouter.js';
import { userController } from '../controllers/index.js';

const router = Router();

router.get('/premium/:uid', userController.premiumSwith);

export default router;
