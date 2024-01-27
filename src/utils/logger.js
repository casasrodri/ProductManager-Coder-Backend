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

const customColors = {
    fatal: 'red',
    error: 'yellow',
    warning: 'magenta',
    info: 'blue',
    http: 'cyan',
    debug: 'green',
};

winston.addColors(customColors);

switch (process.env.ENVIRONMENT) {
    case 'development':
        envTransports = [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
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
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            })
        ]
        break;
}

export default winston.createLogger({
    transports: envTransports,
    levels: customLevels,
});


