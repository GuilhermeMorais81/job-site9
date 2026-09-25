class User {
    constructor(id, name, email, passwordHash, isCompany) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.isCompany = isCompany;
    }

    isCompany() {
        return this.isCompany === 0;
    }
}