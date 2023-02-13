import React, {Component} from 'react';
import {
    getAttendanceListByMonth,
    load_all_info,  load_data_daysInMonth_for_Nochcut,
    load_data_daysInMonth_for_Table,
    load_data_daysOfAttendance_for_all_students,
    load_data_downloadAttendance_for_all_students, load_data_getAllUserAttendanceHistory
} from "../Db/DataBase";
import {ScaleLoader} from "react-spinners";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../Components/David-normal/David-normal";
import autoTable from "jspdf-autotable";


export default class Netunim extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allUserAttendanceHistory: null,
            loadingAttendanceHistory: true,
            loadingAllUserAttendanceHistory: true,
            attendanceHistory: null,
            attendanceModal: false,
            data: "",
            runAjax: true,
            daysInMonthf: "",
            map_attendance: "",
            loading: true,
            search: ""
        }
    }

    runAjax = () => {
        if (this.state.runAjax) {
         //   load_data_daysOfAttendance_for_all_students(this)
           // load_data_daysInMonth_for_Table(this.props.userProps.email,this.props.userProps.password, this);
            load_all_info(this.props.userProps.email, this.props.userProps.password, this);
            load_data_getAllUserAttendanceHistory(this.props.userProps.email, this.props.userProps.password, this);
            this.setState({runAjax: false})
        }
    }

    render() {
        if (this.props.userProps == null) {
            window.location.replace("/");
        }

        if (this.props.userProps.admin != "operator" && this.props.userProps.admin != "admin") {
            return (
                <div className="margin-top-responsive container">
                    <div className="row">
                        <div className="col-12">
                            <h1>אין לך גישה לדף זה</h1>
                        </div>
                    </div>
                </div>
            )
        } else if(this.state.runAjax){
            {this.runAjax()}
        }

        if (this.state.loading) {
            return (<div className={"d-flex flex-row margin-top-responsive justify-content-center"}>
                <ScaleLoader color={"white"}/>
            </div>)
        } else {
            return (
                <div className={"margin-top-responsive-sm"}>
                    {this.getAttendanceModal()}
                    <div className="container d-flex flex-row justify-content-center">
                        <div className="d-flex flex-row my-2">
                            <div className="d-flex w-100 m-auto">
                                <input type={"text"} className={"resize mx-1 w-100 rounded shadow input-group-text"}
                                       placeholder={"שם פרטי ,משפחה או ת.ז"} onChange={(e) => {
                                    this.setState({search: e.target.value})
                                }}/>
                                <button id={"longModalCloseBtn"} className={"btn btn-secondary"} data-toggle="modal"
                                        data-target="#exampleModalLong" onClick={() => {
                                    this.setState({loadingAttendanceHistory: true})
                                    load_data_downloadAttendance_for_all_students(this.props.userProps.email, this.props.userProps.password, this)
                                }
                                }>הדפס רשימת נוכחות
                                </button>

                            </div>
                        </div>
                    </div>
                    <div className={"my-custom-scrollbar table-wrapper-scroll-y"}>
                        <table id="dtHorizontalExample"
                               className={"table table-hover border-bottom-active bg-light m-auto width-90 table-responsive table-light table-bordered table-striped"}>
                            <tr className={" bg-secondary text-white sticky-top  "}>
                                <th className={"text-center fgw-sorting "} scope={"col"}> #</th>
                                <th className={"text-center fgw-sorting "} scope={"col"}>ת.ז</th>
                                <th className={"text-center fgw-sorting "} scope={"col"}>שם משפחה</th>
                                <th className={"text-center fgw-sorting "} scope={"col"}>שם פרטי</th>
                                <th className={"text-center fgw-sorting "} scope={"col"}>טלפון</th>
                                <th className={"text-center fgw-sorting "} scope={"col"}>מייל</th>
                                <th className={"text-center fgw-sorting "} scope={"col"}>גיל</th>
                                <th className={"text-center fgw-sorting "} scope={"col"}>ת. לידה</th>
                                <th className={"text-center fgw-sorting "} scope={"col"}>ימי חופש</th>
                                <th className={"text-center fgw-sorting "} scope={"col"}>סטטוס</th>
                                <th className={"text-center fgw-sorting "} scope={"col"}>מחזור</th>
                                <th className={"text-center fgw-sorting "} scope={"col"}>שיעור</th>
                                <th className={"text-center fgw-sorting "} scope={"col"}>אחוז נוכחות</th>
                                <th className={"text-center fgw-sorting "} scope={"col"}>נוכחות חודש שעבר</th>
                            </tr>
                            <tbody>
                            {this.getRows(this.state.allUserAttendanceHistory)}
                            </tbody>
                        </table>
                    </div>

                </div>
            );
        }
    }


    getRows = (allUserAttendanceHistory) => {

        if (this.state.loadingAllUserAttendanceHistory){
            return (<div className={"m-auto text-white"}>
                <ScaleLoader color={"white"}/>
            </div>)
        }

        let lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        let rows = this.state.data.filter((student) => {
            if (this.state.search == "") {
                return true;
            } else {
                return student.first_name.includes(this.state.search) || student.last_name.includes(this.state.search) || student.id.includes(this.state.search);
            }
        }).map((user, index) => {
            return (<tr>
                    <td className={"text-center"}>{index}</td>
                    <td className={"text-center"}>{user.id}</td>
                    <td className={"text-center"}>{user.last_name}</td>
                    <td className={"text-center"}>{user.first_name}</td>
                    <td className={"text-center"}>{user.phone_number}</td>
                    <td className={"text-center"}>{user.email}</td>
                    {this.getAgePerStudent(user.birthday)}
                    <td className={"text-center"}>{user.birthday}</td>
                    <td className={"text-center"}>{user.day_off_counter}</td>
                    {getStatus(user.admin)}
                    <td className={"text-center"}>{user.cycle}</td>
                    <td className={"text-center"}>{user.class}</td>
                    {this.getAttendance(user.uuid)}
                    <td className={"text-center"}>{allUserAttendanceHistory.get(user.uuid)? allUserAttendanceHistory.get(user.uuid)[lastMonth.getMonth()]+"%" : ""}</td>
                </tr>
            )
        })
        return rows
    }

    getAgePerStudent(birthday) {
        const date1 = new Date(birthday);
        const date2 = new Date()
        return (
            <td>{toAge(date1, date2)}</td>
        )
    }

    getAttendanceModal() {
        return (
            <div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog"
                 aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" style={
                    {maxWidth: "100%"}
                } role="document">
                    <div class="modal-content w-sm-100-lg-75">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">רשימת תלמידים</h5>
                            <span class="close" data-dismiss="modal" aria-label="Close">
                                <span className={"btn-close"}></span>
                            </span>
                        </div>
                        <div class="modal-body">
                            {this.getTableForHistory()}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" onClick={() => {
                                createPDF()
                            }
                            }>הדפס
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

    getAttendance(uuid) {
     //   let attendance = this.state.map_attendance.get(uuid) == null ? 0 : this.state.map_attendance.get(uuid);
        return (
            <td> לא פעיל</td>
           // <td>{((this.state.daysInMonth.days - attendance) / this.state.daysInMonth.days * 100).toFixed(2)}%</td>
        )
    }

    async sendAttendanceList() {
        getAttendanceListByMonth(this.props.userProps.email, this.props.userProps.password, "December")
        return 4;
    }

    getTableForHistory() {
        if (!this.state.loadingAttendanceHistory) {
            return (
                <table id={"exportTable"} className={"table  m-auto text-center table-bordered table-hover"}
                >
                    <thead className={"table-dark text-white "}>
                    <tr>
                        <th className={"child-for-revers"} colSpan={9}>
                            רשימת מצטיינים מעל 90% נוכחות בשיעור
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className={"table-light"}>
                        <th colSpan={1}>#</th>
                        <th className={"child-for-revers"} colSpan={2}>הרב ארי מור</th>
                        <th className={"child-for-revers"} colSpan={2}>הרב אהרון לוי</th>
                        <th className={"child-for-revers"} colSpan={2}>הרב אהרון מילר</th>
                        <th className={"child-for-revers"} colSpan={2}>הרב בר זכאי</th>
                    </tr>
                    {getAttendanceHistoryList(this.state.attendanceHistory)}
                    </tbody>
                </table>
            )
        } else {
            return (
                <div>
                    <div className="spinner-border text-primary" role="status">
                        <span className="spinner-border"></span>
                    </div>
                </div>
            )
        }
    }

}

function getStatus(admin) {
    if (admin == "admin") {
        return (<td className={"text-danger"}>
            מנהל
        </td>)
    } else if (admin == "moderator") {
        return (<td className={"text-warning"}>
            מזכיר
        </td>)
    } else if (admin == "operator") {
        return (<td className={"rainbow-text"}>
            עורך האתר </td>)
    } else if (admin == "teacher") {
        return (<td className={"rainbow-text"}>
            רב </td>)
    } else {
        return (<td>
            תלמיד
        </td>)
    }
}


function toAge(date1, date2) {
    let diffTime = Math.abs(date2 - date1);
    return Math.round(diffTime / (1000 * 60 * 60 * 24 * 365))
}

function getMaxFromArray(array, index) {
    let arr = []
    for (let i = 0; i < array.length; i++) {
        arr.push(array[i][index].length)
    }
    return Math.max(...arr);
}

function create_Td(attendanceHistory, max, index) {
    let tr = []
    for (let i = 0; i < max; i++) {
        tr[i + 1] =
            <tr>
                <td colSpan={1}>{i}</td>
                <td className={"child-for-revers"}
                    colSpan={2}>{attendanceHistory[0][index][i] ? attendanceHistory[0][index][i].first_name + " " + attendanceHistory[0][index][i].last_name : " "} </td>
                <td className={"child-for-revers"}
                    colSpan={2}>{attendanceHistory[1][index][i] ? attendanceHistory[1][index][i].first_name + " " + attendanceHistory[1][index][i].last_name : " "} </td>
                <td className={"child-for-revers"}
                    colSpan={2}>{attendanceHistory[2][index][i] ? attendanceHistory[2][index][i].first_name + " " + attendanceHistory[2][index][i].last_name : " "} </td>
                <td className={"child-for-revers"}
                    colSpan={2}>{attendanceHistory[3][index][i] ? attendanceHistory[3][index][i].first_name + " " + attendanceHistory[3][index][i].last_name : " "} </td>
            </tr>
    }
    return tr;
}

function getAttendanceHistoryList(attendanceHistory) {
    let tr = [];
    tr.push(create_Td(attendanceHistory, getMaxFromArray(attendanceHistory, 1), 1))
    tr.push( <tr className={"table-dark text-white "}><td className={"child-for-revers"} colSpan={9}> רשימת הבחורים שנכחו החודפ פחות מ 75% משיעורי התורה ונשללת מהם האפשרות לבקשת שחרור עד לחזרה לנוכחות המינימלית הנדרשת לישיבה  </td></tr>)
    tr.push(create_Td(attendanceHistory, getMaxFromArray(attendanceHistory, 0), 0))
    return (tr)
}

function createPDF() {
    let table = document.getElementById('exportTable');
    let doc = new jsPDF();
    doc.addFont("David-normal.ttf", "David", "normal");
    doc.setFont("David");
    doc.setFontSize(10);
    let child;
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
    child = document.getElementsByClassName("child-for-revers");
    child.forEach(function (i) {
        i.textContent = i.textContent.split("").reverse().join("");
    })


    autoTable(doc, {
        html: table,
        styles: {
            font: "David",
            align: 'left',
            isSymmetricSwapping: true,
            isInputVisual: true,
            isOutputVisual: false
        },
    });


    doc.save(`Noam_was_here${new Date().toLocaleDateString("he-u-ca-hebrew", {month: 'long'})}.pdf`);
    document.getElementById("longModalCloseBtn").click();
}
