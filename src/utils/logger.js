import winston from "winston";
import { config } from "dotenv";
config();

let envTransports

const customLevels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
};

switch (process.env.ENVIRONMENT) {
    case 'development':
        envTransports = [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.cli(),
            }),
        ]
        break;

    case 'production':
        envTransports = [
            new winston.transports.Console({ level: 'info' }),
            new winston.transports.File({ name: 'errors-file', filename: 'logs/errors.log', level: 'error' }),
        ]
        break;

    case 'testing':
        envTransports = [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.cli(),
            })
        ]
        break;
}

export default winston.createLogger({
    transports: envTransports,
    levels: customLevels,
});


