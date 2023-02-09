import React, {useState} from 'react';
import "./Calendar.css";

const hebrewLetters = {
    1: "א",
    2: "ב",
    3: "ג",
    4: "ד",
    5: "ה",
    6: "ו",
    7: "ז",
    8: "ח",
    9: "ט",
    10: "י",
    11: "יא",
    12: "יב",
    13: "יג",
    14: "יד",
    15: "טו",
    16: "טז",
    17: "יז",
    18: "יח",
    19: "יט",
    20: "כ",
    21: "כא",
    22: "כב",
    23: "כג",
    24: "כד",
    25: "כה",
    26: "כו",
    27: "כז",
    28: "כח",
    29: "כט",
    30: "ל",
    31: "לא"
}
const daysStringToInt = {
    "יום ראשון": 0, "יום שני": 1, "יום שלישי": 2, "יום רביעי": 3, "יום חמישי": 4, "יום שישי": 5, "יום שבת": 6
}
const numberToParasha = {
    0: "בראשית",
    1: "נח",
    2: "לך לך",
    3: "וירא",
    4: "חיי שרה",
    5: "תולדות",
    6: "ויצא",
    7: "וישלח",
    8: "וישב",
    9: "מקץ",
    10: "ויגש",
    11: "ויחי",
    12: "שמות",
    13: "וארא",
    14: "בא",
    15: "בשלח",
    16: "יתרו",
    17: "משפטים",
    18: "תרומה",
    19: "תצוה",
    20: "כי תשא",
    21: "ויקהל",
    22: "פקודי",
    23: "ויקרא",
    24: "צו",
    25: "שמיני",
    26: "תזריע",
    27: "מצרע",
    28: "אחרי מות",
    29: "קדושים",
    30: "אמור",
    31: "בהר",
    32: "בחוקתי",
    33: "במדבר",
    34: "נשא",
    35: "בהעלותך",
    36: "שלח לך",
    37: "קרח",
    38: "חקת",
    39: "בלק",
    40: "פנחס",
    41: "מטות",
    42: "מסעי",
    43: "דברים",
    44: "ואתחנן",
    45: "עקב",
    46: "ראה",
    47: "שופטים",
    48: "כי תצא",
    49: "כי תבוא",
    50: "נצבים",
    51: "וילך",
    52: "האזינו",
    53: "וזאת הברכה"
}
const hebrewDigit3 = {
    8: "פ",
    9: "צ",
}
const hebrewDigit4 = {
    1: "א",
    2: "ב",
    3: "ג",
    4: "ד",
    5: "ה",
    6: "ו",
    7: "ז",
    8: "ח",
    9: "ט",
}

function translateHebrewYear(year) {
    let stringYear = year.toString();
    let hebrewYear = "תש";
    hebrewYear += hebrewDigit3[stringYear[2]];
    hebrewYear += "\"";
    hebrewYear += hebrewDigit4[stringYear[3]];
    return hebrewYear;
}

export function MyCalendar(props) {
    const [date, setDate] = useState(new Date());
    let daysInMonth = GetDaysInMonth(date.getFullYear(), date.getMonth(), props.that);
    let monthInHebrewWords = date.toLocaleDateString("he-u-ca-hebrew", {month: 'long'})
    let yearInHebrewLetters = translateHebrewYear(date.toLocaleDateString("he-u-ca-hebrew", {year: 'numeric'}))
    return (
        <div>
            <div className={"d-flex w-95 m-auto flex-row justify-content-between"}>
                <div>
                    <h2 className={"fw-bold text-dark"}>
                        {yearInHebrewLetters}-{monthInHebrewWords}
                    </h2>
                </div>
                <div className={"d-flex flex-row"}>
                    <button type={"button"}
                            onClick={() => {
                                if (document.getElementById("calendar-hide").style.display == "none"){
                                    setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1))
                                    props.that.setState({date: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1), runAjax: true})
                            }
                                else
                                    setDate(new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()))
                            }}
                            className={"btn mx-1 btn-info text-black text-center"}>
                        <i className="fa fa-arrow-right" aria-hidden="true"></i>
                    </button>
                    <button type={"button"}
                            onClick={() => {
                                setDate(new Date())
                                document.getElementById("calendar-hide").style.display = "table"
                            }}
                            className={"btn mx-1 btn-info text-black text-center"} style={{}}>
                        <i className="fa fa-calendar" aria-hidden="true"></i>
                    </button>
                    <button type={"button"}
                            onClick={() => {
                                if (document.getElementById("calendar-hide").style.display == "none") {
                                    setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1))
                                    props.that.setState({date: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1), runAjax: true})
                                } else
                                    setDate(new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()))
                            }}
                            className={"btn mx-1 btn-info text-black text-center"}>
                        <i className="fa fa-arrow-left" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            <table id={"calendar-hide"} className={"table w-95 table-responsive-xxl m-auto"} style={{display: "none"}}>
                {TableHeader()}
                {TableBody(daysInMonth)}
            </table>

        </div>)

}


function GetDaysInMonth(year, month, that) {
    const [today, setDate] = useState(new Date());
    const days = [];
    let tempDate = new Date(year, month, 1);
    let start = tempDate.toLocaleDateString("he-u-ca-hebrew", {weekday: 'long'})
    let daysInLastMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    let counter = 1;
    for (let i = daysStringToInt[start]; i > 0; i--) {
        days.push(<td className={"td bg-grey"}>
            <div className={"day"}>{daysInLastMonth - i + 1}</div>
        </td>)
    }
    for (let i = daysStringToInt[start]; i < 35; i++) {
        if (tempDate.getMonth() === month) {
            if (tempDate.toLocaleDateString() === new Date().toLocaleDateString()) {
                days.push(<td onClick={() => {
                    document.getElementById("calendar-hide").style.display = "none";
                    setDate(new Date(year, month, i - daysStringToInt[start] + 1))
                    that.setState({runAjax: true, date: new Date(year, month, i - daysStringToInt[start] + 1)})
                }}
                              className={tempDate.toLocaleDateString() === today.toLocaleDateString() ? "td bg-today bg-selected" : "td bg-today"}>
                    <div className={"d-flex day flex-row justify-content-between"}>
                        <div className={"text-danger fw-bold"}>{tempDate.getDate()}</div>
                        <div
                            className={"fw-bold text-danger"}>{hebrewLetters[tempDate.toLocaleDateString("he-u-ca-hebrew", {day: 'numeric'})]}</div>
                    </div>
                </td>)
            } else if (tempDate.toLocaleDateString() === today.toLocaleDateString()) {
                days.push(<td onClick={() => {
                    document.getElementById("calendar-hide").style.display = "none";
                    setDate(new Date(year, month, i - daysStringToInt[start] + 1))
                    that.setState({runAjax: true, date: new Date(year, month, i - daysStringToInt[start] + 1)})

                }} className={"td bg-selected"}>
                    <div className={"d-flex day flex-row justify-content-between"}>
                        <div>{tempDate.getDate()}
                        </div>
                        <div
                            className={"day"}>{hebrewLetters[tempDate.toLocaleDateString("he-u-ca-hebrew", {day: 'numeric'})]}</div>
                    </div>
                </td>)
            } else if (i % 7 === 0 && i !== 0) {
                days.push(<td onClick={() => {
                    document.getElementById("calendar-hide").style.display = "none";
                    setDate(new Date(year, month, i - daysStringToInt[start] + 1))
                    that.setState({runAjax: true, date: new Date(year, month, i - daysStringToInt[start] + 1)})
                }} className={"td bg-saturday"}>
                    <div className={"d-flex day flex-row justify-content-between"}>
                        <div>{tempDate.getDate()}
                        </div>
                        <div
                            className={"day"}>{hebrewLetters[tempDate.toLocaleDateString("he-u-ca-hebrew", {day: 'numeric'})]}</div>
                    </div>
                </td>)
            } else {
                days.push(<td onClick={() => {
                    document.getElementById("calendar-hide").style.display = "none";
                    setDate(new Date(year, month, i - daysStringToInt[start] + 1))
                    that.setState({runAjax: true, date: new Date(year, month, i - daysStringToInt[start] + 1)})
                }} className={"td"}>
                    <div className={"d-flex day flex-row justify-content-between"}>
                        <div>{tempDate.getDate()}
                        </div>
                        <div
                            className={"day"}>{hebrewLetters[tempDate.toLocaleDateString("he-u-ca-hebrew", {day: 'numeric'})]}</div>
                    </div>
                </td>)
            }
            tempDate.setDate(tempDate.getDate() + 1);
        } else {
            days.push(<td className={"td bg-grey"}>
                <div className={"day"}>{counter}</div>
            </td>)
            tempDate.setDate(tempDate.getDate() + 1);
            counter++;
        }
    }
    return days;
}

function TableHeader() {
    return (<tr className={"table-header-row bg-dark"}>
        <th className={"th text-light"}>ראשון</th>
        <th className={"th text-light"}>שני</th>
        <th className={"th text-light"}>שלישי</th>
        <th className={"th text-light"}>רביעי</th>
        <th className={"th text-light"}>חמישי</th>
        <th className={"th text-light"}>שישי</th>
        <th className={"th text-light"}>שבת</th>
    </tr>)
}

function TableBody(daysInMonth) {
    let rows = [];
    let cells = [];
    daysInMonth.forEach((row, i) => {
        if (i % 7 !== 0) {
            cells.push(row);
        } else {
            rows.push(cells);
            cells = [];
            cells.push(row);
        }
        if (i === daysInMonth.length - 1) {
            rows.push(cells);
        }
    });
    let daysinmonth = rows.map((d, i) => {
        return <tr>{d}</tr>;
    });
    return daysinmonth;
}