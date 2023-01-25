import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ripple from "ripple-effects"
import './LogIn.css';
import {
    load_data_checkInAuth, //finished
    load_data_login, //finished
    sendMail_secretCode,  //finished
    sendMailFrom, //finished but has the same problem as the rest of the mails (Check a different class for more info)
    update_data_newPassword //finished
} from '../Db/DataBase'
import Cookies from 'universal-cookie';
import {NavLink} from "react-router-dom";
import {encrypt} from "../encryption";

const cookies = new Cookies()

let curr_email;
let toWho = "";

export default class LogIn extends React.Component {
    tempCode;

    constructor(props) {
        super(props);
        this.state = {
            modalTarget: "#forgotPass",
            changePassAccess: false
        }

    }

    componentDidMount() {
        ripple('.btn')
    }

    addNewPassword() {
        if (this.state.changePassAccess) {
            let newPassword = document.getElementById("newPass").value;
            let confNewPassword = document.getElementById("confNewPass").value;
            if (newPassword === confNewPassword && newPassword.length >= 8 && newPassword.length <= 20) {
                update_data_newPassword(curr_email, newPassword,this.tempCode);
                let close = document.getElementById("closeChangePassModal");
                this.setState({changePassAccess: false});
                close.click()
            } else {
                alert("הסיסמה חייבת להיות בין 20-8 תווים")
            }
        } else {
            alert("אין לך גישה לשינוי סיסמה")
        }
    }


    resetCodeInputValue() {
        let close = document.getElementById("code");
        if (close.value != null) {
            close.value = null;
        }
    }

    toWho(e) {
        document.getElementById("dropdownMenuLink").innerHTML = e.target.innerHTML;
        if (e.target.innerHTML.includes("מזכירות")) {
            toWho = "officebmdc@gmail.com"
        } else if (e.target.innerHTML.includes("צוות")) {
            toWho = "chdvatayeshiva@gmail.com"
        }
    }

    render() {
        return (<div>
            <div className="modal fade" id="contactUsFromLogIn" tabIndex="-1" role="dialog"
                 aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">יצירת קשר</h5>
                            <span className="ml-2 mb-1" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" className={"btn-close"}/>
                            </span>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="recipient-name" className="col-form-label">שם מלא:</label>
                                    <input type="text" className="form-control" id="recipient-name"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="recipient-name" className="col-form-label">מייל:</label>
                                    <input type="text" className="form-control" id="email"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="recipient-name" className="col-form-label">הפניית הבעיה:</label>
                                    <div  className="dropdown border border-warning rounded">
                                        <a className="btn  w-100 dropdown-toggle" href="#" role="button"
                                           id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                            אנא בחר
                                        </a>

                                        <ul className="dropdown-menu w-100 text-break" aria-labelledby="dropdownMenuLink">
                                            <li className="dropdown-item li text-center w-100 text-break" onClick={(e) => {
                                                this.toWho(e)
                                            }}>מזכירות הישיבה - בקשות בנושאי טפסים, תיאום פגישות, ביקורים וכו
                                            </li>
                                            <li className="dropdown-item  li text-center w-100 text-break" onClick={(e) => {
                                                this.toWho(e)
                                            }}>צוות האתר- פניות בנושאי בעיות טכניות בלבד!
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message-text-problem" className="col-form-label">הסבר מפורט של
                                        הבעיה:</label>
                                    <textarea className="form-control" id="message-text-problem"/>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">ביטול</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => {
                                let problem = document.getElementById("message-text-problem")
                                let name = document.getElementById("recipient-name").getAttribute('placeholder')
                                let email = document.getElementById("email").value;
                                let msg = "<h1/>שם: <h1>" + `${name}` + "<h3>הבעיה:</h3>" + `${problem.value}` + "  " + `${email}`
                                sendMailFrom(toWho, "פניה מתלמיד", msg, email)
                                problem.value = "";
                            }}>שליחה
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="forgotPass" tabIndex="-1" role="dialog"
                 data-keyboard="false"
                 data-backdrop="static"
                 aria-labelledby="forgotPassword" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="forgotPassword">שכחתי סיסמא</h5>
                            <button type="button" className="btn-secondary" data-dismiss="modal"
                                    aria-label="Close">
                                <span aria-hidden="true">Close</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="emailForCode" id={"emailLabel"}
                                       className="col-form-label">אימייל</label>
                                <input type="text" className="form-control" required={true}
                                       id="emailForCode"/>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                    id={"cancelButton"}
                                    onClick={() => {
                                        this.resetCodeInputValue()
                                    }}
                            >ביטול
                            </button>
                            <button type="button" className="btn btn-primary" data-toggle="modal"
                                    data-dismiss={"modal"} data-target="#secretCode" id={"sendButton"}
                                    onClick={() => {
                                        this.sendMailSecretCode();
                                    }}>
                                שלח קוד סודי לאימייל
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <div>
                <div className="modal fade" id="secretCode" tabIndex="-1" role="dialog"
                     data-keyboard="false"
                     data-backdrop="static"
                     aria-labelledby="EnterCode" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="EnterCode">קוד סודי</h5>
                                <button type="button" className="btn-secondary" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">Close</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">

                                    <label htmlFor="code" id={"codeLabel"}
                                           className="col-form-label">הזן קוד סודי</label>
                                    <input type="text" className="form-control" required={true}
                                           id="code" onChange={() => {
                                        if (this.tempCode !== document.getElementById("code").value) {
                                            this.tempCode = document.getElementById("code").value
                                        }
                                    }}/>

                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"

                                        data-dismiss={"modal"}
                                        data-toggle="modal"
                                        data-target={"#forgotPass"}
                                        id={"cancelButton"} onClick={this.resetCodeInputValue}>
                                    אחורה
                                </button>
                                <button type="button" className="btn btn-primary" id={"sendSecretCodeButton"}
                                        data-dismiss={"modal"}
                                        data-toggle={"modal"}
                                        data-target={this.state.modalTarget}
                                        onClick={() => {
                                            let res = load_data_checkInAuth(curr_email ,this.tempCode); //There is no way to stop him from changing this but it's OK because he can't change the password even if he did change it because before he changes the password we make sure he's allowed in the database
                                            if (res) {
                                                this.setState({
                                                    changePassAccess: true,
                                                    modalTarget: "#changePass"
                                                })
                                            } else {
                                                this.setState({
                                                    modalTarget: "#forgotPass"
                                                })
                                            }
                                        }}
                                >
                                    אימות
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="modal fade" id="changePass" tabIndex="-1" role="dialog"
                     data-keyboard="false"
                     data-backdrop="static"
                     aria-labelledby="changePassword" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="EnterNewPassWord">סיסמה חדשה</h5>
                                <button id={"closeChangePassModal"} className="btn-secondary" data-dismiss="modal"
                                        aria-label="Close" onClick={() =>
                                    this.setState({changePassAccess: false})
                                }>
                                    <span aria-hidden="true">Close</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="newPass" id={"newPassLabel"}
                                           className="col-form-label">סיסמה חדשה</label>
                                    <input type="text" className="form-control" required={true}
                                           id="newPass"/>

                                    <label htmlFor="confNewPass" id={"confNewPassLabel"}
                                           className="col-form-label">אימות סיסמה חדשה</label>
                                    <input type="text" className="form-control" required={true}
                                           id="confNewPass"/>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"
                                        id={"changePassButton"} onClick={() => {
                                    this.addNewPassword();
                                    this.setState({
                                        changePassAccess: false
                                    })
                                }}>אישור
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div id={"mainLoginDiv"} className="container min-vh-100 min-vw-100">
                    <div className="container py-5 h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                                <div className="card bg-dark text-white" style={{borderRadius: "1rem"}}>
                                    <div className="card-body p-5 text-center">

                                        <div className="mb-md-5 mt-md-4 pb-5">

                                            <h2 className="fw-bold mb-2 text-uppercase">חדוותא</h2>
                                            <p className="text-white-50 mb-5">נא להזין את האימייל והסיסמה שלך</p>

                                            <div className="form-outline form-white mb-4">
                                                <span className={"visually-hidden text-danger"} id={"error-msg"}>אימייל או סיסמה שגויים</span>
                                                <input type="email" id="inputEmail"
                                                       className="form-control form-control-lg"/>
                                                <label className="form-label" htmlFor="inputEmail">מייל</label>
                                            </div>

                                            <div className="form-outline form-white mb-4">
                                                <input type="password" id="inputPassword"
                                                       className="form-control form-control-lg"/>
                                                <label className="form-label" htmlFor="inputPassword">סיסמה</label>
                                            </div>

                                            <div className={"form-check d-flex flex-row"}>
                                                <input type={"checkbox"} className={"form-check-input mx-2"}
                                                       defaultValue={true} id={"remember-me"}/>
                                                <label className={"form-check-label text-white "}
                                                       htmlFor={"remember-me"}>
                                                    זכור אותי
                                                </label>
                                            </div>

                                            <p className="small mb-5 pb-lg-2"><a className="text-white-50"
                                                                                 data-toggle="modal"
                                                                                 data-target="#forgotPass"
                                                                                 href={""}>שכחת
                                                סיסמה?</a></p>

                                            <button className="btn btn-outline-light btn-lg px-5" type="submit"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        let email = document.getElementById("inputEmail").value;
                                                        let password = document.getElementById("inputPassword").value;
                                                        if (email == null || password == null) {
                                                            document.getElementById("error-msg").setAttribute("class", "text-danger")
                                                        } else {
                                                            let info = load_data_login(email, password)
                                                            if (info != null && info.hasOwnProperty("id")) {
                                                                let encInfo = [JSON.stringify(encrypt(info.email)), JSON.stringify(encrypt(info.password))]
                                                                if (document.getElementById("remember-me").checked == true) {
                                                                    cookies.set("login", encInfo, {maxAge: "603999"});
                                                                }
                                                                    sessionStorage.setItem('e', encInfo[0]);
                                                                    sessionStorage.setItem('p', encInfo[1]);
                                                                this.props.that.setState({
                                                                    userProps: info
                                                                })
                                                            } else {
                                                                document.getElementById("error-msg").setAttribute("class", "text-danger")
                                                            }
                                                        }
                                                    }}>כניסה
                                            </button>
                                        </div>
                                        <div>
                                            <p className="mb-0"> אין לך עדיין חשבון?
                                            </p>
                                            <NavLink to={"/sign-up"}
                                                     className="text-white-50 fw-bold">להרשמה לחץ כאן</NavLink>
                                        </div>
                                        <div className={"mt-3"}>
                                            <button type="button" className="btn-lg btn-warning center" data-toggle="modal"
                                                    data-target="#contactUsFromLogIn">צור קשר
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>);
    }

    sendMailSecretCode() {
        curr_email = document.getElementById("emailForCode").value;
        sendMail_secretCode(curr_email, "קוד לאיפוס סיסמה") // res is the response from the server meaning if it returns false then the user is not in the auth table and if it returns true then the user is in the auth table
    }
}
