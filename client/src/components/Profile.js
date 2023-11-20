import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NewCourseService from "../services/course-service";

const Profile = ({ currentUser, setCourseData, setMyFavorite, setAllCourses, myJourney, setMyJourney }) => {
    const [ errorMsg, setErrorMsg ] = useState(null);
    const [ msg, setMsg ] = useState(null);
    const Navigate = useNavigate();

    //關閉新增學習日誌的提醒
    const alert = document.querySelector("#alert-and-btn-div");
    const handleCloseAlert = (e) => {
        e.preventDefault();
        alert.classList.add("d-none");
    }

    useEffect(() => {
        if (!currentUser) {
            return setErrorMsg("請先進行登入或註冊");
        } else if (currentUser && currentUser.data.role === "講師") {
            NewCourseService.getCourseList(currentUser.data._id)
            .then((d) => {
                setCourseData(d.data);
            })
            .catch((e) => {
                console.log(e);
            })
            NewCourseService.getStudentsFeedback(currentUser.data._id)
            .then((d) => {
                setMyJourney(d.data);
            })
            .catch((e) => {
                console.log(e);
            })

        } else if (currentUser && currentUser.data.role === "學員") {
            NewCourseService.getEnrolledCourse(currentUser.data._id)
            .then((d) => {
                setCourseData(d.data);
            })
            .catch((e) => {
                console.log(e);
            })
            NewCourseService.getMyFavorite(currentUser.data._id)
            .then((d) => {
                console.log(d);
                setMyFavorite(d.data);
            })
            .catch((e) => {
                console.log(e);
            })
            NewCourseService.getMyJourney(currentUser.data._id)
            .then((d) => {
                setMyJourney(d.data);
                if (d.data.length === 0) {
                    setMsg("目前還沒有學習日誌哦 ! 要現在來記錄一下嗎 ?");
                }                 
            })
            .catch((e) => {
                console.log(e);
            })
        }

        //不論身份為講師或學員均要執行
        NewCourseService.searchAllCourses()
        .then((d) => {
            setAllCourses(d.data);
        })
        .catch((e) => {
            console.log(e);
        })
    }, []);

    return (
        <div className="py-5">
            <div className="container">
                { errorMsg &&
                    <div className="alert alert-danger mb-5">
                        <p className="mb-0">{ errorMsg }</p>
                    </div>
                }

                { !currentUser &&
                    <div className="mt-5">               
                        <Link className="btn btn-dark fw-bold me-4" to="/login">
                            登入
                        </Link>
                        <Link className="btn border-dark text-dark" to="/register">
                            註冊
                        </Link>
                    </div>
                }

                { currentUser &&
                    <section className="bg-light-primary">
                        <h3 className="fs-2 mb-4">個人基本資料</h3>
                        <p><strong className="me-1">使用者名稱 : </strong>{ currentUser.data.name }</p>
                        <p><strong className="me-1">ID : </strong>{ currentUser.data._id }</p>
                        <p><strong className="me-1">email : </strong>{ currentUser.data.email }</p>
                        <p className="mb-0"><strong className="me-1">身分 : </strong>{ currentUser.data.role }</p>
                    </section>
                }

                { currentUser && (
                    <section className="bg-warning bg-opacity-25 mt-5">
                        { currentUser.data.role === "學員" && (
                            <div className="d-flex mb-4 align-items-center">
                                <h3 className="fs-2 me-2 mb-0">學習日誌</h3>
                                <Link className="btn p-1 m-0 d-flex" to="/postJourney">
                                    <span class="material-symbols-outlined fs-3">
                                        add_circle
                                    </span>
                                </Link>
                            </div>
                        )}

                        { currentUser.data.role === "講師" && (
                            <h3 className="fs-2">學員回饋</h3>
                        )}

                        { currentUser.data.role === "學員" && msg && (
                            <div id="alert-and-btn-div">
                                <div className="alert alert-danger border-3 d-flex">
                                    <p className="m-0 fw-bold me-3">{ msg }</p>
                                </div>
                                <Link className="btn btn-dark fw-bold me-2" to="/postJourney">
                                        好哇 ! GO GO
                                </Link>
                                <button className="btn border-dark fw-bold" onClick={ handleCloseAlert }>
                                    下次再提醒我
                                </button>
                            </div>                        
                        )}

                        <div className="row overflow-scroll flex-nowrap">
                            { myJourney && myJourney.length > 0 && myJourney.map((i) => (
                                <div className="col-md-6 col-lg-4 card-group" id={ i._id }>
                                    <div className="card border-0 mb-4">                                    
                                        <div className="card-header d-flex">
                                            <h4>{ i.journeyTitle }</h4>
                                        </div>
                                        <div className="card-body">
                                            <p>{ i.journeyContent }</p>
                                        </div>
                                        <div className="card-footer p-3">
                                            { currentUser.data.role === "學員" && (
                                                <p className="mb-0">{ i.date.substring(0, i.date.indexOf("T")) }</p>
                                            )}
                                            { currentUser.data.role === "講師" && (
                                                <p className="mb-0">學員 : { i.owner.name }</p>
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

export default Profile;