import React from 'react';
import {
    load_data_sendRequest,//finished
    sendMailFrom//could use some fixing (possible to change the to and from and other things in this function not sure how to validate this)
} from "../Db/DataBase";
import ripple from "ripple-effects"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./SendRequest.css"
import './background.jpg'
import {toast, ToastContainer} from "react-toastify";

const notifyError = (msg) => toast.error(msg, {
    position: "top-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});
const notifySuccess = (msg) => toast.success(msg, {
    position: "top-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

export default class sendRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userProps: props.userProps,
            date: new Date(),
            today1: new Date()
        }

    }

    render() {
        if (this.props.userProps == null) {
            window.location.replace("/");
        }

        let user = {
            first_name: this.state.userProps.first_name,
            last_name: this.state.userProps.last_name,
            id: this.state.userProps.id,
            date: new Date(),
            approve: 0,
            uuid: this.state.userProps.uuid,
            reason: "",
            day_off_counter: this.state.userProps.day_off_counter
        }

        return (

            <div id="booking" className="section">
                <div className="section-center">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7 col-md-push-5">
                                <div className="booking-cta">
                                    <h1>בקשת שחרור</h1>
                                    <p>
                                        על מנת שהישיבה תמיד תעבור ביקורת, בעמוד זה ניתן להגיש בקשה עבור שחרור מהישיבה
                                        בתאריך מסויים.
                                        על מנת
                                        לשפר
                                        את הסיכוי שיאשרו לך אנא כתוב סיבה מוצדקת
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-4 col-md-pull-7">
                                <div className="booking-form">
                                    <form method={"POST"}>
                                        <div className="form-group">
                                            <span className="form-label">סיבת השחרור </span>
                                            <input className="form-control" type="text" id={"reason"}
                                                   placeholder="אופציונלי"/>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <span className="form-label">תאריך יציאה:</span>
                                                    <DatePicker selected={this.state.date}
                                                                onChange={(date) => {
                                                                    this.setState({date: new Date(date)})
                                                                }}
                                                                className={"pickerInput shadow rounded text-center form-control"}
                                                                dateFormat={"yyyy-MM-dd"}
                                                                minDate={this.state.today1}
                                                                isClearable={false}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <span className="form-label">שם התלמיד:</span>
                                                    <input className="form-control text-center" type="text"
                                                           value={user.first_name + " " + user.last_name}
                                                           readOnly={true} required={true}/>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="form-btn">
                                        <button className="submit-btn" onClick={() => {
                                            this.collectData(user);
                                            let x = load_data_sendRequest(this.props.userProps.email, this.props.userProps.password,user.date,user.reason);
                                            if (x == 1) {
                                                notifySuccess("הבקשה נשלחה בהצלחה")
                                                sendMailFrom("noamgodli@chedvata.com", "בקשה לשחרור", "<h1>בקשת שיחרור של: " + user.first_name + " " + user.last_name + "</h1>" + "<h3>תאריך: " + user.date + "</h3>" + "<h3>סיבה: " + user.reason.replace(/'/g, '\\\'') + "</h3>"
                                                    , "chedvata@chedvata.com")
                                            }
                                            else {
                                                notifyError(x)
                                            }
                                        }
                                        }>שלח
                                        </button>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer
                    position="top-left"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>

        );
    }

    collectData(user) {
        user.date = formatDate(this.state.date);
        user.reason = document.getElementById("reason").value
    }

    componentDidMount() {
        ripple('.btn')
    }


}

export function formatDate(date) {
    if (date == null)
        return null
    else {
        if (date.getDate() > 9) {
            if (date.getMonth() + 1 > 9) {
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            } else {
                return date.getFullYear() + "-0" + (date.getMonth() + 1) + "-" + date.getDate();
            }
        } else {
            if (date.getMonth() + 1 > 9) {
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-0" + date.getDate();
            } else {
                return date.getFullYear() + "-0" + (date.getMonth() + 1) + "-0" + date.getDate();
            }
        }
    }
}

export function formatDateAndTime(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

