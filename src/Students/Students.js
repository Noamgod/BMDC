import React from 'react';
import {
    delete_User,//Finished
    load_all_students, //Finished with isUser check
    load_data_setImagePath,//Finished with isUser check
    updateStudent,//Finished
    changeStudentPassword, load_data_getClasses, load_data_getClassesForUser, changeClassesForUser//Finished
} from "../Db/DataBase";
import './Students.css'
import 'bootstrap/dist/css/bootstrap.css'
import ripple from "ripple-effects"
import ScaleLoader from "react-spinners/HashLoader";
import {toast, ToastContainer} from "react-toastify";


let defaultImage = "https://bmdcny.com/assets/profile.svg";

export default class Students extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            loading: true,
            searchFirstName: "",
            searchLastName: "",
            runAjax: true,
            students: null,
            images: null,
            classesForUser: null,
            student: {
                first_name: null,
                last_name: null,
                phone_number: null,
                id: null,
                uuid: null,
                day_off_counter: null,
                email: null,
                admin: null,
                password: null,
                birthday: null,
                cycle: null,
                class: null,
                role: null,
            }
        }
    }

    componentDidMount() {
        ripple('.btn')
    }

    runAjax = () => {
        if (this.state.runAjax) {
            load_all_students(this.props.userProps.email, this.props.userProps.password, this)
        }
    }

    render() {
        if (this.props.userProps == null) {
            window.location.replace("/");
        }
        {
            this.runAjax()
        }
        if (this.state.loading) {
            return (<div className={"d-flex flex-row margin-top-responsive justify-content-center"}>
                <ScaleLoader color={"white"}/>
            </div>)
        } else {
            return (<div>
                <div class="modal fade" id="delete_User" tabindex="-1" aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"/>
                                <h5 class="modal-title text-center" id="exampleModalLabel">אזהרה</h5>
                            </div>
                            <div class="modal-body">
                                שים לב מחיקת תלמיד היא לצמיתות כמו כן כל המידע עבור התלמיד ימחק ולא יהיה ניתן לשחזר
                                בכלל.
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">ביטול</button>
                                <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={() => {
                                    delete_User(this.props.userProps.email, this.props.userProps.password, this.state.student.id)
                                }}>מחיקה
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"container d-flex flex-column justify-content-center margin-top-responsive-sm"}>
                    <div className={"d-flex flex-row justify-content-center my-2 p-2"}>
                        <button className={"btn btn-primary"} onClick={(e) => {
                            this.movePage(-1)
                            document.getElementById("student-scroll-container").scrollTo({behavior: "smooth", top: 0})
                        }}>
                            <i className={"fas fa-arrow-right"}>
                            </i>
                        </button>
                        <div>
                            <input id={"first_name"} type={"text"} onChange={this.searchByName}
                                   className={"resize mx-1 rounded shadow input-group-text"}
                                   placeholder={"שם"}/>
                        </div>
                        <button className={"btn btn-primary"} onClick={() => {
                            this.movePage(1)
                            document.getElementById("student-scroll-container").scrollTo({behavior: "smooth", top: 0})
                        }}>
                            <i className={"fas fa-arrow-left"}>
                            </i>
                        </button>
                    </div>
                    <div className={"mx-1 h5 fw-bold position-absolute"}>
                        {this.state.students.length}
                    </div>

                </div>

                <div id={"student-scroll-container"}
                     className={"container d-flex flex-column overflow-x-hide hide-overflow-bar mt-4 "}
                     style={{maxHeight: "75vh"}}>
                    {this.getCards()}
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
                {this.getChangesModal()}
            </div>)
        }
    }

    getChangesModal = () => {
        if (this.props.userProps.admin == "admin" || this.props.userProps.admin == "operator") {
            return (<div className="modal fade" id="myModal" role="dialog" data-keyboard="false" data-backdrop="static">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    data-dismiss={"modal"}
                                    aria-label="Close" onClick={this.resetValues}/>
                            <h4 className="modal-title text-center">{this.state.student.first_name} {this.state.student.last_name}</h4>
                        </div>
                        <div className="modal-body">
                            <div
                                className={"modal-input-main-container d-flex flex-row justify-content-around"}>
                                <div className={"mx-1 modal-input-inner-container"}>
                                    <div className={"d-flex flex-column"}>
                                        <div className={"mb-1"}>
                                            <span className={"fw-bold"}>שם פרטי</span>
                                            <input id={"fn"} type={"text"}
                                                   placeholder={this.state.student.first_name}
                                                   className={"input-group-text editUser"}
                                            />
                                        </div>
                                        <div className={"mb-1"}>
                                            <span className={"fw-bold"}>שם משפחה</span>
                                            <input id={"ln"} type={"text"}
                                                   placeholder={this.state.student.last_name}
                                                   className={"input-group-text editUser"}
                                            />
                                        </div>
                                        <div className={"mb-1"}>
                                            <span className={"fw-bold"}>מייל</span>
                                            <div className={"d-flex"}>

                                                <input id={"email-input"} type={"text"}
                                                       placeholder={this.state.student.email}
                                                       className={"input-group-text editUser"}
                                                />
                                            </div>
                                        </div>
                                        {this.getPassword()}
                                        <div className={"mb-1"}>
                                            <span className={"fw-bold"}>ת"ז</span>
                                            <div className={"d-flex"}>

                                                <input id={"id"} type={"number"}
                                                       placeholder={this.state.student.id}
                                                       className={"input-group-text editUser"}
                                                />
                                            </div>
                                        </div>
                                        <div className={"mb-1"}>
                                            <span className={"fw-bold"}>מספר טלפון</span>
                                            <div className={"d-flex"}>

                                                <input id={"pn"} type={"number"}
                                                       placeholder={this.state.student.phone_number}
                                                       className={"input-group-text editUser"}
                                                />
                                            </div>
                                        </div>
                                        <div className={"mb-1 mt-4"}>
                                            <div className="dropdown">
                                                <button type="button"
                                                        className="btn btn-primary dropdown-toggle container-fluid "
                                                        data-bs-toggle="dropdown" aria-expanded="false"
                                                        data-bs-auto-close="outside">
                                                    רישום לשיעור
                                                </button>
                                                {this.getClassesForCheckBox()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id={"modal-input-second-container"}
                                     className={"me-4 modal-input-inner-container"}>
                                    <div className={"d-flex flex-column"}>
                                        <div className={"mb-1"}>
                                            <span className={"fw-bold"}>ימי חופשה</span>
                                            <div className={"d-flex"}>

                                                <input id={"doc"} type={"number"}
                                                       placeholder={this.state.student.day_off_counter}
                                                       className={"input-group-text editUser"}
                                                />
                                            </div>
                                        </div>
                                        <div className={"mb-1"}>
                                            <span className={"fw-bold"}>תאריך לידה</span>
                                            <div className={"d-flex"}>

                                                <input id={"birthday"} type={"text"}
                                                       placeholder={this.state.student.birthday}
                                                       className={"input-group-text editUser"}
                                                />
                                            </div>
                                        </div>
                                        <div className={"mb-1"}>
                                            <span className={"fw-bold"}>מחזור</span>
                                            <div className={"d-flex"}>
                                                <input list={"c"}
                                                       id={"cycle"}
                                                       className={"input-group-text editUser"}
                                                       placeholder={this.state.student.cycle}
                                                />

                                                <datalist id={"c"}>
                                                    <option value={"מחזור י - תשפ\"ג"}/>
                                                    <option value={"מחזור ט - תשפ\"ב"}/>
                                                    <option value={"מחזור ח - תשפ\"א"}/>
                                                    <option value={"מחזור ז - תש\"פ"}/>
                                                </datalist>
                                            </div>
                                        </div>
                                        {this.getAdminEdit()}

                                        <div className={"mb-1"}>
                                            <span className={"fw-bold"}>תפקיד</span>
                                            <div className={"d-flex"}>
                                                <input list={"job-list"}
                                                       id={"role"}
                                                       placeholder={this.state.student.role}
                                                       className={"input-group-text editUser"}
                                                />
                                                <datalist id={"job-list"}>
                                                    <option value={"student"}/>
                                                    <option value={"מטבח"}/>
                                                    <option value={"תחזוקה"}/>
                                                    <option value={"תמיכה תכנית באתר"}/>
                                                    <option value={"מזכירות הישיבה"}/>
                                                    <option value={"מנכ\"ל הישיבה"}/>
                                                    <hr/>
                                                    <option value={"all"}/>
                                                </datalist>
                                            </div>
                                        </div>

                                        <div className={"mb-1"}>
                                            <span className={"fw-bold"}>שיעור</span>
                                            <div className={"d-flex"}>

                                                <input list={"r"}
                                                       id={"rabbi"}
                                                       placeholder={this.state.student.class}
                                                       className={"input-group-text editUser"}
                                                />
                                                <datalist id={"r"}>
                                                    <option value={"הרב יצחק מאיר יעבץ"}/>
                                                    <option value={"הרב יצחק ברוך רוזנבלום"}/>
                                                    <option value={"הרב נתנאל עמר"}/>
                                                </datalist>
                                            </div>
                                        </div>
                                        <div className={"mb-1 d-flex flex-column"}>
                                            <span className={"fw-bold"}>איפוס תמונה</span>
                                            <button className={"btn btn-primary"}
                                                    data-dismiss="modal" onClick={() => {
                                                load_data_setImagePath("images/defaultProfile.png", this.props.userProps.email, this.props.userProps.password)
                                                let tempHash = this.state.images.set(this.state.student.uuid, "images/defaultProfile.png")
                                                this.setState({images: tempHash})
                                            }}>תמונת ברירת מחדל
                                            </button>
                                        </div>
                                        <div className={"mb-1 d-flex flex-column"}>
                                            <span className={"fw-bold"}>מחיקה</span>
                                            <button type="button" className="btn btn-danger"
                                                    data-dismiss={"modal"} data-target="#delete_User"
                                                    data-toggle="modal">
                                                מחיקת תלמיד
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <div className={" d-flex flex-row w-100 justify-content-between"}>
                                <button onClick={this.saveChanges}
                                        data-dismiss={"modal"} type={"button"}
                                        className={"mx-1 btn btn-warning"}>שמירה
                                </button>
                                <button type={"button"} className={"mx-1 btn btn-default"}
                                        data-dismiss={"modal"}
                                        onClick={this.resetValues}>סגירה
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
        }
    }
    saveChanges = () => {
        let elements = document.getElementsByClassName("editUser");
        this.change_classes();
        for (let elementsKey in elements) {
            let elementsIndex = elements[elementsKey]
            if (elementsIndex.value === "" || elementsIndex.value == null) {
                continue;
            }
            let elementID = elementsIndex.id
            switch (elementID) {
                case "fn":
                    this.change_first_name();
                    break;
                case "ln":
                    this.change_last_name();
                    break;
                case "email-input":
                    this.changeEmail();
                    break;
                case "password":
                    this.changePassword();
                    break;
                case "id":
                    this.changeID();
                    break;
                case "pn":
                    this.change_phone_number();
                    break;
                case "doc":
                    this.change_day_off_counter();
                    break;
                case "admin":
                    this.change_admin()
                    break;
                case "role":
                    this.change_role();
                    break;
                case "birthday":
                    this.change_birth_day();
                    break;
                case "cycle":
                    this.change_cycle();
                    break;
                case "rabbi":
                    this.change_class();
                    break

            }
        }
        this.updateStudents();
    }
    change_first_name = () => {
        let val = document.getElementById("fn").value
        if (val == null || val.trim() === "") {
            return;
        }
        updateStudent(this.props.userProps.email, this.props.userProps.password, "first_name", val, this.state.student.email);
    }
    change_last_name = () => {
        let val = document.getElementById("ln").value
        if (val == null || val.trim() === "") {
            return;
        }
        updateStudent(this.props.userProps.email, this.props.userProps.password, "last_name", val, this.state.student.email);
    }
    changeEmail = () => {
        let val = document.getElementById("email-input").value
        if (val == null || val.trim() === "") {
            return;
        }
        updateStudent(this.props.userProps.email, this.props.userProps.password, "email", val, this.state.student.email);
    }
    changePassword = () => {
        let val = document.getElementById("password").value
        if (val == null || val.trim() === "") {
            return;
        }
        changeStudentPassword(this.props.userProps.email, this.props.userProps.password, val, this.state.student.email)
    }
    changeID = () => {
        let val = document.getElementById("id").value
        if (val == null || val.trim() === "") {
            return;
        }
        updateStudent(this.props.userProps.email, this.props.userProps.password, "id", val, this.state.student.email);
    }
    change_phone_number = () => {
        let val = document.getElementById("pn").value
        if (val == null || val.trim() === "") {
            return;
        }
        updateStudent(this.props.userProps.email, this.props.userProps.password, "phone_number", val, this.state.student.email);
    }
    change_day_off_counter = () => {
        let val = document.getElementById("doc").value
        if (val == null || val.trim() === "") {
            return;
        }
        updateStudent(this.props.userProps.email, this.props.userProps.password, "day_off_counter", val, this.state.student.email);
    }
    change_role = () => {
        let val = document.getElementById("role").value
        if (val == null || val.trim() === "") {
            return;
        }
        updateStudent(this.props.userProps.email, this.props.userProps.password, "role", val, this.state.student.email);
    }
    change_admin = () => {
        let val = document.getElementById("admin").value
        if (val == null || val.trim() === "") {
            return;
        }
        updateStudent(this.props.userProps.email, this.props.userProps.password, "admin", val, this.state.student.email);
    }
    change_birth_day = () => {
        let val = document.getElementById("birthday").value
        if (val == null || val.trim() === "") {
            return;
        }
        updateStudent(this.props.userProps.email, this.props.userProps.password, "birthday", val, this.state.student.email);
    }
    change_cycle = () => {
        let val = document.getElementById("cycle").value
        if (val == null || val.trim() === "") {
            return;
        }
        updateStudent(this.props.userProps.email, this.props.userProps.password, "cycle", val, this.state.student.email);
    }
    change_class = () => {
        let val = document.getElementById("rabbi").value
        if (val == null || val.trim() === "") {
            return;
        }
        updateStudent(this.props.userProps.email, this.props.userProps.password, "class", val, this.state.student.email);
    }
    change_classes = () => {
        let elements = document.getElementById("CheckBoxDropdown").children;
        let list = []
        HTMLCollection.prototype.forEach = Array.prototype.forEach;
        elements.forEach((child) => {
            list.push(child.children[1].id, child.children[1].checked)
        })
        changeClassesForUser(this.state.student.uuid, list)
    }

    movePage(page) {
        if ((this.state.page === 0 && page === -1) || (page === 1 && this.state.students.length < (this.state.page + 1) * 50)) {
            return;
        }
        this.setState({page: this.state.page + page})

    }

    getCards = () => {
        let map = this.state.images;
        let list1 = this.state.students.filter((student) => {
            return ((student.first_name.includes(this.state.searchFirstName) && student.last_name.includes(this.state.searchLastName)) || student.last_name.includes(this.state.searchFirstName))
        })
        if (list1.length == 0) {
            return (<div className={"display-5 text-center text-danger"}>
                איו מידע
            </div>);
        }
        let arr2 = [];
        for (let i = this.state.page * 50; i < 50 * (this.state.page + 1); i++) {
            if (list1[i] == null) {
                break;
            }
            let user = list1[i];
            arr2.push(<div className={"card hover-shadow-strong d-flex flex-column justify-content-between"}>
                <div
                    onClick={() => this.selectStudent(user)
                    }
                    data-toggle={this.props.userProps.admin == "admin" || this.props.userProps.admin == "operator" ? "modal" : "nothing"}
                    data-target={this.props.userProps.admin == "admin" || this.props.userProps.admin == "operator" ? "#myModal" : "nothing"}>
                    <img
                        className={map.get(user.uuid) == "assets/profile.svg" ? "profileImg card-img-top" : "profileImg object-fit-cover card-img-top"}
                        src={map.get(user.uuid) == "assets/profile.svg" ? defaultImage : "https://bmdcny.com/" + map.get(user.uuid)}
                        alt={"Profile Image"}/>
                    <div
                        className={"card-body resize-text d-flex flex-column" + this.birthdayThisMonth(user.birthday)}>
                        <h5 className="card-title fw-bold">{user.last_name + " " + user.first_name}</h5>
                        <i className="fw-bold card-text">{user.email} </i>
                        <i className="fw-bold card-text">{user.phone_number} </i>
                        <i className="card-text">תאריך לידה: {this.getBirthday(user.birthday)}</i>
                        <i className="card-text"> מחזור: {user.cycle} </i>
                    </div>
                </div>
                {this.getButton(this.props.userProps.admin, user)}
            </div>);
        }
        return (<div className={"grid-wrapper"}>{arr2}</div>)
    }


    getAdminEdit() {
        if (this.props.userProps.admin == "operator") {
            return (<div className={"mb-1"}>
                <span className={"fw-bold"}>סטטוס</span>
                <div className={"d-flex"}>
                    <input list={"admin-list"}
                           id={"admin"}
                           placeholder={this.state.student.admin}
                           className={"input-group-text editUser"}
                    />
                    <datalist id={"admin-list"}>
                        <option value={"admin"}/>
                        <option value={"student"}/>
                        <option value={"operator"}/>
                        <option value={"teacher"}/>
                    </datalist>
                </div>
            </div>)
        } else {
            return null
        }
    }

    getPassword() {
        if (this.props.userProps.admin) {
            return (<div
                className={"mb-1"}>
                <span className={"fw-bold"}>סיסמה</span>
                <div className={"d-flex"}>
                    <input id={"password"} type={"text"}
                           placeholder={this.state.student.password}
                           className={"input-group-text editUser"}
                    />
                </div>
            </div>)
        } else {
            return null
        }
    }

    searchByName = () => {
        let name = document.getElementById("first_name").value.split(" ")

        this.setState({
            page: 0, searchFirstName: name[0], searchLastName: name[1] ? name[1] : ""
        })
    }

    getButton = (admin, user) => {
        let link = this.creatLinkToWhatsapp(user);
        return (<img onClick={() => {
            window.open(link, '_blank');
        }} width={50} src={"https://bmdcny.com/assets/whatsapp.svg"}
                     className={"start-0 bottom-0 position-absolute"} alt={"whatsapp"}/>)
    }

    creatLinkToWhatsapp(user) {
        let link = "https://wa.me/+972"
        let phone = ""
        for (let i = 1; i < user.phone_number.length; i++) {
            phone += user.phone_number[i];
        }
        link += phone
        return link;
    }

    selectStudent = (user) => {
        load_data_getClassesForUser(this, user.uuid)
        let student2 = {
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.phone_number,
            id: user.id,
            day_off_counter: user.day_off_counter,
            email: user.email,
            admin: user.admin,
            uuid: user.uuid,
            password: user.password,
            birthday: user.birthday,
            cycle: user.cycle,
            class: user.class,
            role: user.role
        }
        this.setState({student: student2})
    }

    getClassesForCheckBox = () => {
        let elements = [];
        if (this.state.classesForUser == null) {
            return (<div className={"text-center"}>
                <div className="spinner-border text-primary" role="status">
                </div>
            </div>)
        } else {
            let listOfClasses = this.state.classesForUser[0];
            Object.keys(listOfClasses).forEach((key) => {
                if (key != "uuid") {
                    elements.push(
                        <div className="d-flex justify-content-between w-75 m-auto">
                            <label className="form-label text-primary"
                                   htmlFor={key}> {(key).replace("_", " ")}</label>
                            <input id={key}
                                   type={"checkbox"}
                                   className="m-1 form-check-input"
                                   defaultChecked={listOfClasses[key] == 1 ? true : false}
                            />
                        </div>
                    )
                }
            })
        }
        return (<div className="dropdown-menu overflow-auto" style={{maxHeight: "160px"}
            } id={"CheckBoxDropdown"} aria-labelledby="dropdownMenuButton1">
                {elements}
            </div>
        )

    }

    getBirthday(birthday) {
        let date = '';
        for (let i = 0; i < 7; i++) date += birthday[i]
        return date
    }

    birthdayThisMonth(birthday) {
        let month = birthday[5] + birthday[6]
        if (month === (new Date().getMonth() + 1)) {

            return "bg-primary"
        }
        return "";
    }

    updateStudents = () => {
        this.resetValues()
        let temp = load_all_students(this.props.userProps.email, this.props.userProps.password, false)
        toast.success("הפעולה בוצעה בהצלחה");
        this.setState({students: temp})
    }
    resetValues = () => {
        let el = document.getElementsByClassName("editUser");
        for (let elElement of el) {
            elElement.value = null;
        }
    }
}
