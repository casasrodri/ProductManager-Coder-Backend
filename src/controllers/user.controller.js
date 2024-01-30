import { userRepository } from '../repositories/index.js';
import UserDTO from '../dto/user.dto.js';
import sendEmail from '../services/emailing.js';
import config from '../config/config.js';

const PREMIUM_REQUIRED_DOCUMENTS = ['identification', 'address', 'accountStatus'];
export default class UserController {

    async getAllUsers(req, res) {
        const users = await userRepository.getAll();
        const usersDTO = users.map((user) => new UserDTO(user));

        res.json({
            status: 'ok',
            message: 'Users listed',
            data: { users: usersDTO },
        });
    }

    async premiumSwitch(req, res) {
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
            const availableDocs = user.documents.map((document) => {
                return document.name
            })

            const missingDocs = PREMIUM_REQUIRED_DOCUMENTS.filter(document => !availableDocs.includes(document));

            if (missingDocs.length > 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Missing documents.',
                    data: { missingDocs },
                });
            }
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

    async cleanInactiveUsers(req, res) {
        const currentDate = new Date();
        const inactivity_threshold = 2 * 24 * 60 * 60 * 1000;  // 2 days in milliseconds
        const dateLimit = new Date(currentDate.getTime() - inactivity_threshold);

        const users = await userRepository.getAll();
        for (const user of users) {
            const no_admin = user.role != 'admin';
            const inactivity = user.last_connection <= dateLimit || user.last_connection == null;

            if (no_admin && inactivity) {

                const msg = `Dear ${user.first_name},
                <br><br>
                Your account has been deleted <u>due to inactivity</u>. If you want to continue using our site, please <a href="${config.host}/signup">register again</a>.
                <br><br>
                Best regards,
                <br>
                <b>The team</b>`;

                sendEmail(user.email, 'Deleted account', msg)
                await userRepository.delete(user._id);
            }
        }

        res.json({ status: 'ok', message: 'Inactive users have been removed.' })
    }

    async deleteUser(req, res) {
        const { uid } = req.params;

        const user = await userRepository.getById(uid);

        if (!user)
            return res.status(401).json({
                status: 'error',
                message: 'User not found.',
                data: { uid },
            });

        await userRepository.delete(uid);

        res.json({ status: 'ok', message: 'User deleted', data: { uid } })
    }
}
