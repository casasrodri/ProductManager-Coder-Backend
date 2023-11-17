const errorTypes = {
    ROUTING: 'ROUTING',
    INVALID_TYPES: 'INVALID_TYPES',
    DATABASE: 'DATABASE',
};

class CustomError extends Error {
    constructor({ name, message, cause, type, statusCode = 500 }) {
        super(message);
        this.name = name;
        this.type = type;
        this.cause = cause;
        this.custom = true;
        this.statusCode = statusCode;
    }
}

export { CustomError, errorTypes };
