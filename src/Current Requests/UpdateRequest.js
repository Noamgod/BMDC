import {load_data_lowerDaysOff, load_data_updateRequestByQuery} from "../Db/DataBase";

export function

updateRequest(email, password, date, id, update, prevUpdate ) {
    let result = load_data_updateRequestByQuery(email, password, date, id, update )
    if (update == 1 && result)
        load_data_lowerDaysOff(email, password, id, -1)
    if (update == 0 && result) {
        if (prevUpdate == 1) {
            load_data_lowerDaysOff(email, password, id, 1)
        }

    }
}