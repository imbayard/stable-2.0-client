import { API } from "aws-amplify";

/**********************************
CHECKIN: GET REQUEST
Returns a list of ALL checkIns
**********************************/
export function loadCheckIns(){
    return API.get("stable-2", "/checkin/list");
}
/**********************************
CHECKIN: GET REQUEST
Returns a single checkIn based on its ID
**********************************/
export function loadCheckIn(id){
    return API.get("stable-2", `/checkin/${id}`);
}
/**********************************
CHECKIN: POST REQUEST
Saves a checkIn to the database
**********************************/
export function submitCheckIn(checkInObject){
    return API.post("stable-2", "/checkin/submit", {
        body: checkInObject
    });
}
/**********************************
CHECKIN: DELETE REQUEST
Deletes a checkIn from the database
**********************************/
export function deleteCheckIn(id){
    return API.del("stable-2", `/checkin/delete/${id}`);
}



/**********************************
CONTENT: GET REQUEST
Returns a list of all content
**********************************/
export function getAllContent(){
    return API.get("stable-2", "/content/all");
}
/**********************************
CONTENT: POST REQUEST
Saves / updates a video on the database
**********************************/
export function submitVideo(updated_video){
    return API.post("stable-2", `/content/submit`, {body:updated_video});
}



/**********************************
PRIORITIES: POST REQUEST
Saves / updates priorities on the database
**********************************/
export function setPriorities(priorities){
    return API.post("stable-2", `/priorities/set`, {body:priorities});
}
/**********************************
PRIORITIES: GET REQUEST
Gets the list of priorities
**********************************/
export function getPriorities(){
    return API.get("stable-2", `/priorities/get`);
}