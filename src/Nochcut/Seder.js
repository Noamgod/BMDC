// import React, {Component} from 'react';
// import "./Seder.css";
// import ScaleLoader from "react-spinners/HashLoader";
// import {load_data_getTeacherSederList} from "../Db/DataBase";
//
//
//
// export default class Seder extends Component {
//     constructor(props){
//         super(props);
//         this.state = {
//             loading: true,
//             runAjax: true,
//             teacherSederList: null,
//         }
//
//     }
//     render(){
//         if(this.state.runAjax){
//             load_data_getTeacherSederList(this.props.userProps.password, this.props.userProps.email, this);
//             this.setState({runAjax: false});
//         }
//         if(this.state.loading){
//             return (
//                 <div className={"container-fluid justify-content-center mt-5 d-flex flex-row"}>
//                     <ScaleLoader color={"white"}/>
//                 </div>
//             )
//         }
//         return(
//             <div className={"container justify-content-center mt-5 d-flex flex-row"}>
//                 {createBoxes(this.state.teacherSederList)}
//             </div>
//         )
//     }
// }
