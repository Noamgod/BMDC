import { load_data_updateRequestByQuery} from "../Db/DataBase";

export function updateRequest(email, password,  date, id, update, mailInfo) { //completely revamped this function to check access, update request and update days off for student
    let result = load_data_updateRequestByQuery(email, password, date, id, update, mailInfo)
    console.log(result)
}