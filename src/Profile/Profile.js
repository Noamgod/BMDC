import React, {Component} from 'react';
import './Profile.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css'
import {
    load_data_currentRequests,//Finished
    uploadImage,//Finished Also checked if he has the correct UUID
    getImage,//Finished
    load_data_setImagePath, //Finished
    load_data_singleUserDataByQuery,//Finished
    load_data_daysOfAttendance,//Finished
    load_data_daysInMonth, getUserAttendanceHistory//Finished
} from "../Db/DataBase";
import ScaleLoader from "react-spinners/HashLoader"
import icon from "../Images/userIcon2.png"
import ripple from "ripple-effects"
// import GetPercentage from "./percentage";
import {decrypt} from "../encryption";
import {cookies} from "../App";
import {getBar} from "../Components/Charts/Bar";

const  monthsInHebrew = [ 'אוגוסט', 'ספטמבר', 'אוקטובר','נובמבר', 'דצמבר', 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי'];


const requestStatus = {
    0: "טרם טופל", 1: "התקבלה", 2: "נדחה"
}
const statusColor = {
    0: "#eea816", 1: "green", 2: "red"
}

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            runAjax: true,
            imgLoading: true,
            loading: true,
            list: null,
            userProps: null,
            days_in_month: null,
            days_of_attendance: null,
            attendanceHistory: null,
            loadingAttendanceHistory: true,
            percent: 0,
            image: props.userProps != null ? getImage(props.userProps.email, props.userProps.password, this) : null
        }
    }

    handelImage = () => {
        this.setState({image: icon})
    }

    componentDidMount() {
        ripple('.btn')
    }


    render() {
        if (this.props.userProps == null) {
            window.location.replace("/");
            return null
        }

        if (this.state.runAjax) {
            if (cookies.get("login") != undefined && cookies.get("login") != null)
                load_data_singleUserDataByQuery(decrypt(JSON.parse(cookies.get('login')[0])), decrypt(JSON.parse(cookies.get('login')[1])), this);
            else
                load_data_singleUserDataByQuery(decrypt(JSON.parse(sessionStorage.getItem('e'))), decrypt(JSON.parse(sessionStorage.getItem('p'))), this);
            load_data_currentRequests(this.props.userProps.email, this.props.userProps.password, this);
            load_data_daysInMonth(this.props.userProps.email, this.props.userProps.password, this);
            load_data_daysOfAttendance(this.props.userProps.email, this.props.userProps.password, this);
            getUserAttendanceHistory(this.props.userProps.email, this.props.userProps.password, this);
            this.setState({runAjax: false});
        }

        if (this.state.loading) {
            return (<div className={"container-fluid justify-content-center mt-5 d-flex flex-row"}>
                <ScaleLoader color={"white"}/>
            </div>)
        }
        let info = this.state.userProps
        return (<>
            <div id={"profileBackground"}>
                <div className="modal fade" id="myModal" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        data-dismiss={"modal"}
                                        aria-label="Close"/>
                                <h4 className="modal-title text-center"> תמונת פרופיל</h4>
                            </div>
                            <div className="modal-body">
                                <div className={"d-flex flex-column"}>
                                    <form id={"formImage"}>
                                        <div className="mb-3">
                                            <label htmlFor="formFile" className="form-label">ניתן להעלות
                                                תמונת
                                                פרופיל באחד
                                                מן הפורמטים הבאים (jpeg, jpg, עד 10MB)
                                            </label>
                                            <input className="form-control" type="file"
                                                   formEncType={'multipart/form-data'}
                                                   name={'image'} id="formFile"
                                                   accept={"image/jpg, image/jpeg"}/>
                                        </div>
                                        <div className={"d-flex flex-row"}>
                                            <button type={"button"} className={"btn mx-1 btn-primary"}
                                                    data-bs-dismiss={"modal"}
                                                    data-dismiss={"modal"}
                                                    onClick={() => {
                                                        this.setState({imgLoading: true})
                                                        uploadImage(document.getElementById("formImage"), this.props.userProps.uuid, this, this.props.userProps.email, this.props.userProps.password)
                                                    }}
                                            >שמירה
                                            </button>
                                            <button type={"button"} id={"defaultImg"}
                                                    className={"btn mx-1 btn-primary"}
                                                    data-bs-dismiss="modal"
                                                    data-dismiss={"modal"}
                                                    onClick={() => {
                                                        load_data_setImagePath("defaultProfile.png", this.props.userProps.email, this.props.userProps.password)
                                                        this.setState({image: "https://chedvata.com/Images/defaultProfile.png"})
                                                    }}
                                            >ברירת מחדל

                                            </button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-bs-dismiss="modal"
                                        data-dismiss={"modal"}>סגור
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={"d-flex flex-column justify-content-around margin-top-responsive-sm"}>
                    <div id={"mainContainer"}
                         className={"container my-3 container-fluid d-flex flex-row p-2"}>
                        <div className={"innerContainer1 container container-sm m-auto  d-flex flex-column "}>
                            <div
                                className={"img-thumbnail rounded innerContainer2 row-cols-1 p-2 bg-white border mt-img rounded-4 bg-light shadow"}>
                                {this.getImage()}
                                <h3 id={"profileHeader"}
                                    className={" text-center"}> {info.first_name} {info.last_name}</h3>
                            </div>
                        </div>
                        <div className={"container d-flex flex-column"}>
                            <div id={"secondBox"}
                                 className={"row-cols-1 innerContainer2 container p-4"}>
                                <div data-toggle="tooltip"
                                     data-placement="top"
                                     title={"לחץ כדי להעתיק"}
                                     className={"my-2 infoBox p-3 container border-bottom border bg-white rounded-3 fw-bold"}>
                                    מייל: {info.email}
                                </div>
                                <div
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title={"לחץ כדי להעתיק"}
                                    className={"my-2 infoBox p-3 container border-bottom border bg-white rounded-3 fw-bold"}>
                                    ת"ז: {info.id}
                                </div>
                                <div
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title={"לחץ כדי להעתיק"}
                                    className={"my-2 infoBox p-3 container border-bottom bg-white rounded-3 fw-bold"}>
                                    מספר טלפון: {info.phone_number}
                                </div>

                                <div className={"percent-stats d-flex"}>
                                    <div id={"day-off-box"}
                                         className={"my-2 infoBox ms-2 p-3 container border-bottom bg-white rounded-3 fw-bold "}>
                                        ימי חופש
                                        נותרים: {this.state.userProps.day_off_counter}
                                    </div>
                                    <div id={"percent-box"}
                                         className={"my-2 infoBox me-2 p-3 container border-bottom bg-white rounded-3 fw-bold "}>
                                        אחוז נוכחות בשיעור:
                                        {this.calculatePresent()}
                                    </div>
                                </div>

                                <div
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title={"לחץ כדי להעתיק"}
                                    className={"my-2 infoBox p-3 container border-bottom bg-white rounded-3 fw-bold"}>
                                    {getStatus(info.admin)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"d-flex overflow-x-hide flex-column align-content-center text-center"}>
                        <div className={"display-5 mb-1 container text-white fw-bold"}>בקשות
                            נוכחיות
                        </div>
                        <div id={"requests"}
                             className={"requests mb-1 container border bg-white rounded border-dark overflow-auto shadow"}
                             style={{minHeight: "150px"}}>
                            {this.getList(info.id)}
                        </div>
                    </div>

                    <div className={"requests bg-white mx-auto container rounded mb-5 mt-3 "} style={{minHeight: "30vh"}} >
                        {getChart(this.state.loadingAttendanceHistory, this.state.attendanceHistory, Math.round(((this.state.days_in_month - this.state.days_of_attendance) / this.state.days_in_month) * 100))}
                    </div>
                </div>
            </div>
            <div>
                {/*<div className={"container-fluid"}>*/}
                {/*    <div className={"mx-2 d-flex flex-row justify-content-center statistics-container"}>*/}
                {/*        <div className={"my-5 rounded mx-5 svg-wrapper"}>*/}
                {/*            <GetPercentage loading={this.state.loading}*/}
                {/*                           text={Math.round(((this.state.days_in_month - this.state.days_of_attendance) / this.state.days_in_month) * 100) + "%"}*/}
                {/*                           header={"אחוז נוכחות בשיעור"}*/}
                {/*                           percent={Math.round(((this.state.days_in_month - this.state.days_of_attendance) / this.state.days_in_month) * 100)}*/}
                {/*                           id={"no1"}*/}
                {/*                           desc={<div><p className={"text-center"}>אחוז נוכחות בשיעור - אחוז הימים*/}
                {/*                               שהגעת לשיעורים בבוקר בחודש הזה. אם אינך נמצא בלפחות 75% מהשיעורים*/}
                {/*                               הבקשות שלך ליום חופש לא יאושרו.</p></div>}/>*/}
                {/*        </div>*/}
                {/*        <div className={"my-5 mx-5 rounded svg-wrapper"}>*/}
                {/*            <GetPercentage password={this.props.userProps.password}*/}
                {/*                           email={this.props.userProps.email} loading={this.state.loading} text={""}*/}
                {/*                           uuid={this.props.userProps.uuid} header={"אחוז נוכחות חודש שעבר"}*/}
                {/*                           percent={null} id={"no2"}*/}
                {/*                           desc={<div><p className={"text-center"}>כאן ניתן לראות את אחוז הנוכחות*/}
                {/*                               שלך בחודש האחרון, במידה ולה הייתה נוכח במצטבר מעל ל 75% הבקשות שלך*/}
                {/*                               תשלחנה אך הן יאושרו במקרי קיצון בלבד</p></div>}/>*/}
                {/*        </div>*/}
                {/*        <div className={"my-5 mx-5 rounded svg-wrapper"}>*/}
                {/*            <GetPercentage loading={this.state.loading} text={this.props.userProps.day_off_counter}*/}
                {/*                           header={"ימי חופש נותרים"}*/}
                {/*                           percent={Math.round(100 * this.props.userProps.day_off_counter / 11)}*/}
                {/*                           id={"no3"}*/}
                {/*                           desc={<div><p className={"text-center"}>בהוראת ראש הישיבה לכל תלמיד ישנם*/}
                {/*                               אחד עשר ימי חופשה בשנה, אתה יכול לבחור מתי נוח לך לקחת את ימי החופשה*/}
                {/*                               שלך. שים לב כי לא ניתן להעלו את ימי החופשה</p></div>}/>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}


            </div>
        </>);
    }

    getImage = () => {
        if (this.state.imgLoading) {
            return (<div className={"d-flex flex-row justify-content-center"}>
                <ScaleLoader/>
            </div>)
        } else {
            return (<img
                id={"profileImg"}
                data-bs-toggle="modal"
                data-bs-target="#myModal"
                className={"img rounded "} style={{maxWidth: "100%"}}
                src={this.state.image}
                alt={this.handelImage}
                onError={this.handelImage}/>)
        }
    }


    getList = () => {
        let arr = this.state.list
        if (arr.length == 0) {
            return (<div className={"d-flex justify-content-center text-danger display-4 text-center overflow-hidden"}>
                אין מידע
            </div>)
        }
        return (<ul>
            {arr.map((item) => (<div className={"li-reason d-flex flex-row justify-content-between"}>
                <li style={{
                    wordBreak: "break-all", whiteSpace: "normal"
                }}
                    key={item.date}>{item.reason === "" ? "אין סיבה" : item.reason}</li>
                <div className={"d-flex flex-row justify-content-between"}>
                    <div className={"mx-2"}>
                        {item.date}
                    </div>
                    <div
                        style={{color: statusColor[item.approve]}}> {requestStatus[item.approve]}
                    </div>
                </div>
            </div>))}
        </ul>);
    }


    calculatePresent() {
        if (!this.state.loading) {
            let percent = Math.round(((this.state.days_in_month - this.state.days_of_attendance) / this.state.days_in_month) * 100)
            let classNameForProgress;
            if (90 <= percent) {
                classNameForProgress = "progress-bar bg-success progress-bar-striped progress-bar-animated"
            } else if (75 <= percent) {
                classNameForProgress = "progress-bar progress-bar-striped progress-bar-animated bg-warning"
            } else {
                classNameForProgress = "progress-bar progress-bar-striped progress-bar-animated bg-danger"
            }

            return (<div className="progress">
                <div className={classNameForProgress} role="progressbar" style={{width: percent + "%"}}
                     aria-valuenow={percent} aria-valuemin="0"
                     aria-valuemax="100">{percent}%
                </div>
            </div>)
        } else {
            return <ScaleLoader color={"white"}/>
        }
    }
}

function getStatus(admin) {
    if (admin == "admin") {
        return (<span className={"text-danger"}>
            מנהל
        </span>)
    } else if (admin == "moderator") {
        return (<span className={"text-warning"}>
            מזכיר
        </span>)
    } else if (admin == "operator") {
        return (<span className={"rainbow-text"}>
עורך האתר        </span>)
    } else if (admin == "teacher") {
        return (<span className={"rainbow-text"}>
רב        </span>)
    } else if (admin == "graduated"){
        return (<span className={"rainbow-text"}>
בוגר        </span>)
    }else {
        return (<span>
            תלמיד
        </span>)
    }
}

function getChart(loading, data, currDatePercent) {

    if (loading) {
        return (<div className={"d-flex justify-content-center text-center m-auto"}>
            <ScaleLoader/>
        </div>)
    }
    //set data in spot this month to calculatePresent
    data[new Date().toLocaleString('en',{month: 'long'})] = currDatePercent;
    return (getBar({
            monthsInHebrew,
            datasets: [
                {
                    label: 'אחוז נוכחות',
                    data: data,
                    backgroundColor: 'rgba(54,162,235,0.62)',
                    borderColor: 'rgb(2,2,2)',
                    borderWidth: 1,
                    maintainAspectRatio: false,
                    responsive: true,
                },
            ],
        })
    )
}

