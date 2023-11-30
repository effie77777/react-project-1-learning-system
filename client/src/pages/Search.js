import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NewCourseService from "../services/course-service";

const Search = ({ currentUser, courseData, setCourseData, myFavorite, setMyFavorite, allCourses, setAllCourses, setCurrentSearch }) => {
    const Navigate = useNavigate();
    const [ input, setInput ] = useState("");
    const [ searchResult, setSearchResult ] = useState([]);
    const [ errorMsg, setErrorMsg ] = useState(null);
    const [ successMsg1, setSuccessMsg1 ] = useState(null); //在上面區塊
    const [ successMsg2, setSuccessMsg2 ] = useState(null); //在下面區塊
    const [ suggestionList, setSuggestionList ] = useState([]);
    const [ previousInput, setPreviousInput ] = useState(""); //用來判斷當 e.target.value 的長度改變時，使用者是新增還是刪除文字
    const [ trimmed, setTrimmed ] = useState(""); //用來篩選 e.target.value 關鍵字，會先過濾掉特殊符號。如果沒有這個 state，而是直接修改 input 的值，會影響到按搜尋按鈕時的準確度
    const suggestionListUl = document.getElementById("suggestion-list-ul");
    const suggestionListItem = document.getElementsByClassName("suggestion-list-item");

    //關鍵字搜尋
    const changeInput = (e) => {
        setInput(e.target.value);
        let regexp = /[^!！@＠#＃\$%％\^︿&＆\*＊(（)）_＿\-－[［\]］+＋\|｜\\＼\/／<＜>＞\.．,，;；'’"＂=＝~～`‵}｝˙˙。 　]/;
        let trimmed = ""; // e.target.value 當中的特殊字元不要比對，全形半形都要檢查 
        for (let r = 0; r < e.target.value.length; r ++) {
            let regexpTest = regexp.test(e.target.value[r]);
            if (regexpTest) {
                trimmed += e.target.value[r];
                setTrimmed(trimmed);
            }
        }
        if (trimmed.length === 0) {
            setPreviousInput("");
        }
        if (suggestionListUl) {
            suggestionListUl.classList.remove("d-none");
        }

        let currentInput = trimmed; //字串長度的初始值應該要是 1，除非使用者用複製貼上的
        if (previousInput === "") { //代表使用者還沒有輸入過文字
            setPreviousInput(currentInput); //第一次變動，讓 current 和 previous 相等
            allCourses.map((item) => {
                if (item.title.includes(trimmed.toUpperCase()) || item.title.includes(trimmed.toLowerCase())) {
                    suggestionList.push(item);
                    setSuggestionList(suggestionList);
                }
            })

        //第二次以後的變動，有可能是新增文字、也有可能是刪除文字
        //刪除文字的狀況。去比對已經存在 suggestionList 的項目，有沒有符合目前的搜尋結果，沒有符合就代表使用者已經刪掉
        } else if (currentInput.length < previousInput.length) {
            for (let m = 0; m < suggestionList.length; m ++) {
                let result = false;
                for (let n = 0; n < trimmed.length; n ++) {
                    if (suggestionList[m].title.includes(trimmed[n].toUpperCase()) || suggestionList[m].title.includes(trimmed[n].toLowerCase())) {
                        result = true;
                        break;
                    }
                }
                if (!result) {
                    suggestionList.splice(m, 1);
                    setSuggestionList(suggestionList);
                    m = m - 1; //因為 suggestionList 的長度減一了，m (index) 要跟著減一才能確保每個 index 的項目都有被檢驗到
                }
            }
            setPreviousInput(trimmed);

        //新增文字的情況
        } else if (currentInput.length > previousInput.length) {
            for (let i = 0; i < trimmed.length; i ++) {
                for (let j = 0; j < allCourses.length; j ++) {
                    if (allCourses[j].title.includes(trimmed[i].toUpperCase()) || allCourses[j].title.includes(trimmed[i].toLowerCase())) {
                        if (suggestionList.includes(allCourses[j]) === false) { //檢查 suggestionList 裡面有無包含 allCourses[i]
                            suggestionList.push(allCourses[j]);
                            setSuggestionList(suggestionList);           
                        };
                    }
                }
            }
            setPreviousInput(trimmed);
        }

        for (let p = 0; p < suggestionListItem.length; p ++) {
            let count = 0; // count 代表每一門課程的 title 中，有幾個字符合搜尋條件
            let index = suggestionListItem[p].innerText.indexOf("("); //括號和講師名稱不要納入比對範圍
            let titleStr = suggestionListItem[p].innerText.slice(0, index).trim();           
            for (let q = 0; q < titleStr.length; q ++) {
                let text = titleStr.charAt(q); // q 是 index，text 是對應到的文字內容
                let beforeText; // title 當中，在 text 之前的文字
                let afterText; // title 當中，在 text 之後的文字
                if (trimmed.includes(text.toUpperCase()) || trimmed.includes(text.toLowerCase())) {
                    if (count === 0) {
                        beforeText = suggestionListItem[p].innerText.substring(0, q);
                        afterText = suggestionListItem[p].innerText.substring(q + 1);
                        count = count + 1;
                    } else {                    
                        // count 每增加一，就會增加一個 <span>，造成 HTML 長度增加 33
                        beforeText = suggestionListItem[p].innerHTML.substring(0, q + 33 * count);
                        afterText = suggestionListItem[p].innerHTML.substring(q + 33 * count + 1);
                        count = count + 1;
                    }
                    suggestionListItem[p].innerHTML = `${beforeText}<span class="text-danger">${text}</span>${afterText}`;
                }
            }
        }
    }

    //透過點選搜尋按鈕來搜尋課程
    const handleSearch = (e) => {
        e.preventDefault();
        let data = allCourses.filter((i) => i.title === input);
        if (data.length > 0) {
            setSearchResult(data);
            setErrorMsg(null);
            suggestionListUl.classList.add("d-none");
        } else {
            setErrorMsg("對不起，找不到完全符合搜尋內容的課程");
            setSearchResult([]);
            suggestionListUl.classList.remove("d-none");
        }
    }

    //透過點選 suggestionList 來搜尋課程
    const handleSearchById = (e) => {
        e.preventDefault();
        let data = allCourses.filter((i) => i._id === e.target.id);
        setSearchResult(data);
        setErrorMsg(null);
        if (suggestionListUl) {
            suggestionListUl.classList.add("d-none");
        }
    }

    //註冊課程
    const handleEnroll = (e) => {
        e.preventDefault();
        let courseId = e.target.id;
        let studentId = currentUser.data._id;
        NewCourseService.enrollCourse(courseId, studentId)
        .then((d) => {
            courseData.push(d.data);
            setCourseData(courseData);
            searchResult.find((i, index) => {
                if (i._id === courseId) {
                    searchResult.splice(index, 1, d.data);
                }
            })
            if (e.target.classList.contains("handle-enroll-1")) {
                setSuccessMsg1("註冊成功 !");
            } else {
                setSuccessMsg2("註冊成功 !");
            }
            allCourses.find((i, index) => {
                if (i._id === courseId) {
                    allCourses.splice(index, 1, d.data);
                    setAllCourses(allCourses);    
                }
            })
            setTimeout(() => {
                setSuccessMsg1(null);
                setSuccessMsg2(null);
            }, 1500);
        })
        .catch((e) => {
            console.log(e.response.data);
        })
    }

    //學生點選「上課去」按鈕
    const handleGoToLesson = (e) => {
        let searchedCourse = courseData.find((i) => i._id === e.target.id);
        setCurrentSearch([searchedCourse]);
        localStorage.setItem("current_search", JSON.stringify(searchedCourse));
        Navigate("/detail");
    }
    
    //加入我的最愛
    const addToMyFavorite = (e) => {
        e.preventDefault();
        let studentId = currentUser.data._id;
        let courseId = e.target.id;
        NewCourseService.changeFavorite(studentId, courseId)
        .then((d) => {
            myFavorite.push(d.data);
            setMyFavorite(myFavorite);
            if (e.target.classList.contains("handle-favorite-1")) {
                setSuccessMsg1("成功加入 !");
            } else {
                setSuccessMsg2("成功加入 !");
            }
            setTimeout(() => {
                setSuccessMsg1(null);
                setSuccessMsg2(null);
            }, 1500);
        })
        .catch((e) => {
            console.log(e);
        })
    }

    //移除我的最愛
    const removeFromMyFavorite = (e) => {
        e.preventDefault();
        let studentId = currentUser.data._id;
        let courseId = e.target.id;
        NewCourseService.changeFavorite(studentId, courseId)
        .then((d) => {
            myFavorite.forEach((i, index) => {
                if (i._id === courseId) {
                    myFavorite.splice(index, 1);
                    setMyFavorite(myFavorite);
                }
            })
            if (e.target.classList.contains("handle-favorite-1")) {
                setSuccessMsg1("成功移除 !");
            } else {
                setSuccessMsg2("成功移除 !");
            }
            setTimeout(() => {
                setSuccessMsg1(null);
                setSuccessMsg2(null);
            }, 1000);
            console.log(d);
        })
        .catch((e) => {
            console.log(e);
        })
    }

    useEffect(() => {
        if (!currentUser) {
            return setErrorMsg("請先進行登入或註冊");
        } else if (currentUser.data.role === "講師") {
            return setErrorMsg("搜尋功能專門提供給學員哦 ! 如要查看您開設的課程，請至您的個人課程頁面");
        } else if (currentUser.data.role === "學員") {
            NewCourseService.searchAllCourses()
            .then((d) => {
                setAllCourses(d.data);
            })
            .catch((e) => {
                console.log(e);
            });

            NewCourseService.getEnrolledCourse(currentUser.data._id)
            .then((d) => {
                setCourseData(d.data);
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
                    <div>
                        <div className="alert alert-danger">
                            <p className="mb-0">{ errorMsg }</p>
                        </div>

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

                        { currentUser && currentUser.data.role === "講師" && (
                            <Link className="btn btn-dark fw-bold me-2" to="/coursesList">
                                帶我回我的課程頁面
                            </Link>                        
                        )}
                    </div>
                }

                { currentUser && currentUser.data.role === "學員" && (
                    <div className="mb-4">
                        <div className="input-group">
                            <input onChange={ changeInput } type="text" className="form-control p-3 border-dark" placeholder="請輸入課程名稱" />
                            <button onClick={ handleSearch } className="btn btn-primary px-4">
                                搜尋
                            </button>
                        </div>
                        { suggestionList.length > 0 && (
                            <ul className="d-block w-100 py-1" style={{ zIndex: "1", borderBottom: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black" }} id="suggestion-list-ul">
                                { suggestionList.map((i) =>
                                    <li className="hover-bg-gray"><button className="btn px-3 py-2 w-100 text-start suggestion-list-item" onClick={ handleSearchById } id={ i._id }>{ i.title } ({ i.instructor.name })</button></li>
                                )}
                            </ul>
                        )}
                    </div>
                )}

                { currentUser && currentUser.data.role === "學員" && searchResult.length > 0 && (
                    <section>
                        <div className="d-flex">
                            <h3 className="fs-2">搜尋結果</h3>
                            { successMsg1 && (
                                <div className="alert alert-danger msg">
                                    <span class="material-symbols-outlined fs-4 me-2">
                                        check_circle
                                    </span>
                                    <p>{ successMsg1 }</p>
                                </div>
                            )}
                        </div>
                        <div className="row">
                            { searchResult.map((i) => (
                                <div className="col-md-6 col-lg-4 card-group">
                                    <div className="card border-0 mb-4">                                    
                                        <div className="card-header bg-light-primary d-flex align-items-start">
                                            <h4>{ i.title }</h4>
                                            { /* 檢查該課程有沒有在我的最愛裡面 */ }
                                            { myFavorite.length > 0 && myFavorite.filter((j) => j._id === i._id).length === 0 && 
                                                <button className="btn handle-favorite-1 py-1" onClick={ addToMyFavorite } id={ i._id }>
                                                    <span class="material-symbols-outlined handle-favorite-1" id={ i._id }>
                                                        favorite
                                                    </span>
                                                </button>
                                            }
                                            { myFavorite.filter((j) => j._id === i._id).length > 0 && 
                                                <button className="btn handle-favorite-1 py-1" onClick={ removeFromMyFavorite } id={ i._id }>
                                                    <span class="material-symbols-outlined isMyFavorite handle-favorite-1" id={ i._id }>
                                                        favorite
                                                    </span>
                                                </button>
                                            }
                                        </div>
                                        <div className="card-body bg-light-primary">
                                            <p><strong>講師:</strong> { i.instructor.name }</p>
                                            <p><strong>課程簡介:</strong> { i.description }</p>
                                            <p><strong>價格:</strong> { i.price }</p>
                                            <p><strong>學生人數:</strong> { i.students.length }</p>
                                        </div>
                                        <div className="card-footer">
                                            { courseData.length > 0 && courseData.filter((j) => j._id === i._id).length > 0 && (
                                                <button type="button" className="btn bg-light-primary hover-bg-primary" id={ i._id } key={ i._id } onClick={handleGoToLesson}>
                                                    上課去
                                                </button>                                        
                                            )}
                                            { courseData.length === 0 || courseData.filter((j) => j._id === i._id).length === 0 && (
                                                <button onClick={ handleEnroll } className="btn bg-light-primary hover-bg-primary handle-enroll-1" id={ i._id } key={ i._id }>
                                                    註冊
                                                </button>                                        
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                { currentUser && currentUser.data.role === "學員" && (
                    <section className="bg-warning bg-opacity-25 mb-0">
                        <div className="d-flex">
                            <h3 className="fs-2">探索更多課程</h3>
                            { successMsg2 && (
                                <div className="alert alert-danger msg">
                                    <span class="material-symbols-outlined fs-4">
                                        check_circle
                                    </span>
                                    <p>{ successMsg2 }</p>
                                </div>
                            )}
                        </div>
                        <div className="row flex-nowrap overflow-auto">
                            { allCourses && allCourses.map((i) => (
                                <div className="col-md-6 col-lg-4 card-group">
                                    <div className="card border-0 mb-4">                                    
                                        <div className="card-header d-flex align-items-start">
                                            <h4>{ i.title }</h4>
                                            { /* 檢查該課程有沒有在我的最愛裡面 */ }
                                            { myFavorite.filter((j) => j._id === i._id).length === 0 && 
                                                <button className="btn handle-favorite-2 py-1" onClick={ addToMyFavorite } id={ i._id }>
                                                    <span class="material-symbols-outlined handle-favorite-2" id={ i._id }>
                                                        favorite
                                                    </span>
                                                </button>
                                            }
                                            { myFavorite.filter((j) => j._id === i._id).length > 0 && 
                                                <button className="btn handle-favorite-2 py-1" onClick={ removeFromMyFavorite } id={ i._id }>
                                                    <span class="material-symbols-outlined isMyFavorite handle-favorite-2" id={ i._id }>
                                                        favorite
                                                    </span>
                                                </button>
                                            }
                                        </div>
                                        <div className="card-body">
                                            <p><strong>講師:</strong> { i.instructor.name }</p>
                                            <p><strong>課程簡介:</strong> { i.description }</p>
                                            <p><strong>價格:</strong> { i.price }</p>
                                            <p><strong>學生人數:</strong> { i.students.length }</p>
                                        </div>
                                        <div className="card-footer">
                                            { courseData.length > 0 && courseData.filter((j) => j._id === i._id).length > 0 && (
                                                <button type="button" onClick={ handleGoToLesson } className="btn hover-bg-warning" id={ i._id } key={ i._id }>
                                                上課去
                                                </button>                                        
                                            )}
                                            { courseData.length > 0 && courseData.filter((j) => j._id === i._id).length === 0 && (
                                                <button type="button" onClick={ handleEnroll } className="btn hover-bg-warning handle-enroll-2" id={ i._id } key={ i._id }>
                                                    註冊
                                                </button>                                        
                                            )}
                                            { courseData.length === 0 && (
                                                <a href="#" onClick={ handleEnroll } className="btn hover-bg-warning handle-enroll-2" id={ i._id }>
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
    );
}

export default Search;