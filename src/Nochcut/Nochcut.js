import React, {Component} from 'react';
import "./Nochcut.css"
import {
    load_data_getRegisteredStudentsForRabbiByDate,
    load_data_getUnRegisteredStudentsForRabbiByDate,
    insert_into_attendance,
    update_student_attendance,
    load_data_daysOfAttendance_for_all_students_to_nochcut,
    load_data_daysInMonth_for_Nochcut, load_data_getAllUserAttendanceHistoryFor_nochcut
} from "../Db/DataBase";
import ScaleLoader from "react-spinners/ScaleLoader";
import {formatDate} from "../SendRequest/SendRequest";
import {MyCalendar} from "../Components/Calendar/Calendar";


let idForEdit;
export default class MyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userProps: props.userProps,
            date: new Date(),
            loading: true,
            runAjax: true,
            data: null,
            already_attendance: false,
            edit: false,
            unregisteredStudents: null,
            registeredStudents: null,
            map_attendance: "",
            map_attendanceHistory: "",
            daysInMonth:""
        }
    }

    render() {
        if (this.props.userProps == null) {
            window.location.replace("/");
        }
        if (this.props.userProps.admin != "teacher") {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h1>אין לך גישה לדף זה</h1>
                        </div>
                    </div>
                </div>
            )
        }

        let rabbi = this.state.userProps.first_name + " " + this.state.userProps.last_name;
        if (this.state.runAjax) {
            load_data_getAllUserAttendanceHistoryFor_nochcut(this.props.userProps.email,this.props.userProps.password ,this)
            load_data_getRegisteredStudentsForRabbiByDate(rabbi, formatDate(this.state.date), this)
            load_data_getUnRegisteredStudentsForRabbiByDate(rabbi, formatDate(this.state.date), this)
            load_data_daysOfAttendance_for_all_students_to_nochcut(this)
            load_data_daysInMonth_for_Nochcut(this.props.userProps.email,this.props.userProps.password ,this)
            this.setState({runAjax: false})
        }
        return (
            <>
                <div className={"margin-top-responsive"}>
                    {<MyCalendar that={this}/>}
                </div>
                <div className={"overflow-hidden mb-3"}>
                    <div className="modal" id={"modal-dialog-edit"} tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">עריכת נוכחות</h5>
                                    <button type="button" className="btn-close" data-dismiss="modal"
                                            aria-label="Close"/>
                                </div>
                                <div className="modal-body">
                                    <h3>אנא עדכן כנדרש את נוכחות התלמיד</h3>
                                </div>
                                <div className={"flex-row justify-content-center"}>
                                    <button className={"btn button mx-1 btn-success text-center"}
                                            data-dismiss="modal"
                                            onClick={() => {
                                                update_student_attendance(idForEdit,formatDate(this.state.date), 1)
                                                this.setState({runAjax: true})
                                            }}>נכח
                                    </button>
                                    <button className={"btn button mx-1 btn-danger text-center"}
                                            data-dismiss="modal"
                                            onClick={() => {
                                                update_student_attendance(idForEdit,formatDate(this.state.date), 0)
                                                this.setState({runAjax: true})
                                            }}>לא נכח
                                    </button>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">ביטול
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h5 className={"text-center fw-bold"}>{this.state.date.toLocaleDateString()}</h5>
                        {this.GetWholeTable()}
                    </div>
                </div>
            </>
        );
    }

    GetWholeTable = () => {
        if (this.state.loading) {
            return (
                <div className={"m-auto"}>
                    <ScaleLoader color={"white"}/>
                </div>
            )
        }

        return (
            <div className={"m-auto table-wrapper-scroll-y my-custom-scrollbar w-95 mt-2"}>
                <table className={"table table-hover table-responsive table-light table-bordered"}>
                    {this.creatRow()}
                    <tbody>
                    {this.CreatTable()}
                    </tbody>
                </table>
            </div>
        )
    }

    GetButton = (uuid, date, isRegistered, first_name, last_name) => {
        if (isRegistered) {
            return (
                <div className={"d-flex flex-row justify-content-center"}>
                    <div id={"Edit-btu-for-nochecout"}>
                        <button className={"btn button text-white fw-bold bg-warning"} data-toggle={"modal"}
                                data-target={"#modal-dialog-edit"}
                                onClick={() => {
                                    idForEdit = uuid;
                                }}>עריכה
                        </button>
                    </div>
                </div>)

        } else {
            return (
                <div className={"d-flex flex-row justify-content-center"}>
                    <button className={"btn mx-1 btn-table btn-success text-center"}
                            onClick={() => {
                                insert_into_attendance(uuid, 1, date, first_name, last_name)
                                this.setState({runAjax: true})
                            }}>נכח
                    </button>
                    <button className={"btn mx-1 btn-table btn-danger text-center"}
                            onClick={() => {
                                insert_into_attendance(uuid, 0, date, first_name, last_name)
                                this.setState({runAjax: true})
                            }}>לא נכח
                    </button>
                </div>
            )
        }
    }

    creatRow() {
        return (
            <thead>
            <tr className={"table-primary position-sticky"}>
                <th className={"text-center"} scope={"col"}>#</th>
                <th className={"text-center"} scope={"col"}>שם משפחה</th>
                <th className={"text-center"} scope={"col"}>שם פרטי</th>
                <th className={"text-center"} scope={"col"}>מצב הגעה</th>
                <th className={"text-center"} scope={"col"}>אחוז נוכחות החודש</th>
                <th className={"text-center"} scope={"col"}>אחוז נוכחות חודש שעבר</th>
            </tr>
            </thead>
        )
    }

    CreatTable() {
        let unregistered = this.state.unregisteredStudents;
        let registered = this.state.registeredStudents;
        let table = [];
        let date = formatDate(this.state.date)
        for (let index in unregistered) {
            let user = unregistered[index];
            table.push(
                <tr className={"table-light"}>
                    <th className={"text-center"} scope={"row"}>{(parseInt(index)+1)}</th>
                    <td className={"text-center"}>{user.last_name}</td>
                    <td className={"text-center"}>{user.first_name}</td>
                    <td>
                        {this.GetButton(user.uuid, date, false, user.first_name, user.last_name)}
                    </td>
                    {this.getAttendance(user.uuid)}
                    {this.getAttendanceHistory(user.uuid)}
                </tr>
            )
        }
        for (let index in registered) {
            let user = registered[index];
            table.push(
                <tr className={user.attend == 1 ? "table-success" : "table-danger"}>
                    <th className={"text-center"} scope={"row"}>{(parseInt(index) + unregistered.length+1)}</th>
                    <td className={"text-center"}>{user.last_name}</td>
                    <td className={"text-center"}>{user.first_name}</td>
                    <td>
                        {this.GetButton(user.uuid, date, true, user.first_name, user.last_name)}
                    </td>
                    {this.getAttendance(user.uuid)}
                    {this.getAttendanceHistory(user.uuid)}
                </tr>
            )
        }
        return table
    }

    getAttendance(uuid) {
        let attendance = this.state.map_attendance.get(uuid) == null ? 0 : this.state.map_attendance.get(uuid);
        return (
            <td className={"text-center"} >{((this.state.daysInMonth.days - attendance) / this.state.daysInMonth.days * 100).toFixed(2)}%</td>
        )
    }
    getAttendanceHistory(uuid) {
        let attendance = this.state.map_attendanceHistory.get(uuid) == null ? 0 : this.state.map_attendanceHistory.get(uuid);
        return (
            <td className={"text-center"}>{attendance}%</td>
        )
    }
}





