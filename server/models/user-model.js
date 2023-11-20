const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 100
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 1024
    },
    date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ["學員", "講師"]
    }
})

userSchema.methods.isStudent = function() {
    return (this.role === "學員");
}
userSchema.methods.isInstructor = function() {
    return (this.role === "講師");
}
userSchema.methods.isAdmin = function() {
    return (this.role === "管理員");
}

//把密碼存進db前要先經過hash
userSchema.pre("save", function(next) {
    console.log("密碼有無修改? " + this.isModified("password"));
    console.log("是否為剛註冊的使用者? " + this.isNew);
    if (this.isModified("password") || this.isNew) {
        bcrypt.hash(this.password, 10, (err, hashed) => {
            if (err) {
                return (err);
            }
            this.password = hashed;
            next();
        })
    }
})

//password是我們自己設定傳入的參數。cb整個代表bcrypt本身規定的(err, result)
userSchema.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, result) => {
        if (err) {
            return cb(err);
        }
        if (result) {
            console.log("correct password");
        } else {
            console.log("incorrect password");
        }
        cb(null, result); //只要沒有err則一律執行，不論result為true或false
    })
}

const User = mongoose.model("User", userSchema);
module.exports = User;