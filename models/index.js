const mongoose = require("../utils/mongoose");

module.exports = {
    User: mongoose.model('User', {
        name: String,
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, "Email is required."],
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Specified email address is not valid."]
        },
        password: String
    }),
    Todo: mongoose.model('Todo', {
        user: mongoose.Types.ObjectId,
        todo: String
    })
}