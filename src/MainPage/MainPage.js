import React from "react";
import Cookies from "universal-cookie"
import ripple from "ripple-effects"
import 'bootstrap/dist/css/bootstrap.css';
import "./MainPage.css"
import {
    get_student_count,
    update_data_studentCount,
    load_data_insertID,
    sendMailFrom, reset_days_to_new_month, set_days_in_month, load_data_updateLoginDate
} from "../Db/DataBase";
import '@fortawesome/fontawesome-free/js/fontawesome';
import {NavLink} from "react-router-dom";

const cookies = new Cookies();



export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userProps: props.userProps,
            login: false,
            studentCount: props.studentCount,
            updateLoginDate: true,
        }
    }

    componentDidMount() {
        if (this.state.updateLoginDate) {
            load_data_updateLoginDate(this.state.userProps.uuid)
            this.setState({updateLoginDate: false})
        }
        let buttons = document.querySelectorAll('.white-border');
        let logo = document.querySelector('.img-responsive');


        window.addEventListener('scroll', function () {
            let nav = document.querySelector('.sticky-top');
            for (let i = 0; i < buttons.length; i++) {
                if (window.scrollY > 0)
                    buttons[i].classList.replace('nav-top-active', 'nav-top-inactive');
                else
                    buttons[i].classList.replace('nav-top-inactive', 'nav-top-active');
            }

            if (window.scrollY > 0) {
                logo.classList.replace('scale-logo-big', 'scale-logo-small');
                nav.classList.replace('border-bottom-active', 'border-bottom-inactive');
            } else {
                logo.classList.replace('scale-logo-small', 'scale-logo-big');
                nav.classList.replace('border-bottom-inactive', 'border-bottom-active');
            }
        });
        ripple('.btn')
    }

    newStudentCount = () => {
        let newStudentCount = document.getElementById("student_count")
        if (newStudentCount.value == 0 || newStudentCount.value === null) {
            alert("אין אפשרות להזין 0 ככמות התלמידים.")
        } else {
            alert("כמות התלמידים שונתה ל- " + newStudentCount.value)
            update_data_studentCount("UPDATE singleton SET value='" + newStudentCount.value + "' WHERE singleton_name = 'student_count'")
            newStudentCount.value = null;
            this.setState({loading: true})
            get_student_count(this)
        }
    }
    insertNewId = (id) => {
        if (id.length == 9) {
            load_data_insertID(id);
            alert("הת\"ז נוסף בהצלחה")
            document.getElementById("addIdInput").value = null;
        } else {
            alert("תז לא תקין")
        }
    }

    render() {
        return (
            <>
                <div id={"toast"} className="toast" role="alert" aria-live="assertive" data-autohide={"true"}
                     aria-atomic="true">
                    <div className="toast-header">
                        <strong className="mr-auto">אמנון</strong>
                        <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                            <span aria-hidden="true" className={"btn-close"}/>
                        </button>
                    </div>
                    <div className="toast-body">
                        הת"ז נוסף בהצלחה
                    </div>
                </div>

                {this.editor()}

                <div className="modal fade" id="contactUs" tabIndex="-1" role="dialog"
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
                                        <input type="text" className="form-control" id="recipient-name"
                                               placeholder={this.state.userProps.first_name + " " + this.state.userProps.last_name}
                                               readOnly={true}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="recipient-name" className="col-form-label">מייל:</label>
                                        <input type="text" className="form-control" id="email"
                                               placeholder={this.state.userProps.email}
                                               readOnly={true}/>
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
                                    let email = this.props.userProps.email;
                                    let msg = "<h1/>שם: <h1>" + `${name}` + "<h3>הבעיה:</h3>" + `${problem.value}` + "  " + `${email}`
                                    sendMailFrom("chdvatayeshiva@gmail.com", "תמיכה טכנית", msg, email)
                                    problem.value = "";
                                }}>שליחה
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="offcanvas offcanvas-end sidebar-width" tabIndex="-1" id="offcanvas"
                     data-bs-keyboard="false"
                     data-bs-backdrop="false">
                    <div className="offcanvas-header sidebar-header bg-darkblue ">
                        <h5 className="offcanvas-title d-none d-sm-block  text-white" id="offcanvas">Menu</h5>
                        <button type="button" id={"navCloseBtn"} className="btn-close btn-close-bg-white" data-bs-dismiss="offcanvas"
                                ></button>
                    </div>
                    <div className="offcanvas-body px-0">
                        <ul className="nav nav-pills flex-column px-0" id="menu">
                            <li className="nav-item hover-glow">
                                <NavLink onClick={forceCloseNavBar} to={"/profile"} className={"nav-link text-truncate"}>
                                    <i className="fas fa-home fa-2x"></i><span
                                    className="mx-2 align-super mb-1 d-sm-inline">פרופיל</span>
                                </NavLink>
                            </li>
                            <li className="nav-item hover-glow">
                                <NavLink onClick={forceCloseNavBar} to={"/send-request"} className={"nav-link text-truncate"}  >
                                    <i className="fas fa-paper-plane fa-2x"></i><span
                                    className="mx-2 align-super mb-1 d-sm-inline">שלח בקשה</span>
                                </NavLink>
                            </li>
                            <li className="nav-item hover-glow">
                                <NavLink onClick={forceCloseNavBar} to={"/all-requests"} className={"nav-link text-truncate"}>
                                    <i className="fas fa-basket-shopping fa-2x"></i><span
                                    className="mx-2 align-super mb-1 d-sm-inline">כל הבקשות</span>
                                </NavLink>
                            </li>
                            <li className="nav-item hover-glow">
                                <NavLink onClick={forceCloseNavBar}  to={"/students"} className={"nav-link text-truncate"}>
                                    <i className="fas fa-user-circle fa-2x"></i><span
                                    className="mx-2 align-super mb-1 d-sm-inline">תלמידים</span>
                                </NavLink>
                            </li>
                            <li className="nav-item hover-glow">
                                <NavLink onClick={forceCloseNavBar}  to={"/events"} className={"nav-link text-truncate"}>
                                    <i className="fas fa-bookmark fa-2x"></i><span
                                    className="mx-2 align-super mb-1 d-sm-inline">ארועים</span>
                                </NavLink>
                            </li>
                            <li className="nav-item hover-glow">
                                <NavLink onClick={forceCloseNavBar} to={"/issues"} className={"nav-link text-truncate"}  >
                                    <i className="fas fa-awdaw fa-2x"></i><span
                                    className="mx-2 align-super d-sm-inline">תקלות</span>
                                </NavLink>
                            </li>
                            {this.getNuchechut(true)}
                            {this.getAdminButtons(true)}
                        </ul>
                    </div>
                </div>
                <div id={"navbar-sticky-top"} className={"sticky-top position-fixed border-bottom-active container-fluid"}>
                    <nav id={"navbar"} className={"navbar navbar-expand-xl opacity-enabled"}>
                        <div className="container-fluid align-baseline">
                            <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" role={"button"}
                                    data-bs-target="#offcanvas" aria-controls="navbarTogglerDemo01"
                                    aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"
                                    />
                            </button>
                            <div className={"collapse navbar-collapse"} id={"navbarTogglerDemo01"}>
                                <ul className={"nav navbar-collapse"}>
                                    <img style={{maxHeight: "65px", maxWidth: "20%"}}
                                         src={"https://Chedvatatest.com/assets/logo.png"}
                                         className={"img-responsive rounded navbar-brand scale-logo-big"} alt={"Logo"}/>
                                    {this.getButtons()}

                                </ul>
                            </div>
                            <ul className={"mx-1 my-3 nav"}>
                                {this.loadButtons(this.state.userProps.admin)}
                            </ul>
                        </div>
                    </nav>
                </div>
            </>);
    }

    resetValue = () => {
        document.getElementById("student_count").value = null;
    }
    loadButtons = (x) => {
        if (x == "admin" || x == "operator") {
            return (<>
                    <a className={"scale mx-3 navbar-brand fas fa-envelope nav-fa-icon text-white"} data-toggle="modal"
                       data-target="#contactUs"/>

                    <a className={"scale mx-3 navbar-brand fas fa-pencil nav-fa-icon text-white"} data-toggle="modal"
                       data-target="#Editor"/>

                    <li onClick={() => {
                        cookies.remove('login', {path: '/'})
                        sessionStorage.removeItem('e');
                        sessionStorage.removeItem('p');
                        window.location.href = "/login";
                    }}>
                        <a className={"mx-3 scale navbar-brand text-white  nav-fa-icon fas fa-sign-out"}/>
                    </li>
                </>

            );
        } else {
            return (<>
                <a className={"scale mx-3 navbar-brand fas fa-envelope nav-fa-icon text-white"} data-toggle="modal"
                   data-target="#contactUs">
                </a>
                <li onClick={() => {
                    cookies.remove('login', {path: '/'})
                    sessionStorage.removeItem('p');
                    sessionStorage.removeItem('e');
                    window.location.reload();
                }}>
                    <a className={"mx-3 scale navbar-brand text-white  nav-fa-icon fas fa-sign-out"}/>
                </li>
            </>);
        }
    }
    getButtons = () => {
        return (<>
            <NavLink to={"/profile"} className={" white-border navbar-brand nav-top-active text-white btn"}
            > פרופיל
            </NavLink>
            <NavLink to={"/send-request"}
                     className={" white-border navbar-brand nav-top-active rounded-0 mx-1 text-white btn"}
            >שליחת בקשה
            </NavLink>
            <NavLink to={"/all-requests"}
                     className={" white-border navbar-brand nav-top-active rounded-0 mx-1 text-white btn"}
            >כל הבקשות
            </NavLink>
            <NavLink to={"/events"}
                     className={" white-border navbar-brand nav-top-active rounded-0 mx-1 text-white btn hover-zoom"}
            >אירועים
            </NavLink>
            {this.getNuchechut(false)}
            <NavLink to={"/students"}
                     className={"btn white-border navbar-brand nav-top-active rounded-0 mx-1 text-white "}
            >תלמידים
            </NavLink>
            <NavLink to={"/issues"} className={"btn white-border navbar-brand nav-top-active mx-1 text-white"}
            > תקלות
            </NavLink>
            {this.getAdminButtons(false)}

        </>);
    }

    getNuchechut = (sidebar) => {
        if (this.props.userProps.admin == "teacher") {
            if (!sidebar)
                return (<NavLink to={"/attendance"}
                                 className={"btn white-border navbar-brand nav-top-active mx-1 text-white"}
                >נוכחות
                </NavLink>)
            else return (
                <li className="nav-item hover-glow">
                    <NavLink onClick={forceCloseNavBar} to={"/attendance"} className={"nav-link text-truncate"} >
                        <i className="fas fa-pencil fa-2x"></i><span
                        className="mx-2 align-super mb-1 d-sm-inline">נוכחות</span>
                    </NavLink>
                </li>
            )
        } else return null;
    }
    editor = ()=>{
        if(this.props.userProps.admin == "admin" || this.props.userProps.admin == "operator"){
            return (<div className="modal fade" id="Editor" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    data-dismiss={"modal"}
                                    aria-label="Close" onClick={this.resetValue}/>
                            <h4 className="modal-title text-center">עריכה</h4>
                        </div>
                        <div className="modal-body">
                            <div className={"d-flex flex-column"}>
                                <div className={"d-flex mb-1 flex-row justify-content-between"}>
                                    <span className={"fw-bold"}>כמות התלמידים</span>
                                    <div className={"d-flex flex-row justify-content-end"}>
                                        <button data-dismiss="modal" onClick={this.newStudentCount}
                                                type={"button"}
                                                className={"mx-1  btn btn-warning"}>שמירה
                                        </button>
                                        <input id={"student_count"} type={"number"}
                                               placeholder={this.state.studentCount}
                                               className={"input-group-text editUser"}
                                        />
                                    </div>
                                </div>
                                <div className={"d-flex mb-1 flex-row justify-content-between"}>
                                    <span className={"fw-bold"}>ימי לימוד החודש</span>
                                    <div className={"d-flex flex-row justify-content-end"}>
                                        <button data-dismiss="modal" onClick={() => {
                                            let days = document.getElementById("daysFromInput");
                                            reset_days_to_new_month(days.value,this.state.userProps.email,this.state.userProps.password)
                                            set_days_in_month(days.value)
                                            days.setAttribute("placeholder", days.value)
                                            days.value = null
                                        }}
                                                type={"button"}
                                                className={"mx-1 btn btn-warning"}>שמירה
                                        </button>
                                        <input id={"daysFromInput"} type={"number"}
                                               placeholder={"ימי לימוד בישיבה לחודש זה"}
                                               className={"input-group-text editUser"}
                                        />
                                    </div>
                                </div>
                                <div className={"d-flex mb-1 flex-row justify-content-between"}>
                                    <span className={"fw-bold"}>הוסף ID</span>
                                    <div className={"d-flex flex-row justify-content-end"}>
                                        <button onClick={() => {
                                            this.insertNewId(document.getElementById("addIdInput").value)
                                        }}
                                                data-bs-toggle={"toast"}
                                                type={"button"}
                                                className={"mx-1 btn btn-warning"}>הוסף
                                        </button>
                                        <input id={"addIdInput"} type={"number"}
                                               className={"input-group-text editUser"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal"
                                    onClick={this.resetValue}>סגור
                            </button>
                        </div>
                    </div>
                </div>
            </div>)
        }else{
            return null
        }
    }

    getAdminButtons = (sidebar) => {
        if (this.props.userProps.admin == "operator" || this.props.userProps.admin == "admin") {
            if (!sidebar) {
                return (
                    <NavLink to={"/data"} className={"btn white-border navbar-brand nav-top-active mx-1 text-white"}
                    >נתונים
                    </NavLink>
                )
            } else return (
                <li className="nav-item hover-glow">
                    <NavLink onClick={forceCloseNavBar} to={"/data"} className={"nav-link text-truncate"} >
                        <i className="fas fa-chart-bar fa-2x"></i><span
                        className="mx-2 align-super mb-1 d-sm-inline">נתונים</span>
                    </NavLink>
                </li>
            )
        } else return null;
    }
}
function forceCloseNavBar(){
    document.getElementById("navCloseBtn").click()
}







