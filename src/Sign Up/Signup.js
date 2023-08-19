import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './Signup.css'
import ripple from "ripple-effects"
import {load_data_getClasses, load_data_signUp} from "../Db/DataBase"
import DatePicker from "react-datepicker";
import '@fortawesome/fontawesome-free/js/all.js';
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "universal-cookie";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let cookies = new Cookies();
let errorMsg = "שדה חובה";
let elements = [];
const notify = (msg) => toast.error(msg, {
    position: "top-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
});


function resetElements() {
    document.getElementById("name").style.borderColor = 'black'
    document.getElementById("Lastname").style.borderColor = 'black'
    document.getElementById("email").style.borderColor = 'black'
    document.getElementById("id").style.borderColor = 'black'
    document.getElementById("phoneNumber").style.borderColor = 'black'
    document.getElementById("password").style.borderColor = 'black'
    document.getElementById("repeat-password").style.borderColor = 'black'
    document.getElementById("birthday").style.borderColor = 'black'
    document.getElementById("cycle").style.borderColor = 'black'
    document.getElementById("class").style.borderColor = 'black'
    /* document.getElementById("B").style.borderColor = 'black'
     document.getElementById("B").checked = 'false'
     document.getElementById("G").style.borderColor = 'black'
     document.getElementById("G").checked = 'false'*/
}

function offCheckSlide() {
    document.getElementById("flexSwitchCheckDefault").checked = false;
}

export default class Signup extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            date: new Date("2002-01-01"),
            min: new Date("2000-01-01"),
            max: new Date("2007-01-01"),
            classes: null,
            TOS: false
        }
    }


    componentDidMount() {
        ripple('.btn')
    }

    render() {
        if (this.props.userProps !== null) {
            sessionStorage.clear()
            if (cookies.get('curr') !== undefined) {
                cookies.remove('curr', {path: '/'})
            }
            this.props.that.setState({userProps: null})
        }
        if (this.state.classes == null) {
            load_data_getClasses(this)
        }
        return (
            <div>
                <div className="modal" tabIndex="-1" id={"promp"}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        onClick={offCheckSlide}
                                        data-dismiss={"modal"}
                                        aria-label="Close"/>
                                <h5 className="modal-title">אזהרה</h5>
                            </div>
                            <div className="modal-body">
                                <h2>תנאי שימוש</h2>
                                <p>
                                    האתר והנהלת הישיבה מסירים כל אחריות לגביי כל המידע , הנהלת הישיבה והאתר לא
                                    אחראית
                                    בשום צורה לגביי זליגת המידע
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                                        data-dismiss={"modal"} onClick={offCheckSlide}>ביטול רישום
                                </button>
                                <button type="button" className="btn btn-primary" onClick={() => {
                                    TOS()
                                }} data-dismiss={"modal"}>אישור
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                <p className="text-center h1 fw-bold mb-2 mx-1 mx-md-4 mt-4 text-white">הרשמה</p>
                <div className={"d-flex flex-column"} id={"main-div"}>
                    <div className={"container d-flex flex-row my-1  "} id={"s-main-div"}>
                        <div className={"container d-flex flex-column bg-primary rounded "} id={"first-container"}>
                            <p className={"text-center h4 text-white mt-4"}>פרטיים אישיים</p>
                            <div className={"d-flex flex-row w-100 justify-content-center my-2"}>
                                <div className={"d-flex flex-column"}>
                                    <div className="d-flex flex-row align-items-center mb-4">
                                        <i className="fas fa-user fa-lg me-3 fa-fw mb-4 "/>
                                        <div className="form-outline flex-fill mb-0  ">
                                            <input type="text" id="name"
                                                   className="form-control shadow"
                                                   required={true}/>
                                            <label className="form-label text-white "
                                                   htmlFor="name">שם פרטי</label>
                                        </div>
                                    </div>

                                    <div
                                        className="d-flex flex-row align-items-center mb-4">
                                        <i className="fas fa-user fa-lg me-3 fa-fw mb-4"/>
                                        <div className="form-outline flex-fill mb-0 align-top">
                                            <input type="text" id="Lastname"
                                                   className="form-control shadow"
                                                   required={true}/>
                                            <label className="form-label text-white "
                                                   htmlFor="Lastname">שם
                                                משפחה</label>
                                        </div>
                                    </div>
                                    <div
                                        className="d-flex flex-row align-items-center mb-4">
                                        <i className="fas fa-id-card fa-lg me-3 fa-fw mb-4 align-top"/>
                                        <div className="form-outline flex-fill mb-0">
                                            <input type="number" step="0.01"
                                                   inputMode={"numeric"}
                                                   id="id"
                                                   className="form-control shadow"
                                                   required={true}/>
                                            <label className="form-label text-white" htmlFor="id">תעודת
                                                זהות</label>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-row align-items-center mb-4">
                                        <i className="fas fa-phone fa-lg me-3 fa-fw mb-4 align-top"/>
                                        <div className="form-outline flex-fill mb-0">
                                            <input type="number" step="0.01"
                                                   inputMode={"numeric"}
                                                   id="phoneNumber"
                                                   className="form-control shadow"
                                                   required={true}/>
                                            <label className="form-label text-white"
                                                   htmlFor="phoneNumber">מספר
                                                טלפון</label>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="d-flex flex-row align-items-center mb-4 mx-auto">
                                <i className="fas fa-table fa-lg me-3 fa-fw mb-4 align-top"/>
                                <div className="form-outline  d-flex flex-column justify-content-end">

                                    <DatePicker id={"birthday"}
                                                selected={this.state.date}
                                                onChange={(date) => {
                                                    this.setState({date: new Date(date)})
                                                }}
                                                className={"shadow rounded text-center"}
                                                dateFormat={"yyyy-MM-dd"}
                                                placeholderText={"Enter Date"}
                                                minDate={this.state.min}
                                                maxDate={this.state.max}
                                                isClearable={false}
                                    />

                                    <label className="form-label text-white" htmlFor="birthday">תאריך
                                        לידה</label>
                                </div>
                            </div>

                        </div>
                        <div className={"container d-flex flex-column bg-white rounded"} id={"second-container"}>
                            <p className={"text-center h4 text-primary mt-4"}> פרטיים כלליים </p>
                            <div className={"d-flex flex-row w-100 justify-content-center my-2"}>
                                <div className={"d-flex flex-column"}>
                                    <div className="d-flex flex-row align-items-center mb-4 my-2 ">
                                        <i className="fas fa-envelope fa-lg me-3 fa-fw mb-4"/>
                                        <div className="form-outline flex-fill mb-0">
                                            <input type="email" id="email"
                                                   className="form-control shadow"
                                                   required={true}/>
                                            <label className="form-label text-primary"
                                                   htmlFor="email">Email</label>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row align-items-center mb-4">
                                        <i className="fas fa-key fa-lg me-3 fa-fw mb-4"/>
                                        <div className="form-outline flex-fill mb-0">
                                            <input type="password" id="password"
                                                   className="form-control shadow"
                                                   required={true}/>
                                            <label className="form-label text-primary"
                                                   htmlFor="password">סיסמה</label>
                                        </div>
                                    </div>

                                    <div
                                        className="d-flex flex-row align-items-center mb-4">
                                        <i className="fas fa-lock fa-lg me-3 fa-fw mb-4"/>
                                        <div className="form-outline flex-fill mb-0">
                                            <input type="password" id="repeat-password"
                                                   className="form-control shadow"
                                                   required={true}/>
                                            <label className="form-label text-primary"
                                                   htmlFor="repeat-password">אימות
                                                סיסמה</label>
                                        </div>
                                    </div>

                                    <div
                                        className="d-flex flex-row align-items-center mb-4">
                                        <i className="fas fa-mortar-board fa-lg me-3 fa-fw mb-4"/>
                                        <div className="form-outline flex-fill mb-0">

                                            <input list={"c"}
                                                   id="cycle"
                                                   className="form-control  shadow col-sm-6 custom-select custom-select-sm"
                                                   required={true}
                                            />

                                            <datalist id={"c"}>
                                                <option className={"text-center"} value={"מחזור י - תשפ\"ג"}/>
                                                <option className={"text-center"} value={"מחזור ט - תשפ\"ב"}/>
                                                <option className={"text-center"} value={"מחזור ח - תשפ\"א"}/>
                                                <option className={"text-center"} value={"מחזור ז- תש\"פ"}/>
                                            </datalist>
                                            <label className="form-label text-primary"
                                                   htmlFor="cycle">מחזור</label>
                                        </div>
                                    </div>


                                    <div
                                        className="d-flex flex-row align-items-center mb-4">
                                        <i className="fas fa-book fa-lg me-3 fa-fw mb-4"/>
                                        <div className="form-outline  flex-fill mb-0">

                                            <input list={"rabbi"}
                                                   id="class"
                                                   className="form-control shadow col-sm-6 custom-select custom-select-sm"
                                                   required={true}
                                            />

                                            <datalist id={"rabbi"}>
                                                <option className={"text-center"} value={"הרב יצחק מאיר יעבץ"}/>
                                                <option className={"text-center"} value={"הרב יצחק ברוך רוזנבלום"}/>
                                                <option className={"text-center"} value={"הרב נתנאל עמר"}/>

                                            </datalist>
                                            <label className="form-label text-primary"
                                                   htmlFor="cycle">שיעור בסדר א'</label>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-row align-items-center mb-4">
                                        <i className="fas fa-book fa-lg me-3 fa-fw mx-1"/>
                                        <div className="dropdown">
                                            <button type="button" className="btn btn-primary dropdown-toggle"
                                                    data-bs-toggle="dropdown" aria-expanded="false"
                                                    data-bs-auto-close="outside">
                                                סדרים נוספים
                                            </button>
                                            {this.getAllClasses()}
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"d-flex flex-row-reverse justify-content-center"}>
                        <div className="d-flex align-items-center mb-4 ">
                            <div className="form-check form-switch ">
                                <label className="form-check-label text-white"
                                       htmlFor="flexSwitchCheckDefault">אישור תנאי
                                    השימוש
                                    באתר</label>
                                <input className="form-check-input" type="checkbox"
                                       id="flexSwitchCheckDefault"
                                       data-toggle={"modal"}
                                       data-target={"#promp"}
                                       required={true}
                                />
                            </div>


                        </div>
                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                            <button type="button"
                                    className="btn btn-primary btn-lg"
                                    onClick={() => {
                                        this.setStateInfo()
                                    }}
                            >בצע רישום
                            </button>
                            <ToastContainer
                                position="top-left"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick={true}
                                rtl={false}
                                draggable={true}
                                pauseOnHover={true}
                                theme="colored"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    getAllClasses = () => {
        if (this.state.classes == null) {
            return (<div className={"text-center"}>
                <div className="spinner-border text-primary" role="status">
                </div>
            </div>)
        } else {
            let listOfClasses = this.state.classes;
            for (const i in listOfClasses) {
                    elements.push(
                        <div className="d-flex justify-content-between w-75 m-auto">
                            <label className="form-label text-primary"
                                   htmlFor={this.state.classes[i].name}> {(this.state.classes[i].name).replace("_"," ")}</label>
                            <input id={this.state.classes[i].name}
                                   className="m-1 form-check-input"
                                   type={"checkbox"}/>
                        </div>
                    )
                }
            return (<div className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    {elements}
                </div>
            )
        }
    }
    checkEmpty = () => {
        let e, k;
        if ((e = document.getElementById("email")).value === "") {
            e.style.borderColor = 'red'
            errorMsg = "אנא הכנס כתובת מייל"
            return false
        }
        if ((e = document.getElementById("password")).value === "") {
            e.style.borderColor = 'red'
            errorMsg = "אנא הכנס סיסמה"
            return false
        }
        if ((e = document.getElementById("repeat-password")).value === "") {
            e.style.borderColor = 'red'
            errorMsg = "אנא הכנס אימות סיסמה"
            return false
        }
        if ((e = document.getElementById("cycle")).value === "") {
            e.style.borderColor = 'red'
            errorMsg = "אנא הכנס מחזור"
            return false
        }
        if ((e = document.getElementById("class")).value === "") {
            e.style.borderColor = 'red'
            errorMsg = "אנא הכנס שיעור"
            return false
        }
        return true
    }

    correctFormat = () => {
        if (this.checkEmpty() === false){
            return false}
        let e, k;
        if (document.getElementById("flexSwitchCheckDefault").checked === false) {
            errorMsg = "אנא אשר את תנאי השימוש לפני הרשמה"
            return false
        }
        if ((e = document.getElementById("password")).value.length > 20) {
            e.style.borderColor = 'red'
            errorMsg = "הסיסמה חייבת להיות פחות מ 20 תווים"
            return false
        }
        if ((e = document.getElementById("password")).value !== (k = document.getElementById("repeat-password")).value) {
            e.style.borderColor = 'red'
            k.style.borderColor = 'red'
            errorMsg = "הסיסמאות אינן תואמות"
            return false
        }
        if ((e = document.getElementById("id")).value.length !== 9) {
            e.style.borderColor = 'red'
            errorMsg = "תעודת הזהות חייבת להיות באורך 9 ספרות"
            return false;
        }
        if ((e = document.getElementById("phoneNumber")).value.length !== 10) {
            e.style.borderColor = 'red'
            errorMsg = "מספר הטלפון חייב להיות באורך 10 ספרות"
            return false
        }
        if ((e = document.getElementById("name")).value.length > 20) {
            e.style.borderColor = 'red'
            errorMsg = "השם חייב להיות באורך פחות מ 20 תווים"
            return false
        }
        if ((e = document.getElementById("Lastname")).value.length > 20) {
            e.style.borderColor = 'red'
            errorMsg = "שם המשפחה חייב להיות באורך פחות מ 20 תווים"
            return false
        }
        if ((e = document.getElementById("email")).value.length > 30) {
            e.style.borderColor = 'red'
            errorMsg = "האימייל חייב להיות באורך פחות מ 30 תווים"
            return false
        }
        return true
        // if ((e = document.getElementById("B")).checked ===false && (k = document.getElementById("G")).checked ===false)  {
        //     e.style.borderColor = 'red'
        //     k.style.borderColor = 'red'
        //     errorMsg = "חובה לבחור סדר"
        //     return true
        // }
    }

    collectData = () => {
        let list = []
        for (const i in elements) {
            if (document.getElementById(elements[i].props.children[1].props.id).checked) {
                list.push(elements[i].props.children[1].props.id)
            }
        }
        console.log(list, "list")
        return (
            {
                first_name: document.getElementById("name").value,
                last_name: document.getElementById("Lastname").value,
                email: document.getElementById("email").value,
                id: document.getElementById("id").value,
                phone_number: document.getElementById("phoneNumber").value,
                password: document.getElementById("password").value,
                birthday: formatDate(this.state.date),
                cycle: document.getElementById("cycle").value,
                class: document.getElementById("class").value,
                listOfClasses: list,
            }
        )
    }

    setStateInfo = () => {
        resetElements();
        if (this.correctFormat()) {
            let info = this.collectData();
            const ui = load_data_signUp(info)
            if (ui.includes("ההרשמה בוצעה בהצלחה")) {
                toast.success(ui);
                window.location.href = "/login";
            } else {
                notify(ui)
            }
        } else {
            notify(errorMsg);
        }
    }
}

function TOS() {
    document.getElementById("flexSwitchCheckDefault").checked = true
}

function formatDate(date) {
    if (date == null)
        return null
    else {
        return (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate())
    }
}