import React, {Component} from 'react';
import "./Nochcut.css"
import {
    load_data_getRegisteredStudentsForRabbiByDate,//Finished
    load_data_getUnRegisteredStudentsForRabbiByDate,//Finished
    insert_into_attendance, //need to check if teacher but don't have to do it because it's not that important
    // update_student_attendance,//need to check if teacher but don't have to do it because it's not that important
    load_data_daysOfAttendance_for_all_students_to_nochcut,//No need to check if admin but need to check if student (priority low/mid)
    load_data_daysInMonth_for_Nochcut,//Finished
    load_data_getAllUserAttendanceHistoryFor_nochcut, getClassesForRabbi//Finished
} from "../Db/DataBase";
import ScaleLoader from "react-spinners/ScaleLoader";
import {formatDate} from "../SendRequest/SendRequest";
import {MyCalendar} from "../Components/Calendar/Calendar";

let mergedList = [];
let idForEdit;
export default class Nochecut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userProps: props.userProps,
            date: new Date(),
            // loading: true,
            runAjax: true,
            data: null,
            already_attendance: false,
            edit: false,
            unregisteredStudents: null,
            registeredStudents: null,
            classesForRabbi: null,
            map_attendance: "",
            map_attendanceHistory: "",
            daysInMonth: "",
            selectedClass: "תפילה",
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

        if (this.state.runAjax) {
            load_data_getAllUserAttendanceHistoryFor_nochcut(this.props.userProps.email, this.props.userProps.password, this)
            load_data_getRegisteredStudentsForRabbiByDate(this.props.userProps.email, this.props.userProps.password, formatDate(this.state.date), this.state.selectedClass, this)
            load_data_getUnRegisteredStudentsForRabbiByDate(this.props.userProps.email, this.props.userProps.password, formatDate(this.state.date), this.state.selectedClass, this)
            load_data_daysOfAttendance_for_all_students_to_nochcut(this)
            load_data_daysInMonth_for_Nochcut(this.props.userProps.email, this.props.userProps.password, this)
            getClassesForRabbi(this)
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
                                                insert_into_attendance(idForEdit,1, formatDate(this.state.date), this.state.selectedClass)
                                                this.refreshList()
                                            }}>נכח
                                    </button>
                                    <button className={"btn button mx-1 btn-danger text-center"}
                                            data-dismiss="modal"
                                            onClick={() => {
                                                insert_into_attendance(idForEdit,0, formatDate(this.state.date), this.state.selectedClass)
                                                this.refreshList()
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
                        <h5 className={"text-center fw-bold text-white"}>{this.state.date.toLocaleDateString()}</h5>
                        <div className={"container-fluid d-flex w-95 flex-row justify-content-start"}>
                            {this.createClassTabButtons()}
                        </div>
                        {this.GetWholeTable()}
                    </div>
                </div>
            </>
        );
    }

    createClassTabButtons = () => {
        if (this.state.classesForRabbi == null) {
            return (
                <div className={"m-auto"}>
                    <ScaleLoader color={"white"}/>
                </div>)
        }
        let classes = this.state.classesForRabbi;
        let buttons = [];
        Object.keys(classes).forEach((key) => {
            if (classes[key] == 1) {
                buttons.push(
                    <div className="box shadow text-center mx-1 d-flex" onClick={(e) => {
                        this.setState({selectedClass: e.currentTarget.innerText.replace(" ","_"), registeredStudents: null, unRegisteredStudents: null})
                        load_data_getRegisteredStudentsForRabbiByDate(this.props.userProps.email, this.props.userProps.password, formatDate(this.state.date), e.currentTarget.innerText, this)
                        load_data_getUnRegisteredStudentsForRabbiByDate(this.props.userProps.email, this.props.userProps.password, formatDate(this.state.date), e.currentTarget.innerText, this)
                        let box = document.querySelectorAll(".box")
                        box.forEach((element) => {
                            element.classList.remove("box-selected")
                        })
                        e.currentTarget.classList.add("box-selected");
                    }}>
                        <h5 className="m-auto">{key.replace('_'," ")}</h5>
                    </div>
                )
            }
        })

        if (buttons.length > 0)
            buttons[0].props.className += " box-selected";
        return buttons;
    }

    GetWholeTable = () => {
        if (this.state.unregisteredStudents !== null && this.state.registeredStudents !== null && this.state.classesForRabbi !== null){
            return (
                <div className={"m-auto my-custom-scrollbar w-95 mt-2"} style={{minHeight: '500px'}}>
                    <table className={"table table-hover table-responsive table-light table-bordered"} >
                        {this.creatRow()}
                        <tbody>
                        {this.CreatTable()}
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return (
                <div className={"container-fluid m-auto d-flex justify-content-center"}>
                    <ScaleLoader color={"white"}/>
                </div>
            )
        }
    }

    GetButton = (uuid, date, isRegistered) => {
        if (isRegistered == 1 || isRegistered == 0) {
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
                                insert_into_attendance(uuid, 1, date,  this.state.selectedClass)
                                this.refreshList()
                            }}>נכח
                    </button>
                    <button className={"btn mx-1 btn-table btn-danger text-center"}
                            onClick={() => {
                                insert_into_attendance(uuid, 0, date,  this.state.selectedClass)
                                this.refreshList()
                            }}>לא נכח
                    </button>
                </div>
            )
        }
    }
    refreshList =() =>{
            load_data_getUnRegisteredStudentsForRabbiByDate(this.props.userProps.email, this.props.userProps.password, formatDate(this.state.date), this.state.selectedClass, this)
            load_data_getRegisteredStudentsForRabbiByDate(this.props.userProps.email, this.props.userProps.password, formatDate(this.state.date), this.state.selectedClass, this)
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
        mergedList = unregistered.concat(registered);
        mergedList = mergedList.sort((a, b) => {
            if (a.last_name < b.last_name) {
                return -1;
            }
            if (a.last_name > b.last_name) {
                return 1;
            }
            return 0;
        })
        let table = [];
        let date = formatDate(this.state.date)
        for (let index in mergedList) {
            let user = mergedList[index];
            let attendStatus = user.hasOwnProperty("attend") ? user.attend : 2;
            table.push(
                <tr className={attendStatus == 1 ? "table-success" : attendStatus == 0 ? "table-danger" : "table-light"}>
                    <th className={"text-center"} scope={"row"}>{(parseInt(index) + 1)}</th>
                    <td className={"text-center"}>{user.last_name}</td>
                    <td className={"text-center"}>{user.first_name}</td>
                    <td>
                        {this.GetButton(user.uuid, date, attendStatus, user.first_name, user.last_name, index)}
                    </td>
                    {this.getAttendance(user.uuid)}
                    {this.getAttendanceHistory(user.uuid)}
                </tr>
            )
        }
        // for (let index in unregistered) {
        //     let user = unregistered[index];
        //     table.push(
        //         <tr className={"table-light"}>
        //             <td className={"text-center"} scope={"row"}>{(parseInt(index) + 1)}</td>
        //             <td className={"text-center"}>{user.last_name}</td>
        //             <td className={"text-center"}>{user.first_name}</td>
        //             <td>
        //                 {this.GetButton(user.uuid, date, false, user.first_name, user.last_name)}
        //             </td>
        //             {this.getAttendance(user.uuid)}
        //             {this.getAttendanceHistory(user.uuid)}
        //         </tr>
        //     )
        // }
        // for (let index in registered) {
        //     let user = registered[index];
        //     table.push(
        //         <tr className={user.attend == 1 ? "table-success" : "table-danger"}>
        //             <td className={"text-center"} scope={"row"}>{(parseInt(index) + unregistered.length + 1)}</td>
        //             <td className={"text-center"}>{user.last_name}</td>
        //             <td className={"text-center"}>{user.first_name}</td>
        //             <td>
        //                 {this.GetButton(user.uuid, date, true, user.first_name, user.last_name)}
        //             </td>
        //             {this.getAttendance(user.uuid)}
        //             {this.getAttendanceHistory(user.uuid)}
        //         </tr>
        //     )
        // }
        return table
    }

    getAttendance(uuid) {
        let attendance = this.state.map_attendance.get(uuid) == null ? 0 : this.state.map_attendance.get(uuid);
        return (
            <td className={"text-center"}>{((this.state.daysInMonth.days - attendance) / this.state.daysInMonth.days * 100).toFixed(2)}%</td>
        )
    }

    getAttendanceHistory(uuid) {
        let attendance = this.state.map_attendanceHistory.get(uuid) == null ? 0 : this.state.map_attendanceHistory.get(uuid);
        return (
            <td className={"text-center"}>{attendance}%</td>
        )
    }
}





