import React, {lazy} from "react";
import {
    get_student_count, //finished but doesn't check if isUser
    load_data_singleUserDataByQuery //Finished
} from "./Db/DataBase";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Cookies from 'universal-cookie';
import './App.css';
import SendRequest from './SendRequest/SendRequest';
import CurrentRequests from "./Current Requests/CurrentRequests";
import Events from "./Events/Events";
import LogIn from "./Login/LogIn";
import MainPage from "./MainPage/MainPage";
import Profile from "./Profile/Profile";
import Students from "./Students/Students"
import Attendance from "./Nochcut/Nochcut"
import Signup from "./Sign Up/Signup";
import Netunim from "./Netunim/Netunim";
import {decrypt} from "./encryption";
import {ScaleLoader} from "react-spinners";
import Tickets from "./Tickets/Tickets";
import Logs from "./Logs/Logs";

export const cookies = new Cookies()

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            userProps: this.getUserProps(),
            studentCount: get_student_count(this),
            allUserAttendanceHistory:null,
        }
    }

    render() {
        if (this.state.loading) {

            return (
                <div className="m-auto">
                    <ScaleLoader
                        color={"#0017a8"}
                    />
                </div>
            )
        }  else {
            return (
                <Router>

                    {this.getStarterPage()}
                    <Routes>
                        <Route path={"/profile"} element={<Profile userProps={this.state.userProps}/>}/>
                        <Route path={"/send-request"} element={<SendRequest userProps={this.state.userProps}/>}/>
                        <Route path={"/all-requests"} element={<CurrentRequests studentCount={this.state.studentCount}
                                                                                userProps={this.state.userProps}/>}/>
                        <Route path={"/events"} element={<Events userProps={this.state.userProps}/>}/>
                        <Route path={"/issues"} element={<Tickets userProps={this.state.userProps}/>}/>
                        <Route path={"/attendance"} element={<Attendance userProps={this.state.userProps}/>}/>
                        <Route path={"/students"} element={<Students userProps={this.state.userProps}/>}/>
                        <Route path={"/data"} element={<Netunim userProps={this.state.userProps} that={this}/>}/>
                        <Route path={"/sign-up"} element={<Signup userProps={this.state.userProps} that={this}/>}/>
                        <Route path={"*"} element={this.state.userProps == null ? <LogIn that={this}/> :
                            <Profile userProps={this.state.userProps}/>}/>
                        <Route path={"/logs"} element={<Logs userProps={this.state.userProps}/>}/>
                    </Routes>

                </Router>
            );
        }
    }

    getStarterPage = () => {
        if (this.state.userProps == null) {
            return null
        } else {
            return <MainPage userProps={this.state.userProps}/>
        }
    }
    getUserProps = () =>{
        if (cookies.get("login")!=undefined && cookies.get("login")!=null){
            return load_data_singleUserDataByQuery(decrypt(JSON.parse(cookies.get('login')[0])), decrypt(JSON.parse(cookies.get('login')[1])), false);
        } else if (sessionStorage.hasOwnProperty('e') && sessionStorage.hasOwnProperty('p')) {
            return load_data_singleUserDataByQuery(decrypt(JSON.parse(sessionStorage.getItem('e'))), decrypt(JSON.parse(sessionStorage.getItem('p'))), false);
        } else {
            return null;
        }
    }
}

export default App;
