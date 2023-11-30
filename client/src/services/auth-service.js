import axios from "axios";
const API_URL = "https://react-project-1-learning-system.onrender.com/api/user";

class AuthService {
    //登入
    login(email, password) {
        return axios.post(
            `${API_URL}/login`,
            { email, password }
        );
    }

    //登出
    logout() {
        localStorage.removeItem("user_data");
    }

    //註冊
    register(name, email, password, role) {
        return axios.post(
            `${API_URL}/register`,
            { name, email, password, role } //解構賦值
        );
    }

    //搜尋目前使用者
    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user_data"));
    }
}

const NewAuthService = new AuthService();
export default NewAuthService;