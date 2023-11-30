import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import NewCourseService from "../services/course-service";

const PostCourse = ({ currentUser }) => {
  const [ title, setTitle ] = useState("");
  const [ description, setDescription ] = useState("");
  const [ chapters, setChapters ] = useState([]);
  const [ currentlyModifying, setCurrentlyModifying ] = useState(0);
  const [ price, setPrice ] = useState(0);
  const [ errorMsg, setErrorMsg ] = useState(null);
  const [ successMsg, setSuccessMsg ] = useState(null);
  const Navigate = useNavigate();

  const changeTitle = (e) => {
      setTitle(e.target.value);
      if (e.target.value.length > 18) {
        e.target.classList.add("border-danger");
      } else {
        e.target.classList.remove("border-danger");
      }
  }

  const changeDesciption = (e) => {
      setDescription(e.target.value);
      if (e.target.value.length > 60) {
        e.target.classList.add("border-danger");
      } else {
        e.target.classList.remove("border-danger");
      }
  }

  const changeChapters = (e) => {
    let key = e.target.id.substring(e.target.id.length - 1);
    let value = e.target.value;
    let newArr = [];
    newArr.splice(key, 0, value);
    console.log(newArr);
  }

  const addAChapter = (e) => {
    //目前是按了第幾個 chapter 的新增按鈕 (chapter 從 0 開始)
    let item = Number(e.target.getAttribute("id"));
    console.log(item);
    setCurrentlyModifying(item);
  };

  const changePrice = (e) => {
      setPrice(e.target.value);
      if (e.target.value < 99 || e.target.value > 5999) {
        e.target.classList.add("border-danger");
      } else {
        e.target.classList.remove("border-danger");
      }
  }

  const handlePostCourse = () => {
      NewCourseService.postCourse(title, description, price)
      .then((d) => {
          setErrorMsg(null);
          setSuccessMsg("成功新增課程 ! 將為您導回個人課程頁面");
          setTimeout(() => {
            setSuccessMsg(null);
            Navigate("/course");              
          }, 2000);
      })
      .catch((e) => {
          setErrorMsg(e.response.data);
      })
  }

  const handleCancel = () => {
    Navigate("/course");
  }

  useEffect(() => {       
    let currentParentDiv = document.querySelector(`li.li_${currentlyModifying}`);
    console.log(currentParentDiv);
    let newChapterDiv = document.createElement("li");
    currentParentDiv.insertAdjacentElement("afterend", newChapterDiv);
    newChapterDiv.classList.add("d-flex", `li_${currentlyModifying + 1}`, "postCourse-li");
    newChapterDiv.innerHTML = `<label htmlFor=chapter_${currentlyModifying + 2}>` + `Chapter ${currentlyModifying + 2}` + `</label><input type='text' id=chapter_${currentlyModifying + 2} name=chapter_${currentlyModifying + 2} onChange={ changeChapters } /><button type='button' id=${currentlyModifying + 2} onClick={ addAChapter }><span class='material-symbols-outlined' onClick={ addAChapter }>add_circle</span></button>`;
  }, [currentlyModifying]);

  useEffect(() => {
    if (!currentUser) {
      setErrorMsg("只有講師能夠編輯課程哦 ! 若您為講師請先進行登入");
    } else if (currentUser && currentUser.data.role !== "講師") {
      setErrorMsg("只有講師能夠編輯課程哦 !");
    } else {
      setErrorMsg(null);
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
              <Link className="btn border-dark text-dark" to="/enroll">
                註冊
              </Link>
            </div>
          )}

          { currentUser && currentUser.data.role !== "講師" && (
            <Link className="btn btn-dark fw-bold me-4" to="/course">
              帶我回我的課程頁面
            </Link>
          )}

          { currentUser && currentUser.data.role === "講師" && (
            <div className="form-group">
              <div className="custom-form-style">
                <label htmlFor="title">課程名稱<span>*</span></label>
                <input name="title" type="text" className="form-control" id="title" pattern="\w\{1, 18\}" onChange={ changeTitle } />
                <div className="d-flex">
                  <p className="word-count">字數 :<span></span>{title.length} / 18</p>
                  {(title.length > 18) && (
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
                <label htmlFor="description">課程簡介<span>*</span></label>
                <textarea type="text" className="form-control" id="description" name="description" pattern="\w\{1, 60\}" onChange={ changeDesciption } />
                <div className="d-flex">
                  <p className="word-count">字數 :<span></span>{description.length} / 60</p>
                  {(description.length > 60) && (
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
                <label htmlFor="description">課程章節<span>*</span></label>
                <ul>
                  <li className="d-flex li_0 postCourse-li" key="li_0">
                    <label htmlFor="chapter_1">Chapter 1</label>
                    <input type="text" id="chapter_1" name="chapter_1" onChange={ changeChapters } />
                    <button type="button" id="0" onChange={ addAChapter }>
                      <span className="material-symbols-outlined" id="0" onClick={ addAChapter }>
                        add_circle
                      </span>
                    </button>
                  </li>
                </ul>
              </div>

              <div className="custom-form-style mt-4">
                <label htmlFor="price">價格<span>*</span></label>
                <input type="number" className="form-control" name="price" id="price" onChange={ changePrice } />
                <div className="d-flex">
                  <p className="word-count">價格限制 : 台幣 99 - 5, 999</p>
                  {(price && price < 99 || price > 5999) && (
                    <div className="error-msg">
                      <span className="material-symbols-outlined">
                        error
                      </span>
                      <p>已超出價格上下限</p>
                    </div>
                  )}
                  <div className="error-msg d-none">
                    <span className="material-symbols-outlined">
                      error
                    </span>
                    <p>價格必須為數字哦</p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <button className="btn btn-dark fw-bold me-4" onClick={ handlePostCourse }>
                  確認送出
                </button>
                <button className="btn border-dark text-dark" onClick={ handleCancel }>
                  取消
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default PostCourse;