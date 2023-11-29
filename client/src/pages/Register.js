import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NewAuthService from "../services/auth-service";

const Register = () => {
  const [ name, setName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ role, setRole ] = useState("");
  const [ errorMsg, setErrorMsg ] = useState(null);
  const [ successMsg, setSuccessMsg ] = useState(null);
  const Navigate = useNavigate();

  const changeName = (e) => {
    setName(e.target.value);
  }
  const changeEmail = (e) => {
    setEmail(e.target.value);
  }
  const changePassword = (e) => {
    setPassword(e.target.value);
  }
  const changeRole = (e) => {
    setRole(e.target.value);
  }

  //註冊
  const handleRegister = (e) => {
    e.preventDefault();
    NewAuthService.register(name, email, password, role)
    .then((d) => {        
      setErrorMsg(null);
      setSuccessMsg("註冊成功 ! 將為您導向登入頁面");
      setTimeout(() => {
        setSuccessMsg(null);
        Navigate("/login");
      }, 2000);
    })
    .catch((e) => {
      setErrorMsg(e.response.data);
    })
  }

  //切換密碼為顯示或不顯示
  const changeVisibility = () => {
    let pwd = document.querySelector("#password");
    if (pwd.type === "password") {
      pwd.type = "text";
    } else if (pwd.type === "text") {
      pwd.type = "password";
    }
  }

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

        <div>
          <div className="custom-form-style">
            <label htmlFor="name">使用者名稱<span>*</span></label>
            <input name="name" type="text" className="form-control" id="name" maxLength="50" onChange={ changeName } />
            {(name.length > 50) && (
              <div className="error-msg">
                <span className="material-symbols-outlined">
                  error
                </span>
                <p>最多50個字</p>
              </div>
            )}
          </div>

          <div className="custom-form-style mt-4">
            <label htmlFor="email">email<span>*</span></label>
            <input name="email" type="email" className="form-control" id="email" maxLength="50" onChange={ changeEmail } />
            {(email.length > 50) && (
              <div className="error-msg">
                <span className="material-symbols-outlined">
                  error
                </span>
                <p>最多50個字</p>
              </div>
            )}
          </div>

          <div className="custom-form-style mt-4">
            <label htmlFor="password">密碼<span>*</span></label>
            <div className="d-flex position-relative">
              <input name="password" type="password" className="form-control pe-5" id="password" minLength="8" onChange={ changePassword }
                pattern="\w*[A-Z]+\w*[0-9]+\w*[!@#%&_?]+\w*|\w*[A-Z]+\w*[!@#%&_?]+\w*[0-9]+\w*|\w*[0-9]+\w*[A-Z]+\w*[!@#%&_?]+\w*|\w*[0-9]+\w*[!@#%&_?]+\w*[A-Z]+\w*|\w*[!@#%&_?]+\w*[A-Z]+\w*[0-9]+\w*|\w*[!@#%&_?]+\w*[0-9]+\w*[A-Z]+\w*"
                title="特殊符號僅限!@#%&_?且不含空格" />
              <button className="btn position-absolute p-0 end-0 me-1 me-sm-3 align-self-center d-flex">
                <span className="material-symbols-outlined text-secondary h-100 w-100 p-1" style={{ fontVariationSettings: "'FILL' 1" }} onClick={ changeVisibility }>
                  visibility
                </span>
              </button>
            </div>
            <div className="d-flex mt-1">
              <span className="material-symbols-outlined fs-5 me-1" style={{ marginTop: "0.125rem"}} >
                error
              </span>
              <p>密碼需 8 位數以上，且至少包含<strong className="text-danger" >一個大寫英文字母、一個數字、一個特殊符號</strong></p>
            </div>
            <div className="d-flex">
              <span className="material-symbols-outlined fs-5 me-1" style={{ marginTop: "0.125rem"}}>
                error
              </span>
              <p>特殊符號僅限<strong className="text-danger"> !@#%&_? </strong>且不含空格</p>
            </div>
          </div>

          <div className="custom-form-style mt-4">
            <label htmlFor="role">身分<span>*</span></label>
            <select name="role" id="role" className="form-control" onChange={ changeRole }>
              <option value="">---請選擇---</option>
              <option value="學員">學員</option>
              <option value="講師">講師</option>
            </select>
          </div>

          <div className="mt-5">
            <button className="btn btn-dark fw-bold me-4" onClick={ handleRegister }>
              註冊
            </button>
            <Link className="btn border-dark text-dark" to="/">
              取消
            </Link>
          </div>
        </div>
      </div>
    </div>
  );    
}

export default Register;