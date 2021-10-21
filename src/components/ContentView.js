import {React, useState, useEffect} from 'react';
import { onError } from "../libs/errorLib";
import { useAppContext } from "../libs/contextLib";

import { getAllContent } from "../libs/apiLib";
 
export default function ContentView() {
    const {isAuthenticated} = useAppContext();
    const [unwatched, setUnwatched] = useState([]);
    const [practice, setPractice] = useState([]);
    const [passive, setPassive] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function onLoad() {
            setIsLoading(true);
            if (!isAuthenticated) {
                return;
            }        
            try {
                // Wait for the content to load, then populate the state
                const result = await getAllContent();
                setUnwatched(result.unwatched);
                setPractice(result.watched.practice);
                setPassive(result.watched.passive);
            } catch(e) {
                onError(e);
            }
            setIsLoading(false);
        }
        onLoad();
    }, [isAuthenticated]);

    function watchVideo(video){
        window.open(video.checkInId, "_blank");
    }
    if(!isLoading){
        return(
            <div>
                <h2>Unwatched</h2>
                <ul>
                    {unwatched.map((video) => (
                        <li key={video.checkInId}>
                            <button onClick={() => watchVideo(video)}>{video.title}</button>
                        </li>
                    ))}
                </ul>
                <h3>Passive</h3>
                <ul>
                    {passive.map((video) => (
                        <li key={video.checkInId}>
                            Title: {video.title}
                            URL: {video.checkInId}
                        </li>
                    ))}
                </ul>
                <h3>Practice</h3>
                <ul>
                    {practice.map((video) => (
                        <li key={video.checkInId}>
                            Title: {video.title}
                            URL: {video.checkInId}
                        </li>
                    ))}
                </ul>
            </div>
        )
    } else {
        return(
            <div>
                <h1>Loading...</h1>
            </div>
        )
    }
}
