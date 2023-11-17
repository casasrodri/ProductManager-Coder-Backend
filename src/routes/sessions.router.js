import { Router } from '../services/errors/customRouter.js';
import passport from 'passport';
import { sessionController } from '../controllers/index.js';

const router = Router();

router.post(
    '/signup',
    passport.authenticate('localSignup', {
        failureRedirect: '/api/sessions/failRegister',
        failureMessage: true,
    }),

    sessionController.localSignUp
);

router.get('/failRegister', sessionController.localFailRegister);

router.post(
    '/localLogin',
    passport.authenticate('localLogin', {
        failureRedirect: '/api/sessions/failLogin',
        failureMessage: true,
    }),
    sessionController.localLogIn
);

router.get('/failLogin', sessionController.localFailLogin);

router.post('/logout', sessionController.logout);

router.get(
    '/githubLogin',
    passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
    '/githubcallback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    sessionController.githubCallback
);

router.post('/login', sessionController.login);

router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    sessionController.current
);

export default router;
