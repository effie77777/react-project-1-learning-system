import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/js/bootstrap";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CoursesList from "./pages/CoursesList";
import Detail from "./pages/Detail";
import PostCourse from "./pages/PostCourse";
import EditCourse from "./pages/EditCourse";
import Search from "./pages/Search";
import PostJourney from "./pages/PostJourney";
import NotFound from "./pages/NotFound";
import NewAuthService from "./services/auth-service";

const App = () => {
  const [ currentUser, setCurrentUser] = useState(NewAuthService.getCurrentUser());
  const [ courseData, setCourseData ] = useState([]);
  const [ currentSearch, setCurrentSearch ] = useState([]);
  const [ currentEdited, setCurrentEdited ] = useState(null);
  const [ myFavorite, setMyFavorite ] = useState([]);
  const [ allCourses, setAllCourses ] = useState([]);
  const [ myJourney, setMyJourney] = useState([]);

  return (
    <div>
      <Nav currentUser = { currentUser } setCurrentUser = { setCurrentUser } setCourseData = { setCourseData } setMyFavorite = { setMyFavorite } setMyJourney = { setMyJourney } setCurrentSearch = { setCurrentSearch } />
      <Routes>
        <Route path = "/" element = { <Home /> }></Route>
        <Route path = "/register" element = { <Register /> }></Route>
        <Route path = "/login" element = { <Login setCurrentUser = { setCurrentUser } /> }></Route>
        <Route exact path = "/profile" element = { <Profile currentUser = { currentUser } setCourseData = { setCourseData } setMyFavorite = { setMyFavorite } setAllCourses = { setAllCourses } myJourney = { myJourney } setMyJourney = { setMyJourney } />}></Route>
        <Route exact path = "/coursesList" element = { <CoursesList currentUser = { currentUser } courseData = { courseData } setCourseData = { setCourseData } setCurrentEdited = { setCurrentEdited } myFavorite = { myFavorite } setMyFavorite = { setMyFavorite } allCourses = { allCourses } setCurrentSearch = { setCurrentSearch } /> }></Route>
        <Route exact path = "/detail" element = { <Detail currentUser = { currentUser } courseData = { courseData } currentSearch = { currentSearch } setCurrentSearch = { setCurrentSearch } /> }></Route>
        <Route exact path = "/postCourse" element = { <PostCourse currentUser = { currentUser} /> }></Route>
        <Route exact path = "/editCourse" element = { <EditCourse currentUser = { currentUser} currentEdited = { currentEdited } setCurrentEdited = { setCurrentEdited } /> }></Route>
        <Route exact path = "/search" element = { <Search currentUser = { currentUser } courseData = { courseData } setCourseData = { setCourseData } myFavorite = { myFavorite } setMyFavorite = { setMyFavorite } allCourses = { allCourses } setAllCourses = { setAllCourses } setCurrentSearch = { setCurrentSearch } /> }></Route>
        <Route exact path = "/postJourney" element = { <PostJourney currentUser = { currentUser } courseData = { courseData } setCourseData = { setCourseData } myJourney = { myJourney } setMyJourney = { setMyJourney } /> }></Route>
        <Route path = "/*" element = { <NotFound /> } ></Route>
      </Routes>
    </div>
  )
}

export default App;