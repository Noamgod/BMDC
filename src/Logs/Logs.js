import React, {Component} from 'react';
import DatePicker from "react-datepicker";
import {load_data_getLogs} from "../Db/DataBase";
import ScaleLoader from "react-spinners/HashLoader";
import {formatDate} from "../SendRequest/SendRequest";
import "../Logs/Logs.css"


export default class Logs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterDate: new Date(),
            logs: [],
            showingLogs: [],
            runAjax: true,
            loading: true,
            filterByMyUUID: -1,

        }
    }

        filterShowingLogs=()=> {
            this.setState({showingLogs: this.state.logs.filter((log, index)=>{
                if(this.state.filterByMyUUID === -1) {
                    return ((log['command'].toLowerCase().includes(document.getElementById("logsSearchBarFilter").value.toLowerCase()) || log['full_name'].toLowerCase().includes(document.getElementById("logsSearchBarFilter").value.toLowerCase())) && ((!document.getElementById("filterShowAll").checked) && log['date'] === formatDate(this.state.filterDate)))
                }else{
                    return ((log['command'].toLowerCase().includes(document.getElementById("logsSearchBarFilter").value.toLowerCase()) || log['full_name'].toLowerCase().includes(document.getElementById("logsSearchBarFilter").value.toLowerCase())) && ((log['executioner_uuid'].includes(this.state.filterByMyUUID) || log['executed_on_uuid'].includes(this.state.filterByMyUUID)) && ((!document.getElementById("filterShowAll").checked) && log['date'] === formatDate(this.state.filterDate))))
                }
                })})
        }

        getLogs() {
        let logs = [];
        if(this.state.showingLogs.length <= 0){
            logs.push(
                <div>
                    <h1>No available information</h1>
                </div>
            )
        }
        for (let i = 0; i < this.state.showingLogs.length; i++){
            logs.push(
                <div className={"logsInfoBox shadow-sm"}>
                    <ul>
                        <li><b>Users Name:</b> {this.state.showingLogs[i]['full_name']}</li>
                        <li><b>CommandID:</b> {this.state.showingLogs[i]['command_ID']}</li>
                        <li><b>Executioners UUID:</b> {this.state.showingLogs[i]['executioner_uuid']}</li>
                        <li><b>Executed On UUID:</b> {this.state.showingLogs[i]['executed_on_uuid']}</li>
                        <li><b>Command:</b> {this.state.showingLogs[i]['command']}</li>
                        <li><b>Changed From:</b> {this.state.showingLogs[i]['change_from']}</li>
                        <li><b>Changed To:</b> {this.state.showingLogs[i]['change_to']}</li>
                        <li><b>Date:</b> {this.state.showingLogs[i]['date']}</li>
                    </ul>
                </div>

            )
        }
        return logs;
    }

    render() {
        if(this.props.userProps.admin !== "operator" && this.props.userProps.admin !== "admin" ){ // Dovid change this in the future to work with admins
            return(
                <div>
                    <h1>אין לך גישה לדף זה</h1>
                </div>
            )
        }
        if(this.state.runAjax){
            load_data_getLogs(this.props.userProps.email, this.props.userProps.password, this)
        }
            if (this.state.loading) {
                return (
                    <div className={"mx-auto position-absolute margin-top-responsive"}>
                        <ScaleLoader color={"white"}/>
                    </div>
                )
            } else {

                return (
                    <div dir="ltr"
                        className={"container border border-1 rounded rounded-3 shadow-lg d-flex flex-column margin-top-responsive bg-light"}
                        id={"logs-page"} style={{height: "900px"}}>
                        <div className={"searchArea border border-3 flex-row mt-3"}
                             style={{height: "16%", minWidth: "100%"}}>
                            <div className={"searchArea_searchBar"}>
                                <input type="search" className={"form-control"} id={"logsSearchBarFilter"} placeholder={"Search"} onChange={this.filterShowingLogs}/>
                            </div>

                            <div className={"searchArea_searchFilters d-flex flex-row h-75"}>
                                <div className={"searchArea_searchFilters_checkBoxArea d-flex container-fluid"}>
                                    <div className={"d-flex flex-column m-2"}>
                                        <label htmlFor={"filterShowAll"}>Show All</label>
                                        <input type={"checkbox"} id={"filterShowAll"} onClick={(e) => {
                                            document.getElementById("filterShowMeOnly").checked = false;
                                            this.setState({filterByMyUUID: -1, showingLogs: this.state.logs})

                                        }}/>
                                    </div>
                                    <div className={"d-flex flex-column m-2"}>
                                        <label htmlFor={"filterShowMeOnly"}>Show Only Me</label>
                                        <input type={"checkbox"} id={"filterShowMeOnly"} onClick={(e) => {
                                            document.getElementById("filterShowAll").checked = false;
                                            if (e.currentTarget.checked) {
                                                this.setState({filterByMyUUID:this.props.userProps.uuid}, ()=>{
                                                    this.filterShowingLogs()
                                                })
                                            }else{
                                                this.setState({filterByMyUUID:-1}, ()=>{
                                                    this.filterShowingLogs()
                                                })
                                            }
                                        }}/>
                                    </div>
                                </div>
                                <div className={"searchArea_searchFilters_dateArea d-flex flex-column me-4"}>
                                    <label htmlFor={"searchFilter_DatePicker"}>Filter By Date</label>
                                    <DatePicker selected={this.state.filterDate}
                                                onChange={(date) => {
                                                    this.setState({filterDate: new Date(date)}, () => {
                                                        this.filterShowingLogs()
                                                    })
                                                }}
                                                className={"pickerInput shadow rounded"}
                                                dateFormat="yyyy-MM-dd"
                                                placeholderText="סינון לפי תאריך"
                                                isClearable={false}/>
                                </div>

                            </div>
                        </div>
                        <div className={"infoArea d-flex flex-column overflow-auto"}
                             style={{height: "80%", minWidth: "100%"}}>
                            {this.getLogs()}
                        </div>
                    </div>
                );
            }
    }
}