import axios from "axios";
const API_URL = "https://react-project-1-learning-system.onrender.com/api/course";

class CourseService {
    //學生註冊課程
    enrollCourse(courseId, studentId) {
        let token;
        if (localStorage.getItem("user_data")) {
            token = JSON.parse(localStorage.getItem("user_data")).token;
        } else {
            token = "";
        }
        return axios.post(
            `${ API_URL }/enroll/${ courseId }`,
            { studentId },
            { headers: {Authorization: token } }
        );
    }
    
    //學生查詢自己註冊的全部課程
    getEnrolledCourse(_id) {
        let token;
        if (localStorage.getItem("user_data")) {
            token = JSON.parse(localStorage.getItem("user_data")).token;
        } else {
            token = "";
        }
        return axios.get(
            `${API_URL}/search/student/${ _id }`,
            { headers: { Authorization: token } }
        );
    }

    //學生輸入課程名稱 (按搜尋按鈕) 來搜尋課程
    searchCourse(title) {
        let token;
        if (localStorage.getItem("user_data")) {
            token = JSON.parse(localStorage.getItem("user_data")).token;
        } else {
            token = "";
        }
        return axios.get(
            `${ API_URL }/searchByTitle/${ title }`,
            { headers: { Authorization: token } }
        );
    }

    //學生輸入課程 id (點選關鍵字清單) 來搜尋課程
    searchCourseById(_id) {
        let token;
        if (localStorage.getItem("user_data")) {
            token = JSON.parse(localStorage.getItem("user_data")).token;
        } else {
            token = "";
        }
        return axios.get(
            `${ API_URL }/searchById/${ _id }`,
            { headers: { Authorization: token } }
        );
    }    

    //學生搜尋全部課程
    searchAllCourses() {
        let token;
        if (localStorage.getItem("user_data")) {
            token = JSON.parse(localStorage.getItem("user_data")).token;
        } else {
            token = "";
        }
        return axios.get(
            `${ API_URL }/search`,
            { headers: { Authorization: token } }
        );
    }
    
    //學生新增學習日誌
    postJourney(studentId, journeyTitle, journeyContent, selectCourse=null) {
        let token;
        if (localStorage.getItem("user_data")) {
            token = JSON.parse(localStorage.getItem("user_data")).token;
        } else {
            token = "";
        }
        return axios.post(
            `${ API_URL }/postJourney/${ studentId }`,
            { journeyTitle, journeyContent, selectCourse },
            { headers: { Authorization: token }}
        )
    }

    //學生搜尋自己全部的學習日誌
    getMyJourney(studentId) {
        let token;
        if (localStorage.getItem("user_data")) {
            token = JSON.parse(localStorage.getItem("user_data")).token;
        } else {
            token = "";
        }
        return axios.get(
            `${ API_URL }/journey/${ studentId }`,
            { headers: { Authorization: token} }
        )
    }

    //學生更改我的最愛清單，包括新增和移除
    changeFavorite(studentId, courseId) {
        let token;
        if (localStorage.getItem("user_data")) {
            token = JSON.parse(localStorage.getItem("user_data")).token;
        } else {
            token = "";
        }
        return axios.post(
            `${ API_URL }/favorite/${studentId}`,
            { courseId },
            { headers: { Authorization: token } }
        );
    }

    //學生搜尋全部我的最愛課程
    getMyFavorite(_id) {
        let token;
        if (localStorage.getItem("user_data")) {
            token = JSON.parse(localStorage.getItem("user_data")).token;
        } else {
            token = "";
        }
        return axios.get(
            `${ API_URL }/favorite/${ _id }`,
            { headers: { Authorization: token } }
        );
    }      

    //講師查詢自己開設的全部課程
    getCourseList(_id) {
        let token;
        if (localStorage.getItem("user_data")) {
            token = JSON.parse(localStorage.getItem("user_data")).token;
        } else {
            token = "";
        }
        return axios.get(
            `${ API_URL }/search/instructor/${ _id }`,
            { headers: { Authorization: token } }
        );
    }    

    //講師新增課程
    postCourse(title, description, chapters, price) {
        let token;
        if (localStorage.getItem("user_data")) {
            token = JSON.parse(localStorage.getItem("user_data")).token;
        } else {
            token = "";
        }
        return axios.post(
            `${ API_URL }/post`,
            { title, description, chapters, price },
            { headers: { Authorization: token } }
        );
    }

    //講師編輯課程 (向 DB 拿目前的資料)
    getAndEditCourse(_id) {
        let token;
        if (localStorage.getItem("user_data")) {
            token = JSON.parse(localStorage.getItem("user_data")).token;
        } else {
            token = "";
        }
        return axios.get(
            `${ API_URL }/edit/${ _id }`,
            { headers: { Authorization: token } }
        );
    }

    //講師編輯課程 (將新資料存進 DB )
    editAndPostCourse(_id, title, description, chapters, price) {
        let token;
        if (localStorage.getItem("user_data")) {
            token = JSON.parse(localStorage.getItem("user_data")).token;
        } else {
            token = "";
        }
        return axios.post(
            `${ API_URL }/edit/${ _id }`,
            { title, description, chapters, price },
            { headers: { Authorization: token } }
        )
    }

    //講師搜尋學生給的回饋
    getStudentsFeedback(_id) {
        let token;
        if (localStorage.getItem("user_data")) {
            token = JSON.parse(localStorage.getItem("user_data")).token;
        } else {
            token = "";
        }
        return axios.get(
            `${ API_URL }/instructor/feedback/${ _id }`,
            { headers: { Authorization: token } }
        );
    }
}

const NewCourseService = new CourseService();
export default NewCourseService;