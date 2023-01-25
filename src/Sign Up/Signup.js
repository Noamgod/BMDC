import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './Signup.css'
import ripple from "ripple-effects"
import {load_data_signUp} from "../Db/DataBase"
import DatePicker from "react-datepicker";
import '@fortawesome/fontawesome-free/js/all.js';
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "universal-cookie";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let cookies = new Cookies();
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
    document.getElementById("B").style.borderColor = 'black'
    document.getElementById("B").checked = 'false'
    document.getElementById("G").style.borderColor = 'black'
    document.getElementById("G").checked = 'false'
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
                                                <option value={"א  2017"}/>
                                                <option value={"ב  2018"}/>
                                                <option value={"ג  2019"}/>
                                                <option value={"ד  2020"}/>
                                                <option value={"ה  2021"}/>
                                                <option value={"ו  2022"}/>
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
                                                <option value={"הרב יצחק מאיר יעבץ"}/>
                                                <option value={"הרב אהרון לוי"}/>
                                                <option value={"הרב ארי מור"}/>
                                                <option value={"הרב אהרון מילר"}/>
                                            </datalist>
                                            <label className="form-label text-primary"
                                                   htmlFor="cycle">שיעור בסדר א'</label>
                                        </div>
                                    </div>
                                    <div
                                        className="d-flex flex-row align-items-center mb-4">
                                        <i className="fas fa-book fa-lg me-3 fa-fw mb-4"/>
                                        <div className="form-outline  flex-fill mb-0">
                                            סדר נוסף:
                                            <input id="B"
                                                   className="form-control shadow col-sm-6 custom-select custom-select-sm"
                                                   type={"radio"}

                                            />
                                            <label className="form-label text-primary"
                                                   htmlFor="B"> ב'</label>
                                            <input id="G"
                                                   className="form-control shadow col-sm-6 custom-select custom-select-sm"
                                                                                      type={"radio"}
                                        />
                                            <label className="form-label text-primary"
                                                   htmlFor="G"> ב'</label>
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

    correctFormat = () => {
        let e, k;
        if ((e = document.getElementById("password")).value.length > 20) {
            e.style.borderColor = 'red'
            return true
        }
        if ((e = document.getElementById("password")).value !== (k = document.getElementById("repeat-password")).value) {
            e.style.borderColor = 'red'
            k.style.borderColor = 'red'
            return true
        }
        if ((e = document.getElementById("id")).value.length !== 9) {
            e.style.borderColor = 'red'
            return true;
        }
        if ((e = document.getElementById("phoneNumber")).value.length !== 10) {
            e.style.borderColor = 'red'
            return true
        }
        if ((e = document.getElementById("name")).value.length > 20) {
            e.style.borderColor = 'red'
            return true
        }
        if ((e = document.getElementById("Lastname")).value.length > 20) {
            e.style.borderColor = 'red'
            return true
        }
        if ((e = document.getElementById("B")).checked ===false && (k = document.getElementById("G")).checked ===false)  {
            e.style.borderColor = 'red'
            k.style.borderColor = 'red'
            return true
        }
        return false;
    }

    collectData = () => {
        return {
            first_name: document.getElementById("name").value,
            last_name: document.getElementById("Lastname").value,
            email: document.getElementById("email").value,
            id: document.getElementById("id").value,
            phone_number: document.getElementById("phoneNumber").value,
            password: document.getElementById("password").value,
            birthday: formatDate(this.state.date),
            cycle: document.getElementById("cycle").value,
            class: document.getElementById("class").value,
            oderClass: document.getElementById("B").value.checked ===true ? "B" : "G"
            //B = סדר ב' , G = סדר ג'
        }
    }

    setStateInfo = () => {
        resetElements();
        if (!this.correctFormat()) {
            let info = this.collectData();
            const ui = load_data_signUp(info)
            if (ui == "ההרשמה בוצעה בהצלחה") {
                window.location.href = "/login";
            }
        } else {
            notify("אחד או יותר מהשדות שהוזנו אינם תקינים");
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