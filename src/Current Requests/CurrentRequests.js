import React, {Component} from 'react';
import "./CurrentRequests.css"
import ripple from "ripple-effects"
import {
        load_data_allRequestsByQuery, //finishedY
        load_data_deleteRequest, //finished
        sendMail //finished but has the same problem as the other email issue where you can change the values of to and from (not super important but still needs to be fixed when we have time)
} from "../Db/DataBase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.css"
import ScaleLoader from "react-spinners/HashLoader";
import {updateRequest} from "./UpdateRequest";

const requestStatus = {
    0: "טרם טופל..",
    1: "התקבלה",
    2: "נדחה"
}
const statusColor = {
    0: "#eea816",
    1: "green",
    2: "red"
}



export default class CurrentRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            runAjax: true,
            dayOffHash: null,
            absentsOnDate: null,
            list: null,
            userProps: props.userProps,
            date: null,
            input: null,
            allRequests: false,
            pendingOnly: false,
            update: false,
            reasonList: [],
            allPercent: null,
        }
    }

    componentDidMount() {
        ripple('.btn')
    }
//
    studentCount = this.props.studentCount

    render() {
        if (this.props.userProps == null){
            window.location.replace("/");
        }

        return (
            <div>
                {this.denyRequestModal()}
                <div id={"headerDiv"}
                     className={"d-flex bg-white margin-top-responsive-sm flex-column border border-dark pt-3 pe-5 pb-1 shadow"}>
                    <div className={"h5 text-danger"}>{adminTitle(this.state.userProps.admin)}</div>
                    <div className={"d-flex flex-row"}>
                        <input type={"input"} placeholder={"חפש שם פרטי או סיבה"} id={"searchInput"}
                               className={"rounded row-cols-2 border-black shadow w-responsive "}/>
                        <button onClick={(event) => {
                            event.currentTarget.disabled = true;
                            event.currentTarget.className = "spinner-grow circle text-info mx-1"
                            event.currentTarget.innerHTML = ""
                            let e;
                            if ((e = document.getElementById("searchInput").value.trim()) === "" || e == null) {
                                this.setState({input: null, runAjax: true})
                            } else {
                                this.setState({input: e, runAjax: true});
                            }


                            setTimeout(() => {
                                document.getElementById("searchButton").disabled = false
                                document.getElementById("searchButton").className = "searchButton btn btn-primary shadow"
                                document.getElementById("searchButton").innerText = "חפש"
                            }, 1400)

                        }} type={"button"} id={"searchButton"} className={"searchButton btn btn-primary shadow"}>
                            חפש
                        </button>
                        <div id={"dateContainer"} className={"h-auto mx-2 rounded border"}>
                            <DatePicker selected={this.state.date}
                                        onChange={(date) => {
                                            this.setState({date: new Date(date)})
                                        }}
                                        className={"pickerInput shadow rounded"}
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="סינון לפי תאריך"
                                        isClearable={false}/>
                        </div>
                    </div>
                    <div className={"d-flex flex-column"}>
                        {this.getAllRequestsCheckBox()}
                        <div className={"form-check form-switch d-flex flex-row"}>
                            <label className={"form-check-label"} htmlFor={"checkBoxRejected"}>טרם טופל</label>
                            <input type={"checkbox"} className={"form-check-input"} onChange={(e) => {
                                this.setState({pendingOnly: e.target.checked, runAjax: true})
                                e.target.disabled = true
                                e.target.className = "form-check-input disabled"
                                setTimeout(() => {
                                    document.getElementById("checkBoxRejected").disabled = false;
                                    document.getElementById("checkBoxRejected").className = "form-check-input";
                                }, 1000)
                            }} id={"checkBoxRejected"}/>
                        </div>
                        <div>
                            <button id={"resetButton"} type={"button"} className={"btn btn btn-secondary"}
                                    onClick={(e) => {
                                        document.getElementById("searchInput").value = null;
                                        if (this.state.userProps.admin == "admin" || this.state.userProps.admin == "operator") {
                                            document.getElementById("checkBoxallRequests").checked = false;
                                        }
                                        document.getElementById("checkBoxRejected").checked = false;
                                        this.setState({
                                            date: null,
                                            pendingOnly: false,
                                            allRequests: false,
                                            input: null,
                                            runAjax: true
                                        })
                                        e.currentTarget.disabled = true
                                        e.currentTarget.className = "spinner-grow circle text-secondary mx-1 "
                                        e.currentTarget.innerHTML = ""
                                        setTimeout(() => {
                                            document.getElementById("resetButton").disabled = false;
                                            document.getElementById("resetButton").className = "btn btn btn-secondary";
                                            document.getElementById("resetButton").innerText = "אפוס";
                                        }, 1000)
                                    }}>איפוס
                            </button>
                        </div>
                    </div>
                </div>
                <ul className={"list-group overflow-y-scroll overflow-x-hide"}>
                    {this.runAjax()}
                    {this.getList()}
                </ul>
            </div>
        );
    }

    getAllRequestsCheckBox = () => {
        if (this.state.userProps.admin == "admin" || this.state.userProps.admin == "operator") {
            return (
                <div className={"form-check form-switch d-flex flex-row"}>
                    <label className={"form-check-label"} htmlFor={"checkBoxallRequests"}>כל הבקשות</label>
                    <input type={"checkbox"} className={"form-check-input"} onChange={(e) => {
                        this.setState({allRequests: e.target.checked, date: null, runAjax: true})
                        e.target.disabled = true
                        e.target.className = "form-check-input disabled"
                        setTimeout(() => {
                            document.getElementById("checkBoxallRequests").disabled = false;
                            document.getElementById("checkBoxallRequests").className = "form-check-input";
                        }, 1000)
                    }} id={"checkBoxallRequests"}/>
                </div>
            )
        } else return null
    }

    runAjax = () => {
        if (!this.state.runAjax) {
            return
        }
        let info = this.props.userProps
        const formattedDate = formatDate(this.state.date);
        let text= this.state.input
            load_data_allRequestsByQuery(info.email, info.password, formattedDate, text, this.state.allRequests, this)
        this.setState({runAjax: false})

    }

    getList = () => {
        if (this.state.loading) {
            return (
                <div className={"mx-auto position-absolute margin-top-responsive"}>
                    <ScaleLoader color={"white"}/>
                </div>
            )
        } else
            return (this.printList())
    }
    printList = () => {
        let info = this.props.userProps
        const dayOffHash = this.state.dayOffHash
        const dateHash = this.state.absentsOnDate
        const allPercentHash = this.state.allPercent;
        let list = this.state.list
        if (info.admin == "student" || info.admin == "moderator") {
            if (this.state.pendingOnly) {
                list = list.filter((x) => {
                    return (x.approve == 0)
                })
            }
        } else {
            if (this.state.pendingOnly) {
                list = list.filter((x) => {
                    if (dayOffHash.get(x.uuid)) {
                        return (x.approve == 0 && !(dayOffHash.get(x.uuid)[0] < 1 && x.approve == 0))
                    }
                })
            } else {
                list = list.filter((x) => {
                    if (dayOffHash.get(x.uuid)) {
                        return !(dayOffHash.get(x.uuid)[0] < 1 && x.approve == 0)
                    }
                })
            }
        }
        if (list.length === 0) {
            return (
                <div className={"d-flex justify-content-center text-danger display-4 text-center overflow-hidden"}>
                    אין מידע
                </div>
            )
        }
        return (
            <ul className={"list-group"}>
                {list.map((item, index) => (
                    <li className={"d-flex flex-row list-group-item " + (index % 2 === 0 ? "bg-lightgrey" : "")}>
                        <ul className={"d-flex flex-column"} style={{width: "90%"}}>
                            {this.getRequestName(item.first_name, item.last_name)}
                            <li>{<label style={{fontWeight: "bold"}}>ימים שנותרו: </label>} {dayOffHash.get(item.uuid)[0]}
                            </li>
                            <li style={{
                                wordBreak: "break-all",
                                whiteSpace: "normal"
                            }
                            }><label style={{fontWeight: "bold"}}>סיבה: </label> {item.reason}</li>
                            <li><label style={{fontWeight: "bold"}}>תאריך: </label> {item.date}</li>
                            <li className={allPercentHash.get(item.uuid) >75?"text-success":"text-danger"}><label style={{fontWeight: "bold"}}>נוכחות בחודש האחרון: </label> {allPercentHash.get(item.uuid)}% </li>
                            {this.getStatistics(item.date, dateHash)}
                        </ul>
                        {this.getAdminButtons(item, dayOffHash)}
                    </li>
                ))}
            </ul>
        );
    }

    getRequestName = (fn, ln) => {
        if (this.state.userProps.admin == "admin" || this.state.userProps.admin == "operator") {
            return (
                <li>
                    <label style={{fontWeight: "bold"}}>בקשה של: </label> {fn + " " +ln}
                </li>
            );

        } else {
            return null
        }
    }
    getStatistics = (date, dateHash) => {
        if (this.state.userProps.admin == "admin" || this.state.userProps.admin == "operator")
            return (
                <>
                    <li><label style={{fontWeight: "bold"}}>מספר
                        נעדרים: </label> {dateHash.get(date) == null ? "0" : dateHash.get(date)} </li>
                    <il>
                        <div className="progress bg-secondary w-50" id={"outerBar"}>
                            <div className="progress-bar shadow text-break" id={"innerBar"} role="progressbar"
                                 style={this.getPercent(dateHash.get(date)) >= 90 ? {
                                     width: this.getPercent(dateHash.get(date)) + "%",
                                     backgroundColor: "#198754"
                                 } : this.getPercent(dateHash.get(date)) >= 85 ? {
                                     width: this.getPercent(dateHash.get(date)) + "%",
                                         backgroundColor: "#ffae00"
                                 } : {width: this.getPercent(dateHash.get(date)) + "%", backgroundColor: "#dc3545"}}
                                 aria-valuemin="0"
                                 aria-valuemax="100">{this.getPercent(dateHash.get(date))}%
                            </div>
                        </div>
                    </il>
                </>
            );
        else return null
    }

    getAdminButtons = (item, dayOffHash) => {
        if (this.state.userProps.admin == "admin" || this.state.userProps.admin == "operator") {
            return (
                <div className={"flex-column justify-content-end px-1"}>
                    {this.getAcceptRejectButtons(item.approve, item.id, item.date.toLocaleString(), dayOffHash.get(item.uuid)[1])}
                    <span className={"align-text-bottom"}
                          style={{color: statusColor[item.approve]}}>
                              {requestStatus[item.approve]}</span>
                </div>
            );
        } else if (item.approve == 0) {
            return (
                <div className={"d-flex flex-column"}>
                    <button className={"btn btn-danger"} onClick={() => {
                        load_data_deleteRequest(this.props.userProps.email, this.props.userProps.password, item.date)
                        this.setState({update: !this.state.update, runAjax: true})
                    }
                    }>בטל
                    </button>
                    <span className={"my-1"} style={{color: statusColor[item.approve]}}>
                               {requestStatus[item.approve]}</span>
                </div>
            );
        } else return (
            <div className={"flex-column justify-content-end"}>
                <span className={"align-text-bottom"} style={{color: statusColor[item.approve]}}>
                               {requestStatus[item.approve]}</span>
            </div>
        );
    }

    getPercent = (count) => {
        if (count == null) {
            count = 0
        }
        return Math.round((((this.studentCount.value - count) / this.studentCount.value) * 100));

    }

    getAcceptRejectButtons = (approve, id, date, email) => {
        if (approve == 1 || approve == 2) {
            return (
                <div id={"buttonContainer"} className={"flex-row justify-content-evenly"}>
                    <button onClick={() => {
                        let mailInfo = {
                            email: this.props.userProps.email,
                            password: this.props.userProps.password,
                            to: email,
                            subject:"בקשת שחרורך מבוטלת!",
                            msg: "שים לב!! בקשתך בתאריך " + `${date}` + " מבוטלת ונשלחה לחישוב מחדש על ידי אמנון\n כרגע בתאריך זה עליך להתייצב בישיבה כרגיל עד להודעה אחרת מהמערכת. המשך יום מקסים "
                        }
                        updateRequest(this.props.userProps.email, this.props.userProps.password, date, id, 0, mailInfo)
                        this.setState({runAjax: true})
                    }} className={"sbutton btn btn-danger text-center "}>
                        איתחול
                    </button>
                </div>)
        } else return (
            <div id={"buttonContainer"} className={"flex-row justify-content-evenly"}>
                <button onClick={() => {
                    let msg = " בקשתך בתאריך " + `${date}` + " אושרה. המשך יום מקסים "
                    let mailInfo = {
                        email: this.props.userProps.email,
                        password: this.props.userProps.password,
                        to: email,
                        subject:"בקשת שחרורך אושרה!",
                        msg: msg
                    }
                    updateRequest(this.props.userProps.email, this.props.userProps.password, date, id, 1, mailInfo)
                    this.setState({runAjax: true})
                }} className={"sbutton btn btn-success text-center "}>
                    קבל
                </button>
                <button onClick={() => {
                    this.setState({reasonList: [date, id, approve, email]})
                }}  data-toggle="modal" data-target="#reasonForDenyModal" className={"sbutton btn btn-danger "}>
                    דחה
                </button>
            </div>
        );
    }


    denyRequestModal() {
        if(this.state.userProps.admin == "admin" || this.state.userProps.admin == "operator") {
            return(
                <div className="modal fade" id="reasonForDenyModal" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">הודעת מערכת</h5>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="deny-reason" className="col-form-label">הוספת סיבה</label>
                                        <textarea className="form-control" id="deny-reason" placeholder={"המערכת לא ראתה לנכון לאפשר לך לצאת"}/>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">ביטול</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal"  onClick={() => {
                                    let reason = document.getElementById("deny-reason").value
                                    if(reason.trim()===""){
                                        reason = "המערכת לא ראתה לנכון לאפשר לך לצאת"
                                    }
                                    let mailInfo = {
                                        email: this.props.userProps.email,
                                        password: this.props.userProps.password,
                                        to: this.state.reasonList[3],
                                        subject: "בקשת שחרורך נדחתה",
                                        msg: "בקשתך בתאריך " + `${this.state.reasonList[0]}` + " נדחתה. הסיבה: " + reason + ". המשך יום מקסים "
                                    }
                                    updateRequest(this.props.userProps.email, this.props.userProps.password, this.state.reasonList[0], this.state.reasonList[1], 2, mailInfo)
                                    this.setState({runAjax: true})
                                    document.getElementById("deny-reason").value = ""
                                }}>שליחה
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

function adminTitle(admin) {
    if (admin == "admin" || admin == "operator") {
        return ("Admin Page");
    } else {
        return null
    }
}

function formatDate(date) {
    if (date == null)
        return null
    else {
        return (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate())
    }
}

