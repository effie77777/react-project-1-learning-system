import axios from "axios";
const API_URL = "https://react-project-1-learning-system.onrender.com/api/user";

class AuthService {
    login(email, password) {
        return axios.post(
            `${API_URL}/login`,
            { email, password }
        );
    }
    logout() {
        localStorage.removeItem("user_data");
    }
    register(name, email, password, role) {
        return axios.post(
            `${API_URL}/register`,
            { name, email, password, role } //解構賦值
        );
    }
    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user_data"));
    }
}

const NewAuthService = new AuthService();
export default NewAuthService;