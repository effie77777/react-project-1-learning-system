const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {registrationVal, loginVal} = require("../validation");
const User = require("../models").userModel;

//middlewares
router.use((req, res, next) => {
    console.log("inside auth-route middleware");
    next();
})

router.get("/testAPI", (req, res) => {
    return res.send("test API");
})

router.post("/register", async(req, res) => {
    let { name, email, password, role } = req.body;
    User.findOne({ email: req.body.email })
    .then((foundUser) => {
        if (foundUser) {
            return res.status(400).send("這個 email 已經被註冊過囉 ! 請換一個 email 或改至登入頁面");
        } else {
            let result = registrationVal(req.body); //如果有通過 Joi 的檢驗，result 會是 undefined
            if (result && result.error) { //沒有通過 Joi 的檢驗(不包含我們自訂的密碼檢驗規則)，typeof result 是 object
                return res.status(400).send(result.value.error.details[0].message);
            } else if (typeof result === "string") { //有通過 Joi 的檢驗，但密碼不符合我們自訂的規則，typeof result 是 string
                return res.status(400).send(result);
            }
            let newUser = new User({ name, email, password, role });
            newUser.save()
            .then(() => {
                return res.send("註冊成功 !");
            })
            .catch((e) => {
                console.log(e);
                return res.status(400).send("對不起，出了一些問題，請稍後再試");
            })
        }    
    })
    .catch((e) => {
        console.log(e);
        return res.status(400).send("對不起，出了一些問題，請稍後再試");
    })
})

router.post("/login", async(req, res) => {
    let result = loginVal(req.body);
    if (result.error) {
        return res.status(400).send(result.value.error.details[0].message);
    }
    try {
        let foundUser = await User.findOne({ email: req.body.email });
        if (!foundUser) {
            return res.status(400).send("帳號或密碼錯誤");
        }
        foundUser.comparePassword(req.body.password, (err, isMatch) => { //(err, isMatch)對應到定義在user-model裡面的cb
            if (err) { //如果定義在user-model裡面的muddleware回傳過來的是err
                return res.status(400).send("出現了一些問題...");
            } else if (!isMatch) {
                return res.status(400).send("帳號或密碼錯誤");
            } else {
                //製作token
                const tokenObj = {_id: foundUser._id, email: foundUser.email};
                const sentTokenObj = jwt.sign(tokenObj, process.env.PASSPORT_SECRET);
                return res.send({ msg: "成功發送token", token: `JWT ${sentTokenObj}`, data: foundUser });             
            }
        })
    } catch (e) {
        return res.status(400).send("出了一些問題...");
    }
})

module.exports = router;