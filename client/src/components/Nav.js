import React from "react";
import { Link, useNavigate } from "react-router-dom";
import NewAuthService from "../services/auth-service";

const Nav = ({ currentUser, setCurrentUser, setCourseData, setMyFavorite, setMyJourney }) => {
    const Navigate = useNavigate();
    const offcanvas = document.querySelector(".offcanvas");

    //登出
    const handleLogout = (e) => {
      // e.target.preventDefault(); //加了這個會無法登出
      NewAuthService.logout();
      setCurrentUser(NewAuthService.getCurrentUser());
      setCourseData([]); //清空上一個使用者的課程資料
      setMyFavorite([]);
      setMyJourney([]);
      window.alert("您已經成功登出 : )");
      offcanvas.classList.remove("show");
      Navigate("/"); //要加這個才會導回頁面
      window.location.reload(); //要加這個才能讓 offcanvas 開啟時的深色背景消失
    }

    //關閉 offcanvas
    const handleCloseOffcanvas = (e) => {
      e.target.preventDefault();
      offcanvas.classList.remove("show");
    }

    return (
        <div className="bg-light">
          <div className="container">
            <nav className="navbar navbar-expand navbar-light bg-light" style={{ height: "4rem" }}>
              <div className="collapse navbar-collapse justify-content-end justify-content-sm-start" id="navbarNav">
                <ul className="navbar-nav d-none d-sm-flex" style={{ fontSize: "0.95rem" }} >
                  <li className="nav-item d-flex">
                    <Link className="nav-link py-3 px-4" to="/">首頁</Link>
                  </li>
                  { !currentUser &&
                    <li className="nav-item d-flex">
                      <Link className="nav-link py-3 px-4" to="/register" >註冊</Link>
                    </li>
                  }
                  { !currentUser &&
                    <li className="nav-item d-flex">
                      <Link className="nav-link py-3 px-4" to="/login">登入</Link>
                    </li>
                  }
                  { currentUser &&
                    <li className="nav-item d-flex">
                      <Link onClick={ handleLogout } className="nav-link py-3 px-4" to="/">登出</Link>
                    </li> 
                  }
                  { currentUser &&               
                    <li className="nav-item d-flex">
                      <Link className="nav-link py-3 px-4" to="/profile">個人頁面</Link>
                    </li>
                  }
                  { currentUser &&                
                    <li className="nav-item d-flex">
                      <Link className="nav-link py-3 px-4" to="/course">我的課程</Link>
                    </li>
                  }
                  { currentUser && currentUser.data.role === "講師" &&               
                    <li className="nav-item d-flex">
                      <Link className="nav-link py-3 px-4" to="/postCourse">新增課程</Link>
                    </li>
                  }
                  { currentUser && currentUser.data.role === "學員" &&              
                    <li className="nav-item d-flex">
                      <Link className="nav-link py-3 px-4" to="/search">搜尋課程</Link>
                    </li>
                  }                
                </ul>

                {/* 手機板的 menu */}
                <div className="d-sm-none">
                  <button className="btn border border-dark border-1 rounded-1 d-flex flex-column justify-content-evenly align-items-center" id="offcanvasController" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" style={{ width: "40px", height: "30px" }}>
                    <div className="border-bottom border-1 border-dark" style={{ width: "120%", height: "1px" }}></div>
                    <div className="border-bottom border-1 border-dark" style={{ width: "120%", height: "1px" }}></div>
                    <div className="border-bottom border-1 border-dark" style={{ width: "120%", height: "1px" }}></div>
                  </button>
                </div>
            </div>
            </nav>
          </div>
          <div className="offcanvas offcanvas-end d-sm-none" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" data-bs-scroll="true" data-bs-backdrop="true" style={{ width: "375px" }}>
            <div className="offcanvas-header justify-content-end">
              <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav">
                <li className="nav-item d-flex">
                  <Link className="nav-link py-3 px-4 w-100" to="/" onClick={ handleCloseOffcanvas } >首頁</Link>
                </li>
                { !currentUser &&
                  <li className="nav-item d-flex">
                    <Link className="nav-link py-3 px-4 w-100" to="/register" onClick={ handleCloseOffcanvas } >註冊</Link>
                  </li>
                }
                { !currentUser &&
                  <li className="nav-item d-flex">
                    <Link className="nav-link py-3 px-4 w-100" to="/login" onClick={ handleCloseOffcanvas } >登入</Link>
                  </li>
                }
                { currentUser &&
                  <li className="nav-item d-flex">
                    <Link className="nav-link py-3 px-4 w-100" to="/" onClick={ handleLogout } >登出</Link>
                  </li> 
                }
                { currentUser &&               
                  <li className="nav-item d-flex">
                    <Link className="nav-link py-3 px-4 w-100" to="/profile" onClick={ handleCloseOffcanvas } >個人頁面</Link>
                  </li>
                }
                { currentUser &&                
                  <li className="nav-item d-flex">
                    <Link className="nav-link py-3 px-4 w-100" to="/course" onClick={ handleCloseOffcanvas } >我的課程</Link>
                  </li>
                }
                { currentUser && currentUser.data.role === "講師" &&               
                  <li className="nav-item d-flex">
                    <Link className="nav-link py-3 px-4 w-100" to="/postCourse" onClick={ handleCloseOffcanvas } >新增課程</Link>
                  </li>
                }
                { currentUser && currentUser.data.role === "學員" &&              
                  <li className="nav-item d-flex">
                    <Link className="nav-link py-3 px-4 w-100" to="/search" onClick={ handleCloseOffcanvas } >搜尋課程</Link>
                  </li>
                }                
              </ul>
            </div>
          </div> 
        </div>
    )
}

export default Nav;