import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Course from "./components/Course";
import PostCourse from "./components/PostCourse";
import EditCourse from "./components/EditCourse";
import Search from "./components/Search";
import PostJourney from "./components/PostJourney";
import NewAuthService from "./services/auth-service";

const App = () => {
  const [ currentUser, setCurrentUser] = useState(NewAuthService.getCurrentUser());
  const [ courseData, setCourseData ] = useState([]);
  const [ currentEdited, setCurrentEdited ] = useState(null);
  const [ myFavorite, setMyFavorite ] = useState([]);
  const [ allCourses, setAllCourses ] = useState([]);
  const [ myJourney, setMyJourney] = useState([]);

  return (
    <div>
      <Nav currentUser = { currentUser } setCurrentUser = { setCurrentUser } setCourseData = { setCourseData } setMyFavorite = { setMyFavorite } setMyJourney = { setMyJourney } />
      <Routes>
        <Route exact path = "/react-project-1-learning-system/" element = { <Home /> }></Route>
        <Route exact path = "/react-project-1-learning-system/register" element = { <Register /> }></Route>
        <Route path = "/react-project-1-learning-system/login" element = { <Login setCurrentUser = { setCurrentUser } /> }></Route>
        <Route exact path = "/profile" element = { <Profile currentUser = { currentUser } setCourseData = { setCourseData } setMyFavorite = { setMyFavorite } setAllCourses = { setAllCourses } myJourney = { myJourney } setMyJourney = { setMyJourney } />}></Route>
        <Route exact path = "/course" element = { <Course currentUser = { currentUser } courseData = { courseData } setCourseData = { setCourseData } setCurrentEdited = { setCurrentEdited } myFavorite = { myFavorite } setMyFavorite = { setMyFavorite } allCourses = { allCourses } /> }></Route>
        <Route exact path = "/postCourse" element = { <PostCourse currentUser = { currentUser} /> }></Route>
        <Route exact path = "/editCourse" element = { <EditCourse currentUser = { currentUser} currentEdited = { currentEdited } setCurrentEdited = { setCurrentEdited } /> }></Route>
        <Route exact path = "/search" element = { <Search currentUser = { currentUser } courseData = { courseData } setCourseData = { setCourseData } myFavorite = { myFavorite } setMyFavorite = { setMyFavorite } allCourses = { allCourses } setAllCourses = { setAllCourses } /> }></Route>
        <Route exact path = "/postJourney" element = { <PostJourney currentUser = { currentUser } courseData = { courseData } setCourseData = { setCourseData } myJourney = { myJourney } setMyJourney = { setMyJourney } /> }></Route>
      </Routes>
    </div>
  )
}

export default App;