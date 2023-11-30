import React, { useState , useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import NewCourseService from "../services/course-service";

const PostJourney = ({ currentUser, courseData, setCourseData, myJourney, setMyJourney }) => {
    const [ journeyTitle, setJourneyTitle ] = useState("");
    const [ journeyContent, setJourneyContent ] = useState("");
    const [ selectCourse, setSelectCourse ] = useState(null);
    const [ errorMsg, setErrorMsg ] = useState(null);
    const [ successMsg, setSuccessMsg ] = useState(null);
    const Navigate = useNavigate();

    //將 input 標籤 - title 的內容更新到 State
    const changeTitle = (e) => {
        setJourneyTitle(e.target.value);
        if (e.target.value.length > 18) {
          e.target.classList.add("border-danger");
        } else {
          e.target.classList.remove("border-danger");
        }
    }

    //將 input 標籤 - content 的內容更新到 State
    const changeContent = (e) => {
        setJourneyContent(e.target.value);
        if (e.target.value.length > 100) {
          e.target.classList.add("border-danger");
        } else {
          e.target.classList.remove("border-danger");
        }
    }

    //將 input 標籤 - selectCourse 的內容更新到 State
    const changeSelectCourse = (e) => {
      setSelectCourse(e.target.value);
    }

    //確定建立日誌
    const handlePostJourney = (e) => {
      e.preventDefault();
      let studentId = currentUser.data._id;
        NewCourseService.postJourney(studentId, journeyTitle, journeyContent, selectCourse)
        .then((d) => {
            setErrorMsg(null);
            myJourney.push(d.data);
            setMyJourney(myJourney);
            setSuccessMsg("成功新增學習日誌 !");
            setTimeout(() => {
                setSuccessMsg(null);
                Navigate("/profile");              
            }, 2000);
        })
        .catch((e) => {
            setErrorMsg(e.response.data);
        })
    }

    useEffect(() => {
      if (!currentUser) {
        return setErrorMsg("請先進行登入或註冊");
      } else if (currentUser.data.role !== "學員") {
        return setErrorMsg("只有學員能夠張貼學習日誌哦");
      } else {
        if (courseData.length === 0) {
          NewCourseService.getEnrolledCourse(currentUser.data._id)
          .then((d) => {
            setCourseData(d.data);
          })
          .catch((e) => {
            console.log(e);
          })
        }
      }
    }, []);    

    return (
        <div className="py-5">
            <div className="container">
                { errorMsg &&
                    <div className="alert alert-danger mb-5">
                        <p className="mb-0">{ errorMsg }</p>
                    </div>
                }
                { successMsg && (
                    <div className="alert alert-success mb-5" role="alert">
                        <p className="mb-0">{ successMsg }</p>
                    </div>
                )}

                { !currentUser && (
                    <div>
                        <Link className="btn btn-dark fw-bold me-4" to="/login">
                            登入
                        </Link>
                        <Link className="btn border-dark text-dark" to="/register">
                            註冊
                        </Link>
                    </div>
                )}

                { currentUser && currentUser.data.role === "講師" && (
                    <Link className="btn btn-dark fw-bold me-4" to="/coursesList">
                        帶我回我的課程頁面
                    </Link>
                )}

                { currentUser && currentUser.data.role === "學員" && (
                    <div className="form-group">
                        <div className="custom-form-style">
                            <label htmlFor="journeyTitle">標題<span>*</span></label>
                            <input name="journeyTitle" type="text" className="form-control" id="journeyTitle" pattern="\w\{1, 18\}" onChange={ changeTitle } />
                            <div className="d-flex">
                                <p className="word-count">字數 :<span></span>{journeyTitle.length} / 18</p>
                                {(journeyTitle.length > 18) && (
                                    <div className="error-msg">
                                        <span className="material-symbols-outlined">
                                            error
                                        </span>
                                        <p>已超過字數上限</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="custom-form-style mt-4">
                            <label htmlFor="journeyContent">內容<span>*</span></label>
                            <textarea type="text" className="form-control" id="journeyContent" name="journeyContent" pattern="\w\{1, 100\}" onChange={ changeContent } />
                            <div className="d-flex">
                                <p className="word-count">字數 :<span></span>{ journeyContent.length } / 100</p>
                                {(journeyContent.length > 100) && (
                                    <div className="error-msg">
                                        <span className="material-symbols-outlined">
                                            error
                                        </span>
                                        <p>已超過字數上限</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="custom-form-style mt-4">
                            <label htmlFor="selectCourse" className="mb-0">請選擇這門課</label>
                            <p style={{ marginBottom: "0.25rem" }}><span className="text-danger">( 如果你已註冊這門課，並且想將心得分享給講師，請務必選擇此欄位 )</span></p>
                            <select className="form-control" name="selectCourse" id="selectCourse" autoComplete="off" onChange={ changeSelectCourse } >
                            <option></option>
                                { currentUser && currentUser.data.role === "學員" && courseData.length > 0 && (
                                    courseData.map((i) => 
                                    <option value={ i._id + " " + i.instructor._id } >{i.title} ({i.instructor.name})</option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="mt-5">
                            <button className="btn btn-dark fw-bold me-4" onClick={ handlePostJourney }>
                            確認送出
                            </button>
                            <Link className="btn border-dark text-dark" to="/profile">
                            取消
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PostJourney;