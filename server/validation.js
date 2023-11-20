const Joi = require("joi");

const registrationVal = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().min(1).max(50),
        email: Joi.string().email().min(5).max(50).required(),
        password: Joi.string().required().min(8).max(1024),
        role: Joi.string().required().valid("學員", "講師")
    });
    let result = schema.validate(data);
    if (result.error) {
        result = translateErrorMsg(result);
        return schema.validate(result);
    } else {
        let errorMsg;
        let num = /\d/;
        let numVal = false;
        for (let i = 0; i < data.password.length; i ++) {
            if (data.password[i].match(num)) {
                numVal = true;
                break;
            }
        }
        if (!numVal) {
            errorMsg = "密碼至少需包含一個數字";
        }
        if (data.password === data.password.toLowerCase()) {
            errorMsg = "密碼至少需包含一個大寫字母";
        }
        let specialChar = "!@#%&_?";
        let specialCharVal = false;
        for (let i = 0; i < data.password.length; i ++) {
            if (specialChar.includes(data.password[i])) {
                specialCharVal = true;
                break;
            }
        } 
        if (!specialCharVal) {
            errorMsg = "密碼至少需包含一個特殊符號";
        }
        //下面這個是檢查有沒有包含規定以外的特殊符號
        let allowed = /[A-Za-z0-9!@#%&_?]/g;
        let regexpResult = data.password.match(allowed);
        if (regexpResult.length !== data.password.length) {
            errorMsg = "請檢查密碼是否包含英文、數字、空格、或!@#%&_?以外的特殊符號"
        }
        return errorMsg;
    }    
}

const loginVal = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().min(3).max(50),
        password: Joi.string().required().min(8).max(1024)
    });
    let result = schema.validate(data);
    result = translateErrorMsg(result);        
    return schema.validate(result);
}

const courseVal = (data) => {    
    const schema = Joi.object({
        title: Joi.string().required().max(18),
        description: Joi.string().required().max(60),
        price: Joi.number().required().min(99).max(5999)
    })
    let result = schema.validate(data);
    result = translateErrorMsg(result);
    return schema.validate(result);
}

const journeyVal = (data) => {
    const schema = Joi.object({
        journeyTitle: Joi.string().required().max(18),
        journeyContent: Joi.string().required().max(100),
    })
    let result = schema.validate(data);
    result = translateErrorMsg(result);
    return schema.validate(result);
}

function translateErrorMsg(result) {
    if (result.error) {
        let errorMsg = "";
        let key = result.error.details[0].context.key;
        let limit = result.error.details[0].context.limit;

        switch (result.error.details[0].context.key) {
            case "title":
                key = "課程名稱";
                break;
            case "description":
                key = "課程簡介";
                break;
            case "price":
                key = "價格";
                break;
            case "name":
                key = "使用者名稱";
                break;
            case "password":
                key = "密碼";
                break;
            case "role":
                key = "身分";
                break;
            case "journeyTitle":
                key = "標題";
                break;
            case "journeyContent":
                key = "內容";
                break;
            case "selectCourse":
                key = "請選擇這門課";    
        }

        switch (result.error.details[0].type) {
            case "any.required": 
            case "string.empty":
                errorMsg = "為必填欄位";
                break;
            case "string.email":
                errorMsg = " 格式錯誤";
                break;
            case "string.max":
                errorMsg = `最多為 ${limit} 個字`;
                break;
            case "string.min":
                errorMsg = `最少為 ${limit} 個字`;
                break;
            case "number.base":
                errorMsg = `必須為數字`;
                break;
            case "number.max":
                errorMsg = `上限為 ${limit}`;
                break;
            case "number.min":
                errorMsg = `下限為 ${limit}`;
                break;                
            case "any.only":
                if (result.error.details[0].context.valids) {
                    let options = result.error.details[0].context.valids;
                    let string = "";
                    options.map((i) => {
                        string = string + `${i}或`;
                    })
                    errorMsg = `必須為${string.slice(0, string.length - 1)}`;
                }
        }
        if (errorMsg === "") { //上述以外的其它種 validation error
            errorMsg = result.error.details[0].message;
        } else {
            errorMsg = key + errorMsg;
        }
        result.error.details[0].message = errorMsg; //回傳原本整個 error 物件，但修改其中 message 的部分
        return result;
    }
}

module.exports = { registrationVal, loginVal, courseVal, journeyVal };