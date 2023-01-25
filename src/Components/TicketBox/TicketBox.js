import {ProgressBar, Step} from 'react-step-progress-bar';
import 'react-step-progress-bar/styles.css';
import "./TicketBox.css";


export function TicketBox(props) {
    let issue = props.issue
    let that = props.that

    if (issue === undefined) {
        return (
            <div className="ticket-box">
                <h1>אין בעיות הממתינות לטיפול</h1>
            </div>
        )
    }
    /* {getClassName(that, issue)}*/

    return (
        <div
            id={"main-container"}
            className={getClassName(that, issue)}
            onClick={() => {
                that.setState({showModal: true, ticket_clicked: issue, status: issue.status, priority: issue.priority})
            }}
            //             className={issue.priority == 2 ? "issue-box m-auto mb-2 bg-priority_yellow" : issue.priority == 3 ? "issue-box m-auto mb-2 bg-priority_red" : "issue-box m-auto mb-2" + "border border-primary border-4"/* + that.status.ticket_clicked!=null?"border border-primary border-4":""*/}
        >
            <div className={"w-75 mx-auto mt-1 p-2 "}>
                <ProgressBar
                    percent={issue.status}
                    filledBackground="#53ab64"
                    hasStepZero={true}
                >
                    <Step transition="scale">
                        {({accomplished}) => (
                            <img
                                width="32"
                                src={accomplished ? "https://chedvata.com/assets/check.svg" : "https://chedvata.com/assets/hourglass.svg"}/>
                        )}
                    </Step>
                    <Step transition="scale">
                        {({accomplished}) => (
                            <img
                                width="32"
                                src={accomplished ? "https://chedvata.com/assets/check.svg" : "https://chedvata.com/assets/hourglass.svg"}/>
                        )}
                    </Step>
                    <Step transition="scale">
                        {({accomplished}) => (
                            <img
                                width="32"
                                src={accomplished ? "https://chedvata.com/assets/check.svg" : "https://chedvata.com/assets/hourglass.svg"}/>
                        )}
                    </Step>
                </ProgressBar>
            </div>
            <hr className={"w-100 rounded border border-dark"}/>

            <div className={"text-center"}>
                <h3>
                    {issue.title}
                </h3>
            </div>
            <div className={"p-2 ms-1 "}>
                <div className={" d-flex flex-row-reverse justify-content-between"}>
                    <img className={"ms-4 "} width={"64"} src={getIcon(issue)} alt={"קטגוריה: "}/>
                    <div className="user-info flex-column">
                        <div>
                            <label className={"form-label d-flex flex-row"}>
                            <span className="label-text"><img className={"ms-2 mb-1"} width={"32"}
                                                              src={"https://chedvata.com/assets/profile.svg"}
                                                              alt={"שם: "}/></span>
                                <span
                                    className="label-value text-nowrap mt-1">{issue.first_name + " " + issue.last_name}</span>
                            </label>
                        </div>
                        <div>
                            <label className={"form-label d-flex flex-row"}>
                            <span className="label-text"><img className={"ms-2 mb-1"} width={"32"}
                                                              src={"https://chedvata.com/assets/date.svg"}
                                                              alt={"תאריך: "}/></span>
                                <span className="label-value mt-1">{issue.date}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <hr className={"hr-small rounded border border-dark"}/>
                <div>
                    <label className={"form-label display-block d-flex flex-row"}>
                        <span className="label-text"><img className={"ms-2 bell mb-1"} width={"32"}
                                                          src={"https://chedvata.com/assets/bell.svg"} alt={"בעיה: "}/></span>
                        <span className="label-value text-break max-height-100 overflow-auto mt-1">{issue.desc}</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

function getIcon(issue) {
    let category = issue.category
    if (category == "תחזוקה") {
        return "https://chedvata.com/assets/work-tools.svg"
    } else if (category == "מטבח") {
        return "https://chedvata.com/assets/kitchen.svg"
    } else if (category == "תמיכה תכנית באתר") {
        return "https://chedvata.com/assets/code.svg"
    } else if (category == "מזכירות הישיבה") {
        return "https://chedvata.com/assets/secretary.svg"
    } else if (category == "מנכ\"ל הישיבה") {
        return "https://chedvata.com/assets/CEO.svg"
    }
}

function getClassName(that, issue) {
    let element = document.createElement("div")
    if (that.state.ticket_clicked != null && that.state.ticket_clicked.ticket_id == issue.ticket_id) {
        element.classList.add("border","border-dark","border-4","issue-box", "m-auto", "mb-2")
    } else {
        element.classList.add("issue-box", "m-auto", "mb-2")
    }
    switch (issue.priority) {
        case "2":
            element.classList.add("bg-priority_yellow")
            break
        case "3":
            element.classList.add("bg-priority_red")
            break
    }
    return element.classList
}