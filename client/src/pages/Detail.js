import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import demoVideo from "../assets/videos/demo-video.mp4";

const Detail = ({ currentUser, currentSearch, setCurrentSearch }) => {
    const Navigate = useNavigate();
    const [ errorMsg, setErrorMsg ] = useState(null);
    const [ isPlaying, setIsPlaying ] = useState(false);

    const handleChangeVideoStatus = () => {
        const changeStatus = !isPlaying;
        setIsPlaying(changeStatus);
    }

    useEffect(() => {
        const video = document.querySelector("video");
        if (video) {
            isPlaying
            ? video.play()
            : video.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (!currentUser) {
            setErrorMsg("請先進行登入或註冊");
        } else if (currentUser.data.role === "講師") {
            setErrorMsg("只有學員能夠上課哦 ! 將為您導回個人課程頁面");
            setTimeout(() => {
                Navigate("/coursesList");
            }, 2000);
        } else if (!localStorage.getItem("current_search")) {
            setErrorMsg("您還沒有選擇課程哦，將為您導向個人課程頁面");
            setTimeout(() => {
                Navigate("/coursesList");
            }, 2000);
        } else {
            setCurrentSearch([JSON.parse(localStorage.getItem("current_search"))]);
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

                { currentUser && currentSearch && currentSearch.length > 0 && (
                    <div className="row justify-content-center">
                        <div className="pt-0 pb-4" style={{paddingLeft: "2.25rem", paddingRight: "2.25rem"}}>
                            <h3 className="fs-2 mb-5 fw-bold">{ currentSearch[0].title }</h3>
                            <div className="mb-4">
                                <h4 className="bg-warning bg-opacity-25 text-dark-warning py-3 px-4 fw-bold">課程簡介</h4>
                                <p className="px-4">{ currentSearch[0].description }</p>
                            </div>
                            <div>
                                <h4 className="bg-warning bg-opacity-25 text-dark-warning py-3 px-4 fw-bold mb-0">課程大綱</h4>
                                <ul className="pt-1 mb-3 remove-li-bottom-border">
                                    { currentSearch[0].chapters.map((i, index) =>
                                        <li className="px-4 py-3 border-bottom border-1" key={index}>{i}</li>
                                    )}
                                </ul>
                            </div>
                            <div>
                                <h4 className="bg-warning bg-opacity-25 text-dark-warning py-3 px-4 fw-bold">課程影片</h4>
                                <div className="d-flex flex-column flex-sm-row">
                                    <video className="course-video">
                                        <source src={demoVideo} type="video/mp4"></source>
                                    </video>
                                    <button type="button" className="text-dark-warning fw-bold px-4 py-2 align-self-end ms-2 hover-bg-dark-warning mt-1 course-video-btn" style={{height: "fit-content", border: "1px solid #cd9a00", background: "transparent"}} onClick={handleChangeVideoStatus} >
                                        { isPlaying ? "暫停" : "播放" }
                                    </button>
                                </div>
                            </div>                        
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Detail;