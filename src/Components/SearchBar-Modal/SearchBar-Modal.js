import React, {useState} from 'react';


export function SearchModal(props) {

    //Initiate the boxes for all students
    let box = []
    for (let index in props.props) {
        box.push(
            <div className={"border-1 flex-row"} id={"add"} style={{display:"block"}}>
                <input id={"checkBoxSB" + props.props[index].uuid} type={"checkbox"} className={"checkbox addToClass"}
                       value={props.props[index].uuid}/>
                <label id={"labelSB" + props.props[index].uuid} htmlFor={"checkBoxSB" + index} content={props.props[index].first_name + " " + props.props[index].last_name}>{props.props[index].first_name + " " + props.props[index].last_name}</label>
            </div>)
    }

    //Add useStates for the search bar (searchResults contains the boxes that are displayed after the filter by the search bar)
    const [searchResult, setSearchResult] = useState(box);
    const searchHandler = (search) => {
        search = search.trim()
        if (search === ""){ //if the search bar is empty, display all the boxes
            setSearchResult(box);
        }
        else{ //if the search bar is not empty, filter the boxes and set the searchResults to the filtered boxes
            box.forEach((item) => {
                let fullName = item.props.children[1].props.content;
                if (!fullName.toLowerCase().includes(search.toLowerCase())){
                    item.props.style.display = "none"; //Needed to change the style instead of re-rendering the boxes so that it won't change the current state of the boxes (remove the checked boxes)
                }else{
                    item.props.style.display = "block"; //Needed to change the style instead of re-rendering the boxes so that it won't change the current state of the boxes (remove the checked boxes)
                }
            })
            setSearchResult(box)
        }
    }

    return (
        <div className={"searchModal d-flex flex-column"}>
            <div className={"modalHeader d-flex flex-column"}>
                <input type={"search"} placeholder={"חפש"} onChange={(e)=>searchHandler(e.currentTarget.value)}/>
            </div>
            <div className={"modalBody"}>
                <div className={"border-1 d-flex flex-column overflow-auto"} style={{maxHeight:"200px"}}>
                    <div className={"border-1 d-flex flex-row"}>
                        <input type={"checkbox"} className={"checkbox "} id={"checkAll"} onClick={(e)=>{
                            document.querySelectorAll(".checkbox").forEach((x)=>{
                                x.checked = e.currentTarget.checked
                            })}}/>
                        <label htmlFor={"checkAll"}><strong>Check all</strong></label>
                    </div>
                    <div className={"border-1 d-flex flex-row"}>
                        <input type={"checkbox"} id={"mandatoryCheckBox"} onClick={(e)=>{
                            document.querySelectorAll(".checkbox").forEach((x)=>{
                                x.checked = e.currentTarget.checked
                                x.disabled = e.currentTarget.checked;
                            })}}/>
                        <label htmlFor={"mandatoryCheckBox"}><strong>Mandatory</strong></label>
                    </div>
                    <br/>
                    {searchResult}
                </div>
            </div>
            <div className={"modalFooter"}>
            </div>
        </div>
    )
}