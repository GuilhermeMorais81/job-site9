const Result = require("./shared/Result.js");
const User = require("./models/User.js");

class UserValidator {
    isValidEmail(email) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(email.trim());
    }

    isValidName(name) {
        return name.length > 2 && name.length <= 50;  
    }

    isValidPassword(password) {
        return password >= 6 && password <= 30;
    }
}
