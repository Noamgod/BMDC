import $ from 'jquery';
import {formatDate} from "../SendRequest/SendRequest";


const CryptoJS = require('crypto-js');

const MONTHS = ["january", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
let currentRequestQueries = {}
let currentRequestCounter = 4;
let profileQueries = {}
let profileCounter = 4;
let eventQueries = {}
let eventsCounter = 2;
let studentQueries = {}
let studentCounter = 2;
let netunimCounter = 3;
let netunimQueries = {};
let attendanceCounter = 2;
let attendanceQueries = {};

export function encrypt(text) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text))
}


export function load_all_data_getUserLastMonthPercent(email, password, that) {
    let x = new Map();
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "Adb.php",
        data: {type: "getAllUserLastMonthPercent", email: email, password: password},
        async: true,
        success: function (data) {
            for (let i = 0; i < data.length; i++) {
                x.set(data[i].uuid, data[i].percent);
            }
            currentRequestQueries["allPercent"] = x;
            currentRequestCounter -= 1;
            finishedCurrentRequest(that)
            return x;
        },
        error: function (error) {
            console.log("getAllUserLastMonthPercent", error);
        }
    })
    return x;
}

export function load_data_updateLoginDate(uuid) {
    let x = null;
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "Udb.php",
        data: {type: "updateLoginDate", date: formatDate(new Date()), uuid: uuid},
        async: true,
        success: function (data) {
        },
        error: function (error) {
            console.log("error", error);
        }
    });
    return x;
}

export function load_data_getUserLastMonthPercent(email, password, that) {
    let x = null;
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "Udb.php",
        data: {type: "getUserLastMonthPercent", email: email, password: password},
        async: true,
        success: function (data) {
            x = data;
            that.props.text = x + "%"
            that.setState({percent: x})

        },
        error: function (error) {
            console.log("error", error);
        }
    });
    return x;
}

export function load_data_get_Attend_LastMonthPercent_for_teacher(email, password, that) {
    let x = null;
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "Udb.php",
        data: {type: "Attend_MonthPercent_for_teacher", email: email, password: password},
        async: true,
        success: function (data) {
            console.log(data)
            x = data;
            that.props.text = x + "%"
            that.setState({percent: x})
        },
        error: function (error) {
            console.log("error", error);
        }
    });
    return x;
}

export function load_data_login(email, password) {
    let x = null;
    $.ajax({
        url: "Udb.php",
        type: "POST",
        data: {type: "login", email: email, password: encrypt(password)},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            x = response
            return x;
        },
        error: function (error) {
            console.log(error)
            x = null;
        }
    })
    return x;
}


export function load_data_singleUserDataByQuery(email, password, that) {
    let x = null;

    $.ajax({
        url: "Udb.php",
        type: "POST",
        data: {type: "userDataByQuery", email: email, password: password},
        dataType: 'json',
        timeout: 2000,
        async: that !== false,
        success: function (response) {
            x = response
            if (that == false) {
                return x
            }
            profileQueries["userData"] = x
            profileCounter -= 1
            finishedProfile(that)
            return x;
        },
        error: function (error) {
            console.log(error)
            x = null;
        }
    })
    return x;
}

export function load_data_events(email, password, that) {
    let list = [];
    $.ajax({
        url: "Edb.php",
        type: "POST",
        data: {type: "getAllEvents", email: email, password: password},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                list.push(response[i]);
            }
            eventsCounter -= 1;
            eventQueries["list"] = list;
            finishedEvents(that);
            return list
        },
        error: function (error) {
            console.log("error", error);
        }
    })
    return list;
}

function finishedEvents(that) {
    if (eventsCounter == 0) {
        eventsCounter = 2;
        that.setState({loading: false, eventList: eventQueries["list"], inEventList: eventQueries["inEventList"]})
    }
}

export function load_data_insertID(id) {
    let x = null
    $.ajax({
        url: "Udb.php",
        type: "POST",
        data: {type: "InsertIdToIds", id: id},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            return x;
        },
        error: function (error) {
            console.log("addPeopleToEvents " + error)
        }
    })
}

export function add_Task(data) {
    let x = null
    $.ajax({
        url: "Tdb.php",
        type: "POST",
        data: {type: "add_task", data: data},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            return response;
        },
        error: function (error) {
            console.log("add_task error:  " + error)
        }
    })
}

export function load_data_inEvent(email, password, that, bool) {
    let list = [];
    $.ajax({
        url: "Edb.php",
        type: "POST",
        data: {type: "getPeopleInEvent", email: email, password: password},
        dataType: 'json',
        timeout: 2000,
        async: bool,
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                list.push(response[i]);
            }
            if (bool) {
                eventsCounter -= 1;
                eventQueries["inEventList"] = list
                finishedEvents(that)
            }
            return list
        },
        error: function (error) {
            console.log("error", error);
        }
    })
    return list;
}

// Not in use
// export function load_data_inEvent_for_specific(that, bool, title) {
//     let list = [];
//     $.ajax({
//         url: "Edb.php",
//         type: "POST",
//         data: {type: "load_data_inEvent_for_specific", title: title},
//         dataType: 'json',
//         timeout: 2000,
//         async: bool,
//         success: function (response) {
//             for (let i = 0; i < response.length; i++) {
//                 list.push(response[i]);
//             }
//             return list
//         },
//         error: function (error) {
//             console.log("error", error);
//         }
//     })
//     return list;
// }

export function load_data_signUp(userInfo) {
    let x = null;

    $.ajax({
        url: "Udb.php",
        type: "POST",
        data: {
            type: "signUp",
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            email: userInfo.email,
            password: encrypt(userInfo.password),
            id: userInfo.id,
            phone_number: userInfo.phone_number,
            birthday: userInfo.birthday,
            cycle: userInfo.cycle,
            class: userInfo.class,
            secondClass: userInfo.secondClass,
        },
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            x = response
            return x;
        },
        error: function (error) {
            x = error;
        }
    })
    return x;
}


export function load_data_sendRequest(email, password, date, reason) {
    let x = null;
    $.ajax({
        url: "Udb.php",
        type: "POST",
        data: {
            type: "sendRequest",
            email: email,
            password: password,
            date: date,
            reason: reason.replace(/'/g, '\\\'')
        },
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            x = response;
            return x;
        },
        error: function (error) {
            console.log("error is ", error)
            x = null;
        }
    })
    return x;

}

export function getUserAttendanceHistory(email, password, that) {
    let x = null;
    $.ajax({
        url: "Adb.php",
        type: "POST",
        dataType: "json",
        data: {type: "getUserAttendance", email: email, password: password},
        timeout: 2000,
        async: true,
        success: function (response) {
            that.setState({loadingAttendanceHistory: false, attendanceHistory: response})
        },
        error: function (error) {
        }
    })
    return x;
}


export function load_data_currentRequests(email, password, that) {
    let list = [];
    $.ajax({
        url: "Udb.php",
        type: "POST",
        data: {type: "getRequests", email: email, password: password},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                list.push(response[i]);
            }
            profileQueries["list"] = list
            profileCounter -= 1
            finishedProfile(that)
        },
        error: function (error) {
            console.log("error", error);
        }
    })
    return list;
}

export function load_data_allRequestsByQuery(email, password, date, text, allRequests, that) { //fixed
    let list = [];
    $.ajax({
        url: "Udb.php",
        type: "POST",
        data: {
            type: "allRequestsByQuery",
            email: email,
            password: password,
            allRequests: allRequests,
            date: date,
            text: text
        },
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                list.push(response[i]);
            }

            load_data_DaysOffHash(that, email, password)//this function is finished
            load_data_AbsentsOnDate(that) //check this one
            load_all_data_getUserLastMonthPercent(email, password, that) //this function is finished

            currentRequestQueries["list"] = list
            currentRequestCounter -= 1

            finishedCurrentRequest(that)

            return list
        },
        error: function (error) {
            console.log("error", error);
        }
    })
    return list;
}

function finishedCurrentRequest(that) {
    if (currentRequestCounter == 0) {
        currentRequestCounter = 4;
        that.setState({
            list: currentRequestQueries["list"],
            dayOffHash: currentRequestQueries["daysOff"],
            absentsOnDate: currentRequestQueries["absents"],
            allPercent: currentRequestQueries["allPercent"],
            loading: false
        })
    }
}

function finishedProfile(that) {
    if (profileCounter == 0) {
        profileCounter = 4
        that.setState({
            loading: false,
            list: profileQueries["list"],
            userProps: profileQueries["userData"],
            days_in_month: profileQueries["daysInMonth"],
            days_of_attendance: profileQueries["days_of_attendance"]
        })
    }
}

export function load_data_AbsentsOnDate(that) {
    let x = new Map();
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "AbsentOnDate", email: that.props.userProps.email, password: that.props.userProps.password},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            if (response) {
                for (let i = 0; i < response.length; i++) {
                    x.set(response[i].date, response[i].count)
                }
            } else
                x = null
            currentRequestQueries["absents"] = x
            currentRequestCounter -= 1;
            finishedCurrentRequest(that)
            return x
        },
        error: function (error) {
            console.log("error", error);
        }
    })
    return x;
}

export function load_data_deleteRequest(email, password, date) {
    let x = null
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "deleteRequest", email: email, password: password, date: date},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            x = response
            return x
        },
        error: function (error) {
            console.log("error", error);
        }
    })

}

export function load_data_updateRequestByQuery(email, password, date, id, update ) {
    let x = null
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "updateRequestStatus", email: email, password: password, date: date, id: id, update: update},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            x = response
            return response
        },
        error: function (error) {
            console.log("error", error);
        }
    })
    return x;
}

export function load_data_lowerDaysOff(email, password, id, update) {
    let x = null
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "lowerDaysOff", email: email, password: password, update: update, id: id},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            x = response
            e.disabled = false;
            return response
        },
        error: function (error) {
            console.log("error", error);
        }
    })
    return x;
}

export function load_data_DaysOffHash(that, email, password) {
    let x = new Map();
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "daysOffHash", email: email, password: password},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                x.set(response[i].uuid, [response[i].day_off_counter, response[i].email])
            }
            currentRequestQueries["daysOff"] = x
            currentRequestCounter -= 1;
            finishedCurrentRequest(that)
            return x
        },
        error: function (error) {
            console.log("error", error);
        }
    })
    return x;
}

export function insert_data_addToEvent(password, email, uuid, event_title, full_name) {
    let x = null
    $.ajax({
        url: "Edb.php",
        type: "POST",
        data: {
            type: "addPeopleToEvents",
            password: password,
            email: email,
            uuid: uuid,
            event_title: event_title,
            full_name: full_name
        },
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            console.log("successfully added to event");
        },
        error: function (error) {
            console.log("addPeopleToEvents " + error)
        }
    })
}

export function insert_data_event(password, email, event_title, description, time) {
    let x = null;

    $.ajax({
        url: "Edb.php",
        type: "POST",
        data: {
            type: "insertEvent",
            password: password,
            email: email,
            event_title: event_title,
            description: description,
            time: time
        },
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            return x
        },
        error: function (error) {
            console.log("insert_data_event", error);
        }
    })
    return x;
}

export function update_data_studentCount(sql) {
    $.ajax({
        url: "Udb.php",
        type: "POST",
        data: {type: "updateStudentCount", sql: sql},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {

        },
        error: function (error) {
            console.log("updateStudentCount", error)
        }
    })
}

export function get_student_count(that) {
    let x = null;
    $.ajax({
        url: "Udb.php",
        type: "POST",
        data: {type: "getStudentCount"},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            x = response;
            that.setState({studentCount: x, loading: false})
        },
        error: function (error) {
            console.log("getStudentCount", error)
        }
    })
    return x;
}

export function delete_data_removeFromEvent(email, password, event_title, uuid) {
    let x = null;
    $.ajax({
        url: "Edb.php",
        type: "POST",
        data: {type: "removeFromEvent", email: email, password: password, event_title: event_title, uuid: uuid},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            x = response
        },
        error: function (error) {
            console.log("removeFromEvent error", error)
        }
    })
    return x;
}

export function delete_data_event(password, email, event_title) {
    let x = null;

    $.ajax({
        url: "Edb.php",
        type: "POST",
        data: {type: "deleteEvent", password: password, email: email, event_title: event_title},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            x = response

            return x
        },
        error: function (error) {
            console.log("deleteEvent Error", error);
        }
    })
    return x;
}

export function update_data_newPassword(email, newPassword, tempCode) {
    $.ajax({
        url: "Udb.php",
        type: "POST",
        data: {type: "updateUserPassword", email: email, newPassword: encrypt(newPassword), tempCode: tempCode},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            alert(response)
        },
        error: function (error) {
            console.log("updateUserPassword", error)
        }

    })
}


export function delete_data_inEvent(password, email, event_title) {
    let x;
    $.ajax({
        url: "Edb.php",
        type: "POST",
        data: {type: "deletePeopleInEvent", password: password, email: email, event_title: event_title},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {

        },
        error: function (error) {
            console.log("deletePeopleInEvent", error)
        }
    })
}

//Dont need this anymore but could be useful in the future

// export function load_data_getAllEmails(email) {
//     let list = [];
//     $.ajax({
//         url: "Edb.php",
//         type: "POST",
//         data: {type: "loadAllEmails", email: email},
//         dataType: 'json',
//         timeout: 2000,
//         async: false,
//         success: function (response) {
//             for (let i = 0; i < response.length; i++) {
//                 list.push(response[i]);
//             }
//             return list;
//         },
//         error: function (error) {
//             console.log("loadAllEmails", error)
//         }
//     })
//     return list;
// }

//ajax function that sends a mail to a specific email with a secret code
export function sendMail_secretCode(to, sub) {
    $.ajax({
        url: "email.php",
        type: "POST",
        data: {type: "secretCode", to: to, sub: sub},
        dataType: 'json',
        timeout: 10000,
        async: true,
        success: function (response) {
        },
        error: function (error) {
            console.log("mail", error)
        }
    })
}

export function load_data_checkInAuth(email, tempCode) {
    let x = null;
    $.ajax({
        url: "Auth_db.php",
        type: "POST",
        data: {type: "checkAuth", email: email, tempCode: tempCode},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            x = response
            return x;
        },
        error: function (error) {
            console.log(error)
            x = null;
        }
    })
    return x;
}

export function getAttendanceListByMonth(email, password, month) {
    let x = null;
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "getAttendanceListByMonth", email: email, password: password, month: month},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            x = response
            return x;
        },
        error: function (error) {
            console.log(error)
            x = null;
        }
    })
    return x;
}

export function sendMail(email, password, to, sub, msg) {
    $.ajax({
        url: "email.php",
        type: "POST",
        data: {type: "adminMail", email: email, password: password, to: to, sub: sub, msg: msg},
        dataType: 'json',
        timeout: 10000,
        async: true,
        success: function (response) {
        },
        error: function (error) {

        }
    })
}

export function sendMailEventList(email, password, to, sub, msg) {
    $.ajax({
        url: "email.php",
        type: "POST",
        data: {type: "moderatorMail", email: email, password: password, to: to, sub: sub, msg: msg},
        dataType: 'json',
        timeout: 10000,
        async: true,
        success: function (response) {
        },
        error: function (error) {

        }
    })
}

export function sendMailFrom(to, sub, msg, from) {
    $.ajax({
        url: "email.php",
        type: "POST",
        data: {type: "single", to: to, sub: sub, msg: msg, from: from},
        dataType: 'json',
        timeout: 10000,
        async: true,
        success: function (response) {
        },
        error: function (error) {
        }
    })
}

export function uploadImage(form, userUUID, that, email, password) {
    let form_data = new FormData(form)
    form_data.append("uuid", userUUID)
    form_data.append("type", "uploadImage")
    form_data.append("email", email)
    form_data.append("password", password)
    $.ajax({
        url: "Idb.php",
        type: "POST",
        data: form_data,
        dataType: 'JSON',
        processData: false,
        contentType: false,
        timeout: 15000,
        async: true,
        success: function (response) {
            if (response == "successfully uploaded image") {
                getImage(email, password, that)
            } else {
                alert(response)
            }
            that.setState({imgLoading: false})
        },
        error: function (error) {
            that.setState({imgLoading: false})
            alert("Error while uploading image.")
            console.log("Error", error)
        }
    })
    return "Uploaded Image"
}

export function load_data_allImages(email, password, that) {
    let urlHash = new Map();
    $.ajax({
        url: "Idb.php",
        type: "POST",
        data: {type: "getAllImages", email: email, password: password},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                urlHash.set(response[i].uuid, response[i].img_name)
            }
            studentCounter -= 1;
            studentQueries["images"] = urlHash
            finishedStudents(that)
        },
        error: function (error) {
            console.log("Error", error)
        }
    })
    return urlHash
}


export function getImage(email, password, that) {
    let url;
    $.ajax({
        url: "Idb.php",
        type: "POST",
        data: {type: "getImage", email: email, password: password},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            url = response;
            that.setState({imgLoading: false, image: "https://chedvata.com/" + url.img_name})
        },
        error: function (error) {
            console.log("Error", error)
        }
    })
    return url
}

export function load_all_students(email, password, that) {
    let x;
    $.ajax({
        url: "Udb.php",
        type: "POST",
        data: {type: "lodeAllStudents", email: email, password: password},
        dataType: 'json',
        timeout: 2000,
        async: that !== false,
        success: function (response) {
            x = response
            if (that !== false) {
                load_data_allImages(email, password, that)
                studentCounter -= 1
                studentQueries["students"] = x
                finishedStudents(that)
            }
            return x;
        },
        error: function (error) {
            console.log(error)
            x = null;
        }
    })
    return x;
}


export function load_all_info(email, password, that) {
    let x;
    $.ajax({
        url: "Udb.php",
        type: "POST",
        data: {type: "lodeAllStudents", email: email, password: password},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            x = response
            netunimQueries["data"] = x
            netunimCounter -= 1
            finishedNetunim(that)
            return x;
        },
        error: function (error) {
            console.log(error)
            x = null;
        }
    })
    return x;
}

function finishedStudents(that) {
    if (studentCounter == 0) {
        studentCounter = 2
        that.setState({
            images: studentQueries["images"],
            students: studentQueries["students"],
            loading: false,
            runAjax: false
        })
    }

}

export function load_data_setImagePath(path, email, password) {
    let x;
    $.ajax({
        url: "Idb.php",
        type: "POST",
        data: {type: "defaultImg", path: path, email: email, password: password},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            x = response
            return x;
        },
        error: function (error) {
            console.log(error)
            x = null;
        }
    })
    return x;
}

export function updateStudent(email, password, changing, newValue, userEmail) {
    let x;
    $.ajax({
        url: "Udb.php",
        type: "POST",
        data: {
            type: "updateStudent",
            email: email,
            password: password,
            changing: changing,
            newValue: newValue,
            userEmail: userEmail
        },
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            x = response
            return x;
        },
        error: function (error) {
            console.log(error)
            x = null;
        }
    })
    return x;
}

export function changeStudentPassword(email, password, newPassword, userEmail) {
    let x;
    $.ajax({
        url: "Udb.php",
        type: "POST",
        data: {
            type: "changeStudentPassword",
            password: password,
            email: email,
            newPassword: encrypt(newPassword),
            userEmail: userEmail
        },
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            x = response
            return x;
        },
        error: function (error) {
            console.log(error)
            x = null;
        }
    })
    return x;
}


export function attendance(id, date, addDay, that) {
    let x;
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "attendance", id: id, date: date, addDay: addDay},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            x = response
            that.setState({hashMap: already_attendance()})
        },
        error: function (error) {
            console.log("attendance dont work: ", error)
            x = null
        }

    })
    return x;
}

export function attendanceEdit(id, date, addDay) {
    let x;
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "attendance", id: id, date: date, addDay: addDay},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            x = response
        },
        error: function (error) {
            console.log("attendance dont work: ", error)
            x = null
        }

    })
    return x;
}

export function update_student_attendance(uuid, date, status) {
    let x;
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "update_student_attendance", uuid: uuid, date: date, status: status},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            x = response
        },
        error: function (error) {
            console.log("update_attendance_status dont work: ", error)
            x = null
        }

    })
    return x;
}

export function insert_into_attendance(uuid, status, date, first_name, last_name) {
    let x;
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {
            type: "insert_into_attendance",
            uuid: uuid,
            date: date,
            first_name: first_name,
            last_name: last_name,
            status: status
        },
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            x = response
        },
        error: function (error) {
            console.log("update_attendance_status dont work: ", error)
            x = null
        }

    })
    return x;
}

export function load_data_getRegisteredStudentsForRabbiByDate(email, password, date, that) {
    let x;
    $.ajax({
        url: "Udb.php",
        type: "POST",
        data: {type: "get_registered_students_for_rabbi",email:email, password:password, date: date},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            x = response
            attendanceCounter -= 1;
            attendanceQueries["registered_students"] = x;
            finishedAttendance(that);
        },
        error: function (error) {
            console.log(error)
            x = null
        }

    })
    return x;
}

export function load_data_getUnRegisteredStudentsForRabbiByDate(email, password, date, that) {
    let x;
    $.ajax({
        url: "Udb.php",
        type: "POST",
        data: {type: "get_unregistered_students_for_rabbi", email:email, password:password, date: date},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            x = response
            attendanceCounter -= 1;
            attendanceQueries["unregistered_students"] = x;
            finishedAttendance(that);
        },
        error: function (error) {
            console.log(error)
            x = null
        }

    })
    return x;
}

export function already_attendance() {
    let x = new Map();
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "already_attendance"},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                x.set(response[i].id, [response[i].date, response[i].todays_attendance])
            }
            return x;
        },
        error: function (error) {
            console.log("already_attendance not work: ", error)
            x = null
        }

    })
    return x;
}

export function set_days_in_month(days) {
    let x;
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "days_in_month", days: days},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            x = response;
        },
        error: function (error) {
            console.log("days_in_month not work: ", error)
            x = null
        }

    })
    return x;
}

export function load_data_daysOfAttendance(email, password, that) {
    let x;
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "presence", email: email, password: password},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            x = response;
            profileQueries["days_of_attendance"] = x.days;
            profileCounter -= 1;
            finishedProfile(that)
        },
        error: function (error) {
            console.log("presence not work: ", error)
            x = null
        }

    })
    return x;
}

function finishedAttendance(that) {
    if (attendanceCounter === 0) {
        attendanceCounter = 2;
        that.setState({
            registeredStudents: attendanceQueries['registered_students'],
            unregisteredStudents: attendanceQueries['unregistered_students'],
            loading: false
        })
    }
}

function finishedNetunim(that) {
    if (netunimCounter == 0) {
        that.setState({
            loading: false,
            data: netunimQueries["data"],
            map_attendance: netunimQueries["map_attendance"],
            daysInMonth: netunimQueries["daysInMonth"]
        })
        netunimCounter = 3;
    }

}

export function load_data_getAllUserAttendanceHistory(email, password, that) {
    let x;
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "get_all_user_attendance_history", email: email, password: password},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            let map = new Map();
            for (let i = 0; i < response.length; i++) {
                map.set(response[i].uuid, [response[i].January, response[i].February, response[i].March, response[i].April, response[i].May, response[i].June, response[i].July, response[i].August, response[i].September, response[i].October, response[i].November, response[i].December])
            }
            that.setState({allUserAttendanceHistory: map, loadingAllUserAttendanceHistory:false})
        },
        error: function (error) {
            console.log("get_all_user_attendance_history not work: ", error)
            x = null
        }

    })
    return x;
}
export function load_data_getAllUserAttendanceHistoryFor_nochcut(email, password, that) {
    let x;
    let date = new Date();
    date.setMonth(date.getMonth()-1)
    let month= date.toLocaleString('default', { month: 'long' });
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "get_all_user_attendance_history_for_nochut", email: email, password: password,month:month},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            let map = new Map();
            for (let i = 0; i < response.length; i++) {
                map.set(response[i].uuid, response[i].month)
            }
            console.log(map)
            that.setState({map_attendanceHistory: map})
        },
        error: function (error) {
            console.log("get_all_user_attendance_history not work: ", error)
            x = null
        }

    })
    return x;
}

export function load_data_daysOfAttendance_for_all_students(that) {
    let x = new Map();
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "presence_for_all_students"},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                x.set(response[i].uuid, response[i].days)
            }
            netunimQueries["map_attendance"] = x;
            netunimCounter -= 1;
            finishedNetunim(that)
        },
        error: function (error) {
            console.log("presence not work: ", error)
            x = null
        }

    })
    return x;
}
export function load_data_daysOfAttendance_for_all_students_to_nochcut(that) {
    let x = new Map();
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "presence_for_all_students"},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                x.set(response[i].uuid, response[i].days)
            }
          that.setState({map_attendance: x})
        },
        error: function (error) {
            console.log("presence not work: ", error)
            x = null
        }

    })
    return x;
}


export function load_data_daysInMonth_for_Table(email, password, that) {
    let x;
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "getDays", email: email, password: password},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            x = response;
            netunimCounter -= 1;
            netunimQueries["daysInMonth"] = x;
            finishedNetunim(that)
        },
        error: function (error) {
            console.log("getDays not work: ", error)
            x = null
        }

    })
    return x;
}

export function load_data_daysInMonth(email, password, that) {
    let x;
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "getDays", email: email, password: password},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            x = response;
            profileQueries["daysInMonth"] = x.days;
            profileCounter -= 1;
            finishedProfile(that);
        },
        error: function (error) {
            console.log("getDays not work: ", error)
            x = null
        }

    })
    return x;
}

export function load_data_daysInMonth_for_Nochcut(email, password, that) {
    let x;
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "getDays", email: email, password: password},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            x = response;
            that.setState({daysInMonth: x})
        },
        error: function (error) {
            console.log("getDays not work: ", error)
            x = null
        }

    })
    return x;
}


export function reset_days_to_new_month(days) {
    let x;
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "reset_days_to_new_month", days: days, month: MONTHS[new Date().getMonth()]},
        dataType: 'json',
        timeout: 3000,
        async: false,
        success: function (response) {
            x = response;
        },
        error: function (error) {
            x = error
        }

    })
    return x;
}

export function delete_User(email, password, id) {
    let x;
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "delete_User", id: id, email: email, password: password},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            x = response;
        },
        error: function (error) {
            console.log("success", error)
            x = error
        }
    })
    return x;
}

/*export function just_Once() {
    let email = [];
    let map = [];
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "justOnce"},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                email[i] = response[i].email;
                map[i] = encrypt(response[i].password);
            }
            console.log("success form just_Once")
            console.log("response: ", response)
            console.log("map", map)
            console.log("email", email)
            console.log("End logs from just_Once")
            getAllPasswords(map, email);

        },
        error: function (error) {
            console.log("success", error)

        }
    })
    return map;

}*/

/*export function getAllPasswords(map, Emails) {
    let x;
    $.ajax({
        url: "Adb.php",
        type: "POST",
        data: {type: "getAllPasswords", Noam: map, Emails: Emails},
        dataType: 'json',
        timeout: 2000,
        async: false,
        success: function (response) {
            x = response;
        },
        error: function (error) {
            console.log("success", error)
            x = error
        }
    })
    return x;
}*/

export function load_data_downloadAttendance_for_all_students(email, password, that) {
    let x;
    const current = new Date();
    current.setMonth(current.getMonth()-1);
    $.ajax({
        url: "downloadAttendance.php",
        type: "POST",
        data: {type: "downloadAttendance_for_all_students", email: email, password: password, month: "December"},
        dataType: 'json',
        timeout: 10000,
        async: true,
        success: function (response) {
            x = response;
            that.setState({loadingAttendanceHistory: false, attendanceHistory: x})
        },
        error: function (error) {
            console.log("error", error)
            x = error
        }
    })
    return x;
}

export function load_data_getTickets(that) {
    let x, temp = that.props.userProps;
    $.ajax({
        url: "Tdb.php",
        type: "POST",
        data: {type: "getTickets", email: temp.email, password: temp.password, role: temp.role, uuid: temp.uuid},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            x = response;
            load_data_countStatus(temp.email, temp.password, temp.role, that, x);
        },
        error: function (error) {
            console.log("getTickets not work: ", error)
            x = null
        }
    })
    return x;
}

export function update_status_ticket(id, status) {
    let x;
    $.ajax({
        url: "Tdb.php",
        type: "POST",
        data: {type: "update_status_ticket", id: id, status: status},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            x = response;
        },
        error: function (error) {
            console.log("update_status_ticket error: ", error)
            x = null
        }
    })
    return x;
}

export function update_priority_ticket(id, priority) {
    let x;
    $.ajax({
        url: "Tdb.php",
        type: "POST",
        data: {type: "update_priority_ticket", id: id, priority: priority},
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            x = response;
        },
        error: function (error) {
            console.log("update_status_ticket error: ", error)
            x = null
        }
    })
    return x;
}

export function load_data_countStatus(email, password, role, that, tickets) {
    let x;
    $.ajax({
        url: "Tdb.php",
        type: "POST",
        data: {
            type: "getCountStatus",
            email: email,
            password: password,
            role: role,
            admin: that.props.userProps.admin,
            uuid: that.props.userProps.uuid
        },
        dataType: 'json',
        timeout: 2000,
        async: true,
        success: function (response) {
            that.setState({tickets: tickets, loading: false, percentages: response})
        },
        error: function (error) {
            console.log("getCountStatus not working: ", error)
            x = null;
        }
    })
}
// export function load_data_getTeacherSederList(email, password, that){
//     let x = null;
//     $.ajax({
//         url: "Udb.php",
//         type: "POST",
//         data:{type:"getTeacherSederList", password:password, email:email},
//         dataType:'json',
//         timeout:2000,
//         async:true,
//         success:function (response) {
//             x=response;
//             that.setState({teacherSederList:x})
//         },
//         error:function (error) {
//             console.log("getTeacherSederList not working: ", error)
//
//         }
//     })
// }



