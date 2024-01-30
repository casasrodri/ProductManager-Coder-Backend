import { Router } from '../services/errors/customRouter.js';
import { userController } from '../controllers/index.js';
import { documentsUploader } from '../middlewares/multer.js';
import authRole from '../middlewares/authorization.js';

const router = Router();
router.use(authRole(['admin']));

router.get('/', userController.getAllUsers);

router.delete('/', userController.cleanInactiveUsers);

router.delete('/:uid', userController.deleteUser);

router.get('/premium/:uid', userController.premiumSwitch);

router.post(
    '/:uid/documents',
    documentsUploader.any(),
    userController.uploadDocuments
);

export default router;
