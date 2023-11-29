import React from "react";
import { Link, useNavigate } from "react-router-dom";
import NewAuthService from "../services/auth-service";

const Nav = ({ currentUser, setCurrentUser, setCourseData, setMyFavorite, setMyJourney, setCurrentSearch }) => {
    const Navigate = useNavigate();

    //登出
    const handleLogout = () => {
      NewAuthService.logout();
      setCurrentUser(NewAuthService.getCurrentUser());
      setCourseData([]);
      setMyFavorite([]);
      setMyJourney([]);
      setCurrentSearch([]);
      localStorage.clear();
      window.alert("您已經成功登出 : )");
      handleCloseOffcanvas();
      Navigate("/");
    }

    //關閉 offcanvas
    const handleCloseOffcanvas = () => {
      let btn = document.querySelector(".btn-close");
      btn.click();
      window.scrollTo({ // 這個是專門因應「登出前就已經在 Homepage」的情形
        top: "0",
        behavior: "instant",
      });
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
                      <Link className="nav-link py-3 px-4" to="/coursesList">我的課程</Link>
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
                  <button className="btn border border-dark border-1 rounded-1 d-flex flex-column justify-content-evenly align-items-center" id="offcanvasController" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" style={{ width: "40px", height: "30px", marginRight: "1.5rem" }}>
                    <div className="border-bottom border-1 border-dark" style={{ width: "120%", height: "1px" }}></div>
                    <div className="border-bottom border-1 border-dark" style={{ width: "120%", height: "1px" }}></div>
                    <div className="border-bottom border-1 border-dark" style={{ width: "120%", height: "1px" }}></div>
                  </button>
                </div>
            </div>
            </nav>
          </div>
          <div className="offcanvas offcanvas-end d-sm-none" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" data-bs-scroll="true" data-bs-backdrop="true" style={{ width: "375px" }}>
            <div className="offcanvas-header justify-content-end pb-0">
              <button type="button" className="btn btn-close text-reset bg-transparent border-0 p-2 me-2 text-dark-gray" data-bs-dismiss="offcanvas" aria-label="Close" style={{fontSize: "2rem"}}>×</button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav fs-5 fw-bold text-dark-gray">
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
                    <Link className="nav-link py-3 px-4 w-100" to="/coursesList" onClick={ handleCloseOffcanvas } >我的課程</Link>
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