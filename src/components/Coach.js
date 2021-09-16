import React from "react";
import { CoachSymbol } from "./Icons";
import "./Coach.css";

export default function Coach({
    flags,
    ...props
}) {
    function getTip(){
        if(!flags.flagHasRecentCheckIn){
            return(
                <p>Hey, for me to help you become the best version of yourself, you'll need to check-in more frequently! <a href="https://tinyhabits.com/start-tiny/" target="_blank" rel="noreferrer">Here's some tips for helping you set up this small, daily habit.</a></p>
            )
        } else {
            return (
                <p>Lookin good, good lookin!</p>
            )
        }
    }
    return(
        <div className="coach-wrapper">
            <h2>Coach</h2>
            <span className="coach-sym-wrapper">
                <div>{CoachSymbol()}</div>
                <div>{getTip()}</div>
            </span>
        </div>
        // <div>
        //     <h3>{flags.flagHasRecentCheckIn ? "true" : "false"}</h3>
        //     {CoachSymbol()}
        // </div>
    )
}