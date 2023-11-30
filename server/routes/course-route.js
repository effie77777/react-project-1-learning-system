const express = require("express");
const router = express.Router();
const Course = require("../models").courseModel;
const Journey = require("../models").journeyModel;
const courseVal = require("../validation").courseVal;
const journeyVal = require("../validation").journeyVal;

//學員查詢全部課程
router.get("/search", (req, res) => {
    Course.find({ }).populate("instructor", ["name", "email"])
    .then((d) => {
        return res.send(d);
    })
    .catch((e) => {
        console.log(e);
        return res.status(400).send(e);
    })
})

//學員透過特定課程的名稱，查詢該課程
router.get("/searchByTitle/:title", async(req, res) => {
    let { title } = req.params;
    await Course.find({ title }).populate("instructor", ["name", "email"])
    .then((d) => {
        return res.send(d);
    })
    .catch((e) => {
        return res.status(400).send(e);
    })
})

//學員透過特定課程的 id，查詢該課程
router.get("/searchById/:_id", async(req, res) => {
    let { _id } = req.params;
    await Course.findOne({ _id }).populate("instructor", ["name", "email"])
    .then((d) => {
        return res.send(d);
    })
    .catch((e) => {
        return res.status(400).send(e);
    })
})

//學員透過課程 id 來註冊課程
router.post("/enroll/:courseId", async(req, res) => {
    let { courseId } = req.params;
    let { studentId } = req.body;
    await Course.findOne({ _id: courseId }).populate("instructor", ["name", "email"])
    .then((foundCourse) => {
        if (!foundCourse) {
            return res.send("查無此課程");
        } else {
            let result = foundCourse.students.filter((i) => {
                return (i === studentId);
            })
            if (result.length > 0) {
                return res.status(400).send("你已經註冊過這門課程囉 !");
            } else {
                foundCourse.students.push(studentId);
                try {
                    foundCourse.save();
                    return res.send(foundCourse);
                } catch (e) {
                    console.log(e);
                    return res.status(400).send("發生一些錯誤...");
                }
            }
        }
    })
    .catch((e) => {
        console.log(e);
        return res.status(400).send("發生一些錯誤...");
    })
})

//學員查詢所有自己註冊的課程
router.get("/search/student/:_id", async(req, res) => {
    let { _id } = req.params;
    await Course.find({ students: _id }).populate("instructor", ["name", "email"])
    .then((d) => {
        return res.send(d);
    })
    .catch((e) => {
        console.log(e);
        return res.status(400).send(e);
    })
})

//學員新增或移除我的最愛課程
router.post("/favorite/:studentId", async(req, res) => {
    let { studentId } = req.params;
    let { courseId } = req.body;
    try {
        let foundCourse = await Course.findOne({ _id: courseId });
        if (!foundCourse) {
            return res.status(400).send("查無此課程");
        } else {
            let result = foundCourse.marked.filter((i) => i === studentId);
            if (result.length === 0 ) { //代表該課程目前不在我的最愛，所以要將該課程加進去
                foundCourse.marked.push(studentId);
                foundCourse.save()
                .then((d) => {
                    return res.send(d);
                })
                .catch((e) => {
                    console.log(e);
                    return res.status(400).send(e);
                })
            } else {
                foundCourse.marked.forEach((i, index) => {
                    if (i === studentId) {
                        let newArr = [...foundCourse.marked];
                        newArr.splice(index, 1);
                        Course.findOneAndUpdate({ _id: foundCourse._id }, { marked: newArr }, { new: true, runValidators: true })
                        .then((d) => {
                            return res.send(d);
                        })
                        .catch((e) => {
                            console.log(e);
                            return res.status(400).send(e);
                        })
                    }
                })
            }
        }
    } catch (e) {
        console.log(e);
        return res.status(400).send("出了一些問題...");
    }
})

//學員查詢所有自己收藏的課程
router.get("/favorite/:studentId", async(req, res) => {
    let { studentId } = req.params;
    await Course.find({ marked: studentId }).populate("instructor", ["name", "email"])
    .then((d) => {
        return res.send(d);
    })
    .catch((e) => {
        console.log(e);
        return res.status(400).send(e);
    })
})

//學員新增學習日誌
router.post("/postJourney/:studentId", (req, res) => {
    let { studentId } = req.params;
    let { journeyTitle, journeyContent, selectCourse } = req.body;
    if (!req.user.isStudent()) {
        return res.status(401).send("只有學員能夠新增學習日誌");
    }
    let result = journeyVal({ journeyTitle, journeyContent });
    if (result.error) {
        return res.status(400).send(result.value.error.details[0].message);
    }
    let courseId;
    let instructor;
    if (selectCourse) {
        courseId = selectCourse.substring(0, selectCourse.indexOf(" "));
        instructor = selectCourse.substring(selectCourse.indexOf(" ") + 1, selectCourse.length);
    } else {
        courseId = null;
        instructor = null;
    }
    let newJourney= new Journey({ journeyTitle, journeyContent, courseId, instructor, owner: studentId });
    newJourney.save()
    .then((d) => {
        return res.send(d);
    })
    .catch((e) => {
        console.log(e);
        return res.status(400).send(e);
    })
})

//學員搜尋自己建立的所有學習日誌
router.get("/journey/:studentId", async(req, res) => {
    let { studentId } = req.params;
    await Journey.find({ owner: studentId })
    .then((d) => {
        return res.send(d);
    })
    .catch((e) => {
        console.log(e);
        return res.status(400).send(e);
    })

})

//講師查詢所有自己開設的課程
router.get("/search/instructor/:_id", async(req, res) => {
    let { _id } = req.params;
    await Course.find({ instructor: _id }).populate("instructor", ["name", "email"])
    .then((d) => {
        return res.send(d);
    })
    .catch((e) => {
        console.log(e);
        return res.status(400).send("發生一些問題...");
    })
})

//講師新增課程
router.post("/post", async(req, res) => {
    let { title, description, chapters, price } = req.body;
    if (!req.user.isInstructor()) {
        return res.status(401).send("只有講師能夠新增課程");
    }
    let result = courseVal(req.body);
    if (result.error) {
        return res.status(400).send(result.value.error.details[0].message);
    } else if (result === "「課程章節介紹」請至少填寫一項") {
        return res.status(400).send("「課程章節介紹」請至少填寫一項");
    } else {
        let newCourse = new Course({ title, description, chapters, price, instructor: req.user._id });
        try {
            await newCourse.save();
            return res.send("成功新增課程 !");
        }
        catch (e) {
            return res.status(400).send("發生一些錯誤... 課程尚未新增成功");
        }
    }
})

//講師修改課程
router.get("/edit/:_id", async(req, res) => {
    let { _id } = req.params;
    try {
        let foundCourse = await Course.findOne({ _id });
        if (!foundCourse) {
            return res.status(400).send("查無此課程");
        }
        if (foundCourse.instructor._id.equals(req.user._id)) {
            return res.send(foundCourse);
        } else {
            return res.status(401).send("只有這門課程的講師能夠進行編輯哦 !");
        }       
    } catch (e) {
        return res.status(400).send("對不起，出了一些問題，請稍後再試");
    }
})

router.post("/edit/:_id", async(req, res) => {
    let { _id } = req.params;
    try {
        let foundCourse = await Course.findOne({ _id });
        if (!foundCourse) {
            return res.status(400).send("查無此課程");
        }
        if (foundCourse.instructor._id.equals(req.user._id)) {
            let result = courseVal(req.body);
            if (result.error) {
                return res.status(400).send(result.value.error.details[0].message);
            } else if (result === "「課程章節介紹」請至少填寫一項") {
                return res.status(400).send("「課程章節介紹」請至少填寫一項");
            } else {        
                Course.findOneAndUpdate({ _id }, req.body, { new: true, runValidators: true } )
                .then((d) => {
                    return res.send(d);
                })
                .catch((e) => {
                    console.log(e);
                    return res.status(400).send("對不起，發生一些錯誤，請稍後再試...");
                })
            }
        } else {
            return res.status(401).send("只有這門課程的講師能夠進行修改");
        }
    } catch (e) {
        console.log(e);
        return res.status(400).send("對不起，發生一些錯誤，請稍後再試...");
    }
})

//講師搜尋所有學生給自己的回饋
router.get("/instructor/feedback/:_id", async(req, res) => {
    let { _id } = req.params;
    if (!req.user.isInstructor()) {
        return res.status(401).send("只有講師能查詢學員回饋");
    }
    await Journey.find({ instructor: _id }).populate("owner", ["name"])
    .then((d) => {
        return res.send(d);
    })
    .catch((e) => {
        console.log(e);
        return res.status(400).send(e);
    })
})

module.exports = router;