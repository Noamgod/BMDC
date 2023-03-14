import React, {useState} from 'react';


export function SearchModal(props) {
    const [searchResult, setSearchResult] = useState(props.props);

    const searchHandler = (search) => {
        search = search.trim()
        if (search === ""){
            setSearchResult(props.props);
        }
        else{

            let result = props.props.filter((item) => {
                let fullName = item.first_name+" "+item.last_name
                return fullName.toLowerCase().includes(search.toLowerCase())
            });
            setSearchResult(result)
        }
    }
       let box = []
       for (let index in searchResult) {
           box.push(
               <div className={"border-1 d-flex flex-row"}>
                   <input id={"checkBoxSB"+index} type={"checkbox"} className={"checkbox addToClass"} value={searchResult[index].uuid}/>
                   <label  htmlFor={"checkBoxSB"+index}>{searchResult[index].first_name+" "+ searchResult[index].last_name} </label>
               </div>
           )
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
                    {box}
                </div>
            </div>
            <div className={"modalFooter"}>

            </div>
        </div>
    )
}