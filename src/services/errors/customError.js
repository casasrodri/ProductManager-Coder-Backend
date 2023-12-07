export const errorTypes = {
    ROUTING: 'ROUTING',
    INVALID_TYPES: 'INVALID_TYPES',
    DATABASE: 'DATABASE',
};



export class CustomError extends Error {
    constructor({ name, message, cause, type, statusCode = 500 }) {
        super(message);
        this.name = name;
        this.type = type;
        this.cause = cause;
        this.custom = true;
        this.statusCode = statusCode;
    }
}

// Information about errors

export const getCartErrorInfo = (cartId) => {
    return `Error getting cart by id: ${cartId}
    Cannot be found in the database.`;
}

export const createProductErrorInfo = (product) => {
    return `One or more properties were incomplete or invalid:
    List of required properties:

    - title: (String)
    - description: (String)
    - code: (String)
    - price: (Number)
    - stock: (Number)
    - category: (String)
    - thumbnails: (String)
    - status: (Boolean)

    Received:
    ${JSON.stringify(product)}`;
}
