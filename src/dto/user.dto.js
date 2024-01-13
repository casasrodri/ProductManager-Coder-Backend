export default class UserDTO {
    constructor({ _id, email, first_name, last_name, role }) {
        this._id = _id;
        this.email = email;
        this.name = `${first_name} ${last_name}`;
        this.role = role;
    }
}
