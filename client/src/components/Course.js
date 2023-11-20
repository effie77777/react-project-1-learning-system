import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import NewCourseService from "../services/course-service";

const Course = ({ currentUser, courseData, setCourseData, setCurrentEdited, myFavorite, setMyFavorite, allCourses }) => {
    const [ errorMsg, setErrorMsg ] = useState(null);
    const [ successMsg, setSuccessMsg ] = useState(null);
    const Navigate = useNavigate();  
    let alert = document.querySelector("#alert-and-btn-div");

    //講師修改課程
    const handleEdit = (e) => {
        e.preventDefault();
        NewCourseService.getAndEditCourse(e.target.id)
        .then((d) => {
            setCurrentEdited(d);
            Navigate("/editCourse");
        })
        .catch((e) => {
            console.log(e);
        })
    }

    // 學生註冊課程
    const handleEnroll = (e) => {
        e.preventDefault();
        let courseId = e.target.id;
        let studentId = currentUser.data._id;
        NewCourseService.enrollCourse(courseId, studentId)
        .then((d) => {
            courseData.push(d.data);
            setCourseData(courseData);
            setSuccessMsg("註冊成功 !");
            allCourses.find((i, index) => {
                if (i._id === courseId) {
                    allCourses.splice(index, 1, d.data);
                }
            });
            myFavorite.find((i) => {
                if (i._id === courseId) {
                    i.students.push(studentId);
                }
            })
            setTimeout(() => {
                setSuccessMsg(null);
            }, 1500);
        })
        .catch((e) => {
            console.log(e.response.data);
        })
    }

    //移除我的最愛
    const removeFromMyFavorite = (e) => {
        e.preventDefault();
        let studentId = currentUser.data._id;
        let courseId = e.target.id;
        NewCourseService.changeFavorite(studentId, courseId)
        .then((d) => {
            setSuccessMsg("成功移除");
            setTimeout(() => {
                setSuccessMsg(null);
            }, 1500);
            myFavorite.forEach((i, index) => {
                if (i._id === courseId) {
                    myFavorite.splice(index, 1);
                    setMyFavorite(myFavorite);
                }
            })
            console.log(d);
        })
        .catch((e) => {
            console.log(e);
        })
    }

    const handleCloseAlert = (e) => {
        e.preventDefault();
        alert.classList.add("d-none");
    }

    //如果使用者沒有透過上面的 event handler 關掉 alert，但是他已經有註冊 / 開設課程的話，那就要移除 alert
    if (errorMsg && courseData.length > 0) {
        alert.classList.add("d-none");
    }

    useEffect(() => {
        if (!currentUser) {
            setErrorMsg("請先進行登入或註冊");
        } else if (currentUser.data.role === "講師") {
            NewCourseService.getCourseList(currentUser.data._id)
            .then((d) => {
                if (d.data.length === 0) {
                    setErrorMsg("目前你還沒有開設任何課程哦 ! 要馬上來開一門課嗎 ?");
                }
                setCourseData(d.data); //有開過課的話，d 為一個 object，其中 d.data 為一個 array，包含該講師開設的課程。沒有開過課的話，d 為空的 array
            })
            .catch((e) => {
                console.log(e);
            })
        } else if (currentUser.data.role === "學員") {
            NewCourseService.getEnrolledCourse(currentUser.data._id)
            .then((d) => {
                setCourseData(d.data);
                if (d.data.length === 0) {
                    setErrorMsg("目前你還沒有註冊任何課程哦 ! 要來看看我們有什麼課程嗎 ?");
                }
            })
            .catch((e) => {
                console.log(e);
            })

            NewCourseService.getMyFavorite(currentUser.data._id)
            .then((d) => {
                setMyFavorite(d.data);
            })
            .catch((e) => {
                console.log(e);
            })    
        }
    }, []);

    return (        
        <div className="py-5">
            <div className="container">
                { errorMsg &&
                    <div className="mb-5" id="alert-and-btn-div">
                        <div className="alert alert-danger mb-4">
                            <p className="mb-0">
                                { errorMsg }
                            </p>
                        </div>
                        { currentUser && currentUser.data.role === "講師" && (
                        <Link className="btn btn-dark fw-bold me-2" to="/postCourse">
                            好哇 ! GO GO
                        </Link>
                        )}
                        { currentUser && currentUser.data.role === "學員" && (
                        <Link className="btn btn-dark fw-bold me-2" to="/search">
                            帶我去探索課程 ! GO GO
                        </Link>
                        )}
                        <button className="btn border-dark fw-bold" onClick={ handleCloseAlert }>
                            下次再提醒我
                        </button>
                    </div>
                }

                { !currentUser && (
                    <div className="mt-5">               
                        <Link className="btn btn-dark fw-bold me-4" to="/login">
                        登入
                        </Link>
                        <Link className="btn border-dark text-dark" to="/register">
                        註冊
                        </Link>
                    </div>
                )}

                { currentUser && courseData.length > 0 && 
                    <section className="pt-0 pb-4">
                        <h3 className="fs-2">我的課程</h3>
                        <div className="row">
                            { courseData.map((i) => (
                            <div className="col-md-6 col-lg-4 card-group">
                                <div className="card border-0 mb-4">
                                    <div className="card-header bg-light-primary d-flex justify-content-between">
                                        <h4>{ i.title }</h4>
                                        { currentUser.data.role === "講師" && (
                                            <a className="btn p-0 ms-2 mt-1" onClick={ handleEdit } id={ i._id }>
                                                <span class="material-symbols-outlined" id={ i._id }>
                                                edit
                                                </span>
                                            </a>
                                        )}
                                    </div>
                                    <div className="card-body bg-light-primary">
                                        <p><strong>講師:</strong> { i.instructor.name }</p>
                                        <p><strong>課程簡介:</strong> { i.description }</p>
                                        <p><strong>價格:</strong> { i.price }</p>
                                        <p><strong>學生人數:</strong> { i.students.length }</p>
                                    </div>
                                    <div className="card-footer bg-light-primary hover-bg-primary">
                                        { currentUser.data.role === "講師" &&
                                            <Link className="btn" id={ i._id } to="/profile">
                                            查看學員回饋
                                            </Link>
                                        }
                                        { currentUser.data.role === "學員" &&
                                            <a href="#" className="btn" id={ i._id }>
                                                上課去 !
                                            </a>
                                        }
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    </section>
                }

                { currentUser && currentUser.data.role === "學員" && myFavorite.length > 0 && (
                    <section className="bg-warning bg-opacity-25 mb-0">
                        <div className="d-flex">    
                            <h3 className="fs-2">我的最愛</h3>
                                { successMsg && (
                                    <div className="alert alert-danger msg">
                                        <span class="material-symbols-outlined fs-4">
                                            check_circle
                                        </span>
                                        <p>{ successMsg }</p>
                                    </div>
                                )}
                        </div>

                        <div className="row flex-nowrap overflow-auto">
                            { myFavorite.map((i) => (
                                <div className="col-md-6 col-lg-4 card-group">
                                    <div className="card border-0">
                                        <div className="card-header d-flex align-items-start">
                                            <h4>{ i.title }</h4>
                                            <button className="btn py-1" onClick={ removeFromMyFavorite } id={ i._id }>
                                                <span class="material-symbols-outlined isMyFavorite" id={ i._id }>
                                                    favorite
                                                </span>
                                            </button>
                                        </div>
                                        <div className="card-body">
                                            <p><strong>講師:</strong> { i.instructor.name }</p>
                                            <p><strong>課程簡介:</strong> { i.description }</p>
                                            <p><strong>價格:</strong> { i.price }</p>
                                            <p><strong>學生人數:</strong> { i.students.length }</p>
                                        </div>
                                        <div className="card-footer">
                                            { courseData.length > 0 && courseData.filter((j) => j._id === i._id).length !== 0 && (
                                                <a href="#" className="btn hover-bg-warning" id={ i._id } style={{ flexGrow: "1" }}>
                                                上課去
                                            </a>                                        
                                            )}
                                            { courseData.length === 0 || courseData.filter((j) => j._id === i._id).length === 0 && (
                                                <a href="#" onClick={ handleEnroll } className="btn hover-bg-warning" id={ i._id } style={{ flexGrow: "1" }}>
                                                    註冊
                                                </a>                                        
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>  
        </div>    
    )  
}

export default Course;