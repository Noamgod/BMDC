import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './Events.css'
import ripple from "ripple-effects"
import HashLoader from "react-spinners/HashLoader"
import {
    delete_data_event, //finished
    delete_data_inEvent, //finished
    delete_data_removeFromEvent, //finished
    insert_data_addToEvent, //finished
    insert_data_event, //finished
    load_data_events, //Finished
    load_data_inEvent, //Finished
    sendMailEventList //Finished
} from "../Db/DataBase";


export default class Events extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userProps: props.userProps,
            update: false,
            loading: true,
            eventList: null,
            inEventList: null,
            runAjax: true
        }
    }

    componentDidMount() {
        ripple('.btn')
    }

    addBtnAdmin = (info) => {

        if (info.admin == "admin" || info.admin == "moderator" || info.admin == "operator") {
            return (
                <>
                    <button type={"button"} className={"btn btn-success  mx-1"} data-toggle="modal"
                            data-target="#startEvent">הוסף אירוע
                    </button>
                    <button type={"button"} className={"btn btn-danger"} data-toggle="modal"
                            data-target="#removeEvent">הסר אירוע
                    </button>
                </>
            );
        } else return null;
    }

    allPeopleInEvent = (inEventList, event_title) => {
        return (
            <ul className="dropdown-menu dropdown-menu-dark">
                {(inEventList.filter(x => x.event_title === event_title)).map((item) => (
                    <li className={"dropdown-item"} id={"drop-item"}>{item.full_name}</li>
                ))}
            </ul>
        );
    }
    runAjax = () => {
//
        if (this.state.runAjax) {
            load_data_events(this.props.userProps.email, this.props.userProps.password, this)
            load_data_inEvent(this.props.userProps.email, this.props.userProps.password,this, true)
            this.setState({runAjax: false})
        }
    }

    addEventsToList = (info) => {
        let EventList = this.state.eventList
        let inEventList = this.state.inEventList
        if (this.state.loading) {
            return (
                <div className={"d-flex fw-bold flex-row justify-content-center"}>
                    <HashLoader color={"black"}/>
                </div>
            )
        } else {
            return (
                <ul id={"mainList"} className={"timeline"}>
                    {EventList.map((item) => (
                        <li className="event" data-date={item.time}>
                            <h3>{item.event_title}</h3>
                            <p>{item.description}</p>
                          {/*  <button type={"button"} className={"btn btn-info"} onClick={()=>{
                                sendMail(this.props.userProps.email, item.event_title + " Event List ", this.makeListForMail(inEvent))
                            }}>שלח למייל</button>*/}
                            <div className={"d-flex flex-row"}>
                                <div className="dropdown">
                                    <button type="button" className="btn btn-secondary dropdown-toggle"
                                            data-bs-toggle="dropdown" data-bs-auto-close="outside">
                                        משתתפים באירוע
                                    </button>
                                    {this.allPeopleInEvent(inEventList, item.event_title)}
                                </div>
                                <div className={"mx-1"}>
                                    {this.addJoinButton(inEventList, item.event_title, info)}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            );
        }
    }

    addEventToSql = () => {
        let title = document.getElementById("addTitle-name");
        let description = document.getElementById("addDescription");
        let time = document.getElementById("addTime")
        if (title.value.trim() !== "" && description.value.trim() !== "") {
            insert_data_event(this.props.userProps.password, this.props.userProps.email,title.value,description.value,time.value);
            title.value = null;
            description.value = null;
            time.value = null
            this.setState({loading: true, runAjax: true})
        }
    }


    removeEventSQL = () => {
        let title = document.getElementById("remove_event")
        let email = document.getElementById("send_email")

        if (email.value.toLowerCase().includes("@gmail.com") || email.value.toLowerCase().includes("@chedvata.com") && title.value.trim() !== "") {
            let EventList = this.state.eventList
            let inEventList = load_data_inEvent(this.props.userProps.email, this.props.userProps.password,this, false);
            let inEvent;
            EventList.forEach(x => {
                if (x.event_title === title.value) {
                    delete_data_event(this.props.userProps.password, this.props.userProps.email, title.value)
                    inEvent = inEventList.filter(x => x.event_title === title.value)
                    delete_data_inEvent(this.props.userProps.password, this.props.userProps.email, title.value)
                    this.setState({runAjax: true, loading: true})
                }
            })
            sendMailEventList(this.props.userProps.email, this.props.userProps.password,email.value, title.value + " Event List ", this.makeListForMail(inEvent))
            title.value = null;
            email.value = null;
        }
    }

    makeListForMail(inEvent) {
        let msg = "<br><table><tr><th style='border:#cbcbcb solid 1px;text-align: left;padding: 8px'>שמות המשתתפים</th></tr>";
        inEvent.forEach((x) => {
            msg += "<tr><td style='border:#cbcbcb solid 1px;text-align: left;padding: 8px'>" + x.full_name + "</td></tr>"
        })
        msg += "</table><br><p>כמות הנרשמים - " + inEvent.length + "</p><br><br><a href='bmdcny.com/events'>קישור לאתר</a>"
        return msg;

    }



    resetValue = (add) => {
        if (add) {
            let title = document.getElementById("addTitle-name");
            let description = document.getElementById("addDescription");
            let time = document.getElementById("addTime")
            title.value = null
            description.value = null
            time.value = null
        } else {
            let title = document.getElementById("remove_event")
            let email = document.getElementById("send_email")
            title.value = null;
            email.value = null;
        }
    }

    removePersonFromEvent = (info, title) => {
        delete_data_removeFromEvent(info.email, info.password, title, info.uuid)
        this.setState({runAjax: true})
    }

    addJoinButton = (inEventList, title, info) => {
        for (let i = 0; i < inEventList.length; i++) {

            if (inEventList[i].uuid === info.uuid) {
                if (inEventList[i].event_title === title) {
                    return (<button type={"button"} onClick={() => this.removePersonFromEvent(info, title)}
                                    className={"btn btn-danger"}>יציאה</button>);
                }
            }
        }
        return (<button type={"button"} onClick={() => this.addPersonToEvent(info, title)}
                        className={"btn btn-success"}>הצטרפות</button>)
    }
    addPersonToEvent = (info, title) => {
        let fullName = info.first_name + " " + info.last_name
        insert_data_addToEvent(info.password, info.email, info.uuid, title ,fullName)
        this.setState({runAjax: true})
    }

    render() {
        if (this.props.userProps == null){
            window.location.replace("/");
        }
        return (
            <>
                {this.loadAddRemoveEvent()}
                {this.loadInfo()}

            </>
        );
    }


    loadInfo() {
        return (
            <div className={"d-flex flex-row mainDiv margin-top-responsive h-100vh"}>
                <div className={"container"}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className={"d-flex flex-row justify-content-between "}>
                                        <h6 className="card-title">אירועים</h6>
                                        <div>
                                            {this.addBtnAdmin(this.state.userProps)}
                                        </div>
                                    </div>
                                    <div id="content"
                                         className={"container pt-2 overflow-y-scroll d-flex flex-column"}>
                                        {this.runAjax()}
                                        {this.addEventsToList(this.state.userProps)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    loadAddRemoveEvent() {
        if(this.state.userProps.admin == "admin" || this.state.userProps.admin == "operator" ) {
            return(
                <>
                    <div className="modal fade" id="removeEvent" tabIndex="-1" role="dialog"
                         aria-labelledby="removeEventLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="removeEventLabel">הסר אירוע</h5>

                                </div>
                                <div className="modal-body">

                                    <div className="form-group">


                                        <label htmlFor="remove_event" className="col-form-label">שם האירוע</label>
                                        <input type="text" className="form-control" required={true}
                                               id="remove_event"/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="send_email" className="col-form-label">לשלוח מייל ל-</label>
                                        <input type="email" className="form-control" required={true}
                                               id="send_email"/>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                            onClick={() => this.resetValue(false)}>בטל
                                    </button>
                                    <button type="button" className="btn btn-primary"
                                            onClick={this.removeEventSQL.bind(this)} data-dismiss="modal">הסר אירוע
                                    </button>

                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="modal fade" id="startEvent" tabIndex="-1" role="dialog"
                         aria-labelledby="startEventLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">הוסף אירוע</h5>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="addTitle-name-name" className="col-form-label">שם האירוע</label>
                                            <input type="text" className="form-control" id="addTitle-name"/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="addTime" className="col-form-label">אורך זמן ההרשמה</label>
                                            <input type="text" className="form-control" id="addTime"/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="addDescription" className="col-form-label">תיאור האירוע
                                            </label>
                                            <textarea className="form-control" id="addDescription"/>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                            onClick={() => this.resetValue(true)}>בטל
                                    </button>
                                    <button type="button" className="btn btn-primary" data-dismiss={"modal"}
                                            onClick={this.addEventToSql}>התחל אירוע
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );

        }
        else return null;
    }
}
