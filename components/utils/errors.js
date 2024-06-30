export class AlreadyExistsError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError"
    }
}

export class ServiceUnavailable extends Error {
    constructor(message) {
        super(message)
        this.name = "ServiceUnavailable"
    }
}

export class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = "NotFoundError"
    }
}

export class CollegeNotFoundError extends NotFoundError {
    constructor(message) {
        super(message)
        this.name = "CollegeNotFoundError"
    }
}

export class NotLoggedInError extends Error {
    constructor(message) {
        super(message)
        this.name = "NotLoggedInError"
    }
}

export class InputError extends Error {
    constructor(message) {
        super(message)
        this.name = "InputError"
    }
}