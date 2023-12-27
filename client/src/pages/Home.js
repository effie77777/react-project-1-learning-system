import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {

  // 因為 server 太久沒有接受到請求會自動暫時關閉，再次開啟會需要一些時間，就會發生 lag 的情況。所以當使用者進到首頁就先送一個請求給 server
  useEffect(() => {
    const url = "https://react-project-1-learning-system.onrender.com/";
    axios.get(url);
  }, []);

    return (
        <main>
          <div className="container py-4">
            <div className="px-5 py-4 mb-4 bg-light rounded-3">
              <div className="container-fluid py-5">
                <h1 className="display-5 fw-bold mb-4">Learning System</h1>
                <p className="col-md-8 fs-5 mb-0">
                  哈囉，您好！歡迎使用我們的學習系統！這個系統提供講師開課及學員註冊課程，我們的講師人數及課程數量均在不斷增加中，加入會員的手續快速且免費，所以還等什麼呢？期待趕快與您見面 : )
                </p>
              </div>
            </div>
    
            <div className="row align-items-md-stretch">
              <div className="col-md-6 mb-4">
                <div className="h-100 p-5 text-white bg-dark rounded-3 d-flex flex-column justify-content-between">
                  <h2 className="fs-3 fw-bold mb-4">身為學員</h2>
                  <p className="mb-4">
                    您可以從眾多課程中選擇您喜歡的來註冊，我們的學習系統不限制課程類別，目前已順利開設的課程種類橫跨各領域，不論您在尋找什麼種類的課程，都歡迎來我們這裡看看，說不定能挖到寶唷！
                  </p>
                  <Link className="btn btn-outline-light mb-0 mt-auto" type="button" style={{ width: "fit-content" }} to="/register">
                    帶我去註冊！
                  </Link>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="h-100 p-5 bg-light border rounded-3 d-flex flex-column justify-content-between">
                  <h2 className="fs-3 fw-bold mb-4">身為講師</h2>
                  <p className="mb-4">
                    擁有技能卻無處發揮嗎？我們深信每個人都有擅長的地方，但嶄露身手的機會卻是可遇不可求。所以歡迎擁有各式各樣知識技術的您加入成為講師，讓我們的學習系統成為您的舞台！
                  </p>
                  <Link class="btn btn-outline-dark" type="button" style={{ width: "fit-content" }} to="/register">
                    帶我去註冊！
                  </Link>
                </div>
              </div>
            </div>
    
            <footer className="pt-3 mt-5 text-muted border-top">
              &copy; 2023 Effie
            </footer>
          </div>
        </main>
    );
}

export default Home;