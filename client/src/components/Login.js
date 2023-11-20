import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import NewAuthService from "../services/auth-service";

const Login = ({ setCurrentUser }) => {
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ errorMsg, setErrorMsg ] = useState(null);
    const [ successMsg, setSuccessMsg ] = useState(null);
    const Navigate = useNavigate();

    const changeEmail = (e) => {
      setEmail(e.target.value);
    }
    const changePassword = (e) => {
      setPassword(e.target.value);
    }

    //登入
    const handleLogin = (e) => {
      e.preventDefault();
      NewAuthService.login(email, password)
      .then((d) => {
          setErrorMsg(null);
          localStorage.setItem("user_data", JSON.stringify(d.data));
          setCurrentUser(NewAuthService.getCurrentUser());
          setSuccessMsg("登入成功 ! 將為您重新導向至個人頁面");
          setTimeout(() => {
            Navigate("/profile");
          }, 2000);
      })
      .catch((e) => {
          setErrorMsg(e.response.data);
      })
    }
    
    //切換密碼為顯示與不顯示
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
              <label htmlFor="email">email</label>
              <input name="email" type="email" className="form-control" id="email" maxLength="50" onChange={ changeEmail } />
            </div>

            <div className="custom-form-style mt-4">
              <label htmlFor="password">密碼</label>
              <div className="d-flex position-relative">
                <input name="password" type="password" className="form-control pe-5" id="password" minLength="8" onChange={ changePassword } title="特殊符號僅限!@#%&_?且不含空格" />
                <button className="btn position-absolute p-0 end-0 me-1 me-sm-3 align-self-center d-flex">
                  <span className="material-symbols-outlined text-secondary h-100 w-100 p-1" style={{ fontVariationSettings: "'FILL' 1" }} onClick={ changeVisibility }>
                    visibility
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-5">
              <button className="btn btn-dark fw-bold me-4" onClick={ handleLogin }>
                登入
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

export default Login;