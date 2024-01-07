import { userRepository } from '../repositories/index.js';
import multer from 'multer';

const PREMIUM_REQUIRED_DOCUMENTS = ['identification', 'address', 'accountStatus'];
export default class UserController {

    async premiumSwith(req, res) {
        const { uid } = req.params;

        const user = await userRepository.getById(uid);

        if (!user)
            return res.status(401).json({
                status: 'error',
                message: 'User not found.',
                data: { uid },
            });

        const oldRole = user.role || 'user';
        const newRole = oldRole === 'user' ? 'premium' : 'user';

        if (newRole === 'premium') {
            // TODO: verificar que ya haya cargado los documentos: PREMIUM_REQUIRED_DOCUMENTS
        }

        user.role = newRole
        user.save();

        res.json({ status: 'ok', message: 'User updated', data: { email: user.email, newRole } })
    }

    async uploadDocuments(req, res) {
        const { uid } = req.params;
        const { files } = req;

        // Filter valid files
        const validFiles = {}

        for (const file of files) {
            if (validFiles[file.fieldname]) {
                return res.status(400).json({
                    status: 'error',
                    message: `Duplicated fieldname: ${file.fieldname}`,
                    data: { fieldname: file.fieldname },
                });
            }

            if (PREMIUM_REQUIRED_DOCUMENTS.includes(file.fieldname)) {
                validFiles[file.fieldname] = file
            }
        }

        // Get user
        const user = await userRepository.getById(uid);

        if (!user)
            return res.status(401).json({
                status: 'error',
                message: 'User not found.',
                data: { uid },
            });

        // Save documents
        user.documents = []
        for (const [documentType, documentProps] of Object.entries(validFiles)) {
            user.documents.push(
                {
                    name: documentType,
                    reference: documentProps.path
                }
            )
        }
        user.save();

        res.json({ status: 'ok', message: 'Documents saved.', data: { documents: Object.keys(validFiles) } })
    }
}
