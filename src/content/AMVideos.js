import {getAllContent} from "../libs/apiLib";

function getLengthVideo(videos, length){
    for(let i = 0; i < videos.length; i++){
        if(videos[i].length === length){
            return videos[i];
        }
    }
    return videos[0];
}

export function updateVideo(video, watched, category, notes){
    let note = notes
    if(note === ""){
        note = null;
    }
    let video_copy = {
        "category": category,
        "url": video.checkInId,
        "userId": video.userId,
        "watched": watched,
        "length": video.length,
        "title": video.title,
        "notes": note
    }
    return video_copy;
}

export async function getVideo(length, category){
    let videos = await getAllContent();
    if(category === 'unwatched'){
        videos = videos.unwatched;
        return getLengthVideo(videos, length);
    } else if (category === 'practice'){
        videos = videos.watched.practice;
        return getLengthVideo(videos, length);
    } else if (category === 'passive'){
        videos = videos.watched.passive;
        return getLengthVideo(videos, length);
    }
}