import { COLORS, color } from '../helpers/colors.js';

function coloredMethod(method) {
    switch (method) {
        case 'GET':
            return color(method, COLORS.green);
        case 'POST':
            return color(method, COLORS.blue);
        case 'PUT':
            return color(method, COLORS.magenta);
        case 'DELETE':
            return color(method, COLORS.red);
        default:
            return color(method, COLORS.black);
    }
}

export default (options = {}) => {
    return (req, res, next) => {
        let ip = '';
        const originalSend = res.send;
        let responseLogged = false;
        const originalRedirect = res.redirect;
        let redirectLogged = false;

        const time = new Date().toTimeString().split(' ')[0];
        if (options.ip) ip = `(ip: ${req.socket.remoteAddress})`;

        let method = req.method;
        if (options.color ?? true) method = coloredMethod(method);

        const url = req.originalUrl;

        // Override the send function
        res.send = function (body) {
            if (!responseLogged) {
                console.log(time, res.statusCode, method, url, ip);

                if (Object.keys(req.body).length != 0) {
                    if (options.body) {
                        console.log('', '(body):', req.body);
                    }
                }

                responseLogged = true;
            }
            originalSend.call(this, body);
        };

        // Override the redirect function
        res.redirect = function (path) {
            if (!redirectLogged) {
                console.log(time, res.statusCode, method, url, ip);

                if (Object.keys(req.body).length != 0) {
                    if (options.body) {
                        console.log('', '(body):', req.body);
                    }
                }
                redirectLogged = true;
            }
            originalRedirect.call(this, path);
        };

        next();
    };
};
