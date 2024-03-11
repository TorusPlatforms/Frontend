export class AlreadyExistsError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError"
    }
}