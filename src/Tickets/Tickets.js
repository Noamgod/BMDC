import React, {Component} from 'react';
import {add_Task, load_data_getTickets, update_priority_ticket, update_status_ticket} from "../Db/DataBase";
import {TicketBox} from "../Components/TicketBox/TicketBox";
import HashLoader from "react-spinners/HashLoader";
import "./Tickets.css"
import "@popperjs/core/dist/umd/popper.min.js";
import {formatDateAndTime} from "../SendRequest/SendRequest";

let totalCount;
let liSelect;
let status_range;
let priority_range;
export default class Tickets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sql: null,
            tickets: null,
            runAjax: true,
            loading: true,
            percentages: null,
            showModal: false,
            ticket_clicked: null,
            status: null,
            priority: null
        };
    }

    render() {
        if (this.props.userProps == null) {
            window.location.replace("/");
        } else {
            if (this.state.runAjax) {
                //this.state.sql == null ? this.props.userProps.admin == "operator" ? "SELECT * FROM Tickets" : this.props.userProps.role != "student" ? "SELECT * FROM Tickets WHERE category= '" + this.props.userProps.role + "' AND status != 100" : "SELECT * FROM Tickets WHERE uuid=" + this.props.userProps.uuid : this.state.sql
                load_data_getTickets(this);
                this.setState({runAjax: false});
            }

            if (this.state.loading) {
                return (
                    <div className="container margin-top-responsive">
                        <div className="row">
                            <div className="col-12">
                                <HashLoader color={"white"}/>
                            </div>
                        </div>
                    </div>
                )
            }
            totalCount = parseInt(this.state.percentages[0].count) + parseInt(this.state.percentages[1].count) + parseInt(this.state.percentages[2].count);
            let ticketBoxes = [];
            for (const ticketKey in this.state.tickets) {
                ticketBoxes.push(< TicketBox issue={this.state.tickets[ticketKey]} that={this}/>)
            }

            return (
                <>
                    <div className={"vh-100 d-flex flex-row phone margin-top-responsive justify-content-around"}>
                        <div className={"edit-box w-25 p-3 d-flex flex-column"}>
                            <div className={"d-flex flex-column edit-box-inner"}>
                                <div className={"position-relative end-1"} data-bs-toggle="modal"
                                     data-bs-target="#add_task">
                                    <img src={"https://chedvata.com/assets/add_task.svg"} style={{width: 32}}></img>
                                </div>
                                <div className={"text-center"}>
                                    <h5>{this.props.userProps.role}</h5>
                                </div>
                                <hr className={"border border-dark hr-phone "}></hr>
                                <div>
                                    <label className={"form-label d-flex flex-row"}>
                                    <span className="label-text"><img className={"ms-2 mb-1"} width={"32"}
                                                                      src={"https://chedvata.com/assets/profile.svg"}
                                                                      alt={"שם: "}/></span>
                                        <span
                                            className="label-value text-nowrap mt-1">{this.props.userProps.first_name + " " + this.props.userProps.last_name}</span>
                                    </label>
                                </div>
                                <div className={"mt-3 all-percent"}>
                                    <div className={"mt-1"}>
                                        <label className={"col-form-label-sm"}>מחכה לטיפול</label>
                                        <div className="progress bg-secondary ">
                                            <div role={"progressbar"}
                                                 className={"progress-bar  progress-bar-animated progress-bar-striped bg-danger" }
                                                 style={{width: this.getPercentages(0,false) + "%"}}> {this.getPercentages(0,true)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={"mt-1"}>
                                        <label className={"col-form-label-sm"}> בטיפול</label>
                                        <div className="progress bg-secondary">
                                            <div role={"progressbar"}
                                                 className={"progress-bar progress-bar-animated progress-bar-striped bg-warning" }
                                                 style={{width: this.getPercentages(1,false) + "%"}}>{this.getPercentages(1,true)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"mt-1"}>
                                        <label className={"col-form-label-sm"}>טופל</label>
                                        <div className="progress bg-secondary">
                                            <div role={"progressbar"}
                                                 className={"progress-bar  progress-bar-animated progress-bar-striped bg-success " }
                                                 style={{width: this.getPercentages(2,false) + "%"}}>{this.getPercentages(2,true)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dropdown">
                                    <a href="#" className="nav-link dropdown-toggle  text-truncate" id="dropdown"
                                       data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="btn-warning"></i><span
                                        className="ms-1  d-none d-sm-inline">סנן לפי</span>
                                    </a>
                                    {this.getList()}
                                </div>
                                <hr className={"hr-phone"} style={{borderStyle: 'dashed', borderColor: 'red'}}/>
                            </div>
                            <div className={"mt-3 d-flex flex-column border border-dark p-1 rounded m-auto"}>
                                {this.getTicket()}
                            </div>
                        </div>

                        <div className={"w-75 l-25 position-relative overflow-auto"}>
                            {ticketBoxes}
                        </div>
                    </div>
                    <div className="modal fade" id={"add_task"} tabIndex="-1" role="dialog"
                         aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLongTitle">הוספת מטלה</h5>
                                    <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">X</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="recipient-name" className="col-form-label">הבעיה בכלליות</label>
                                        <input type="text" className="form-control" id="title" maxLength={100}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="recipient-name" className="col-form-label">הפניית הבעיה:</label>
                                        <div className="dropdown border border-warning rounded">
                                            <a className="btn  w-100 dropdown-toggle" href="#" role="button"
                                               id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                                אנא בחר
                                            </a>
                                            <ul className="dropdown-menu w-100 text-break"
                                                aria-labelledby="dropdownMenuLink">
                                                <li className="dropdown-item li text-center w-100" onClick={(e) => {
                                                    this.liSelect(e)
                                                }}>מטבח
                                                </li>
                                                <li className="dropdown-item li text-center w-100" onClick={(e) => {
                                                    this.liSelect(e)
                                                }}>תחזוקה
                                                </li>
                                                <li className="dropdown-item li text-center w-100" onClick={(e) => {
                                                    this.liSelect(e)
                                                }}>תמיכה תכנית באתר
                                                </li>
                                                <li className="dropdown-item li text-center w-100" onClick={(e) => {
                                                    this.liSelect(e)
                                                }}>מזכירות הישיבה
                                                </li>
                                                <li className="dropdown-item li text-center w-100" onClick={(e) => {
                                                    this.liSelect(e)
                                                }}>מנכ"ל הישיבה
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="recipient-name" className="col-form-label">הסבר מפורט של
                                            הבעיה:</label>
                                        <textarea className="form-control" id="desc" maxLength={2000}/>
                                    </div>

                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">ביטול
                                    </button>
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                                            onClick={() => {
                                                this.addTask();
                                                this.setState({runAjax: true})
                                            }}>שליחה
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </>
            )
        }
    }

    getPercentages = (i,flag) => {
        if (flag){
            if (this.state.percentages[i].count ==0) {
                return "אין משימות ממתינות";
            }else {
                let x=parseInt(Math.round(100*this.state.percentages[i].count/totalCount));
                return x+"%";
            }
        }else {
            if (this.state.percentages[i].count ==0) {
                return 100;
            }else {
                return parseInt(Math.round(100 * this.state.percentages[i].count / totalCount))
            }
        }

    }

    liSelect = (e) => {
        document.getElementById("dropdownMenuLink").innerHTML = e.target.innerHTML;
        if (e.target.innerHTML === "מטבח") {
            liSelect = "מטבח"
        } else if (e.target.innerHTML === "תחזוקה") {
            liSelect = "תחזוקה"
        } else if (e.target.innerHTML === "תמיכה תכנית באתר") {
            liSelect = "תמיכה תכנית באתר"
        } else if (e.target.innerHTML === "מזכירות הישיבה") {
            liSelect = "מזכירות הישיבה"
        } else if (e.target.innerHTML === "מנהל הישיבה") {
            liSelect = "מנכ\"ל הישיבה"
        }
    }
    addTask = () => {
        let title = document.getElementById("title").value;
        let description = document.getElementById("desc").value;
        let data = {
            first_name: this.props.userProps.first_name,
            last_name: this.props.userProps.last_name,
            date: formatDateAndTime(new Date()),
            desc: description,
            category: liSelect,
            title: title,
            uuid: this.props.userProps.uuid,
            status: 0,
            priority: 1
        }
        add_Task(data);

    }
    getTicket = () => {
        if (this.state.showModal && this.props.userProps.admin != "student") {
            let status = this.state.status
            status = status == 0 ? "  ממתין להתייחסות" : status < 100 ? "  בטיפול" : "  המשימה נסגרה"
            return (
                <div className={"m-auto"}>
                    <h5 className={"text-center"}>{this.state.ticket_clicked.title}</h5>
                    <div className={"m-auto"}>
                        <h6 className={"text-center"}>
                            <strong>סטטוס:</strong>{status}
                        </h6>
                    </div>
                    <div className={"m-auto"}>
                        <form>
                            <div className="form-group m-auto d-flex flex-row justify-content-between">
                                <label htmlFor="change-status" className={"flex-column"}>שינוי הסטטוס </label>
                                <input type="range" className={"form-control-range flex-column"} id="change-status"
                                       max={100}
                                       min={0} value={this.state.status} onChange={(e) => {
                                    this.setState({status: e.target.value})
                                    status_range = e.target.value
                                }}/>
                            </div>
                        </form>
                    </div>
                    <div className={"m-auto"}>
                        <form>
                            <div className="form-group m-auto  d-flex flex-row justify-content-between">
                                <label htmlFor="change-priority" className={"flex-column"}>שינוי עדיפות </label>
                                <input type="range" className={"form-control-range me-4 flex-column"}
                                       id="change-priority" max={3}
                                       step={1}
                                       min={1} value={this.state.priority}
                                       onChange={(e) => {
                                           this.setState({priority: e.target.value})
                                           priority_range = e.target.value
                                       }}/>
                            </div>
                        </form>
                    </div>
                    <div className={"m-auto d-flex justify-content-center mt-1"}>
                        <button className={"btn btn-success"} onClick={() => {
                            update_status_ticket(this.state.ticket_clicked.ticket_id, this.state.status)
                            update_priority_ticket(this.state.ticket_clicked.ticket_id, this.state.priority)
                            this.setState({runAjax: true})

                        }}>שמירה
                        </button>
                    </div>


                </div>
            )
        }

    }


    getList = () => {
        if (this.props.userProps.admin == "operator") {
            return (
                <ul className="dropdown-menu" aria-labelledby={"dropdown"}>
                    <li className={"dropdown-item"}
                        onClick={() => this.setState({sql: "SELECT * FROM Tickets ORDER BY date", runAjax: true})}>לפי
                        תאריך
                    </li>
                    <li className={"dropdown-item"} onClick={() => this.setState({
                        sql: "SELECT * FROM Tickets ORDER BY priority DESC",
                        runAjax: true
                    })}>לפי עדיפות
                    </li>
                    <li className={"dropdown-item"} onClick={() => this.setState({
                        sql: "SELECT * FROM Tickets ORDER BY category",
                        runAjax: true
                    })}>לפי קטגוריה
                    </li>
                    <li>
                        <hr className="dropdown-divider"/>
                    </li>
                    <li><a className="dropdown-item" href="#">נעם והשטויות שלו</a></li>
                </ul>
            )
        } else if (this.props.userProps.role == "student") {
            return (
                <ul className="dropdown-menu" aria-labelledby={"dropdown"}>
                    <li className={"dropdown-item"} onClick={() => this.setState({
                        sql: "SELECT * FROM Tickets WHERE uuid =" + this.props.userProps.uuid + " ORDER BY date",
                        runAjax: true
                    })}>לפי תאריך
                    </li>
                    <li className={"dropdown-item"} onClick={() => this.setState({
                        sql: "SELECT * FROM Tickets WHERE uuid =" + this.props.userProps.uuid + " ORDER BY priority DESC",
                        runAjax: true
                    })}>לפי עדיפות
                    </li>
                </ul>
            )
        } else {
            return (
                <ul className="dropdown-menu" aria-labelledby={"dropdown"}>
                    <li className={"dropdown-item"} onClick={() => this.setState({
                        sql: "SELECT * FROM Tickets WHERE category ='" + this.props.userProps.role + "' ORDER BY date",
                        runAjax: true
                    })}>לפי תאריך
                    </li>
                    <li className={"dropdown-item"} onClick={() => this.setState({
                        sql: "SELECT * FROM Tickets WHERE category ='" + this.props.userProps.role + "' ORDER BY priority DESC",
                        runAjax: true
                    })}>לפי עדיפות
                    </li>
                </ul>
            )
        }
    }

}





