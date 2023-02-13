import React from 'react';
import "./percentage.css";
import CircleLoader from "react-spinners/MoonLoader";
import {load_data_get_Attend_LastMonthPercent_for_teacher, load_data_getUserLastMonthPercent} from "../Db/DataBase";
import 'react-circular-progressbar/dist/styles.css';


export default class GetPercentage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flipped: false,
            clicked: false,
            color: this.props.percent > 75 ? '#24ad36' : '#d72828',
            percent: this.props.percent,
            runAjax: true,
        }

    }

    render() {
        if (this.props.userDeitals.admin != "teacher") {
            if (this.state.percent == null && this.state.runAjax) {
                load_data_getUserLastMonthPercent(this.props.email, this.props.password, this)
                this.setState({runAjax: false})
            }
        } else if (this.state.percent == null && this.state.runAjax) {
            load_data_get_Attend_LastMonthPercent_for_teacher(this.props.email, this.props.password, this)
            this.setState({runAjax: false})
        }

        document.documentElement.style.setProperty("--" + this.props.id, (566 - (566 * this.props.percent / 100)));
        if (!this.state.flipped) {
            return (
                <div className={"percent-container border d-flex flex-column justify-content-center"} onClick={(e) => {
                    e.currentTarget.setAttribute("style", "animation: turn-back 1s linear forwards");
                    this.setState({clicked: true})
                    setTimeout(() => {
                        this.setState({flipped: !this.state.flipped, clicked: false})
                    }, 500)
                }}>
                    <h3 class={"percent-header mt-2"}>
                        {this.props.header}
                    </h3>
                    <hr className={"hr"}/>
                    {this.getCircle()}
                </div>
            );
        } else {
            return (
                <div className={"percent-container border d-flex p-1"} onClick={(e) => {
                    e.currentTarget.setAttribute("style", "animation: turn-front 1s linear forwards");
                    this.setState({clicked: true})
                    setTimeout(() => {
                        this.setState({flipped: !this.state.flipped, clicked: false})
                    }, 500)
                }}>
                    <div className={"text-rotated"}>
                        <h5 className={"text-center"}>
                            {this.props.header}
                        </h5>
                        <p>
                            {this.props.desc}
                        </p>
                    </div>
                </div>
            );
        }
    }

    getCircle = () => {
        if (this.state.percent == null) {
            return (
                <div className={"m-auto"}>
                    <CircleLoader color={"black"}/>
                </div>
            )
        } else {
            document.documentElement.style.setProperty("--" + this.props.id, (566 - (566 * this.state.percent / 100)));
            return (


                // <CircularProgressbarWithChildren view value={66}>
                //     <div>
                //         <strong>66%</strong>
                //     </div>
                // </CircularProgressbarWithChildren>

                <svg className={"circle-percentage-svg m-auto"}>
                    <circle id={"percent-circle-bar"}
                            style={{animation: "offset" + this.props.id + " 2s ease-out forwards"}}
                            cx={"50%"} cy={"50%"} r={90} fill={"none"}
                            stroke={this.state.percent > 75 ? '#24ad36' : '#d72828'} strokeWidth={"12"}/>
                    <text x={"50%"} y={"50%"} textAnchor={"middle"} alignmentBaseline={"middle"}
                          className={"percent-text"}>{this.props.text}
                    </text>
                </svg>
            )
        }
    }
}


