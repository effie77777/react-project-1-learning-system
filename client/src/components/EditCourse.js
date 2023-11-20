import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NewCourseService from "../services/course-service";

const EditCourse = ({ currentUser, currentEdited, setCurrentEdited }) => {
    const [ title, setTitle ] = useState("");
    const [ description, setDescription ] = useState("");
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
    const changePrice = (e) => {
      setPrice(e.target.value);
      if (e.target.value < 99 || e.target.value > 5999) {
        e.target.classList.add("border-danger");
      } else {
        e.target.classList.remove("border-danger");
      }
    }

    //講師確認修改課程
    const handleEditCourse = () => {
      const courseId = currentEdited.data._id;
      NewCourseService.editAndPostCourse(courseId, title, description, price)
      .then((d) => {
          setErrorMsg(null);
          setSuccessMsg("成功修改課程 ! 將為您導向個人課程頁面");
          setTimeout(() => {
            setCurrentEdited(null);
            Navigate("/course");              
          }, 2000);              
      })
      .catch((e) => {
          setErrorMsg(e.response.data);
          console.log(e);
      })
    }

    //取消修改
    const handleCancel = () => {
      setCurrentEdited(null);
      Navigate("/course");
    }

    useEffect(() => {
      if (!currentUser || currentUser.data.role !== "講師") {
        setErrorMsg("只有講師能夠編輯課程哦 ! 若您為講師請先進行登入");
      } else if (currentUser && currentUser.data.role === "講師") {
        if (!currentEdited) {
          setErrorMsg("請到個人頁面選擇欲編輯的課程");
          setTimeout(() => {
            Navigate("/course")
          }, 2000);
        } else {
          setTitle(currentEdited.data.title);
          setDescription(currentEdited.data.description);
          setPrice(currentEdited.data.price);
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

          { !currentUser || currentUser.data.role !== "講師" && (
            <Link className="btn btn-dark fw-bold me-4 mt-5" to="/login">
              登入
            </Link>
          )}

          { currentUser && currentUser.data.role === "講師" && !currentEdited && (
            <p className="ms-3">將為您重新導向至個人頁面</p>
          ) }

          { currentUser && currentUser.data.role === "講師" && currentEdited && (
            <div className="form-group">
              <div className="custom-form-style">
                <label htmlFor="title">課程名稱<span>*</span></label>
                <input name="title" type="text" className="form-control" id="title" pattern="\w{1,18}" onChange={ changeTitle } value={ title } />
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
                <textarea type="text" className="form-control" id="description" name="description" pattern="\w{1,60}" onChange={ changeDesciption } value={ description } />
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
                <label htmlFor="price">價格<span>*</span></label>
                <input type="number" className="form-control" name="price" id="price" onChange={ changePrice } value={ price } />
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
                <button className="btn btn-dark fw-bold me-4" onClick={ handleEditCourse }>
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

export default EditCourse;