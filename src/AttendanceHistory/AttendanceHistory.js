import React, {Component} from 'react'
import {load_data_getAllStudents_name_uuid_thenFunction} from "../Db/DataBase";
import {forEach} from "react-bootstrap/ElementChildren";

export default class AttendanceHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingPage: false,
            loadingUserInfoBox: false,
        }
    }

    render() {
        if(this.state.loadingPage) {
            return (
                <div>
                    <h1>Loading...</h1>
                </div>
            )
        }

        function loadUsers() {
            let users = load_data_getAllStudents_name_uuid_thenFunction(this.props.username, this.props.password).then((users) => {
                this.state.loadingUserInfoBox = false;

            })
            if(this.state.loadingUserInfoBox) {
                return (
                    <div>
                        <h1>Loading...</h1>
                    </div>
                )
            }else{
                users.map((user) => {
                    return (
                    <div onClick={displayInfo()} className={"border border-3"}>
                        <ul>
                            <li> <h6>Name: {user.name}</h6> </li>
                            <li> <h6>UUID: {user.uuid}</h6> </li>
                        </ul>
                    </div>

                    )
                })
            }

        }

        return (
            <div className={"vh-100"}>
                <div className={"d-flex container-fluid border border-3"} style={{height:"30%"}}>
                    <h3>Header where the users info will be shown when clicked on.</h3>
                </div>
                <div className={"d-flex container-fluid border border-3"} style={{height:"70%"}}>
                    <h3>This is the Body box where the users name/uuid will be shown when clicked it will send info to the Header box and display the
                        users attendance history.
                    </h3>
                    {loadUsers()}
                </div>
            </div>
        )

    }

}