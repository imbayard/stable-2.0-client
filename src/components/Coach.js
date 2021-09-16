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
                <p className='coach-words'>For me to work properly, you'll need to record a daily check-in more frequently. <a href="https://tinyhabits.com/start-tiny/" target="_blank" rel="noreferrer">Here's some tips for helping you set up this small, daily habit.</a></p>
            )
        } else if (flags.flagLackingOrPoppingOffInCategory.category !== "nothing" && !flags.flagLackingOrPoppingOffInCategory.poppingOff){
            return (
                <p className='coach-words'>Looks like you've been slacking in the {flags.flagLackingInCategory} category recently. Try to incorporate {flags.flagLackingInCategory} in your day today!</p>
            )
        } else if (flags.flagLackingOrPoppingOffInCategory.category !== "nothing" && flags.flagLackingOrPoppingOffInCategory.poppingOff){
            return (
                <p className='coach-words'>You're popping off! The {flags.flagLackingOrPoppingOffInCategory.category} category looks great. Treat yourself and keep up the good work!</p>
            )
        } else {
            return (
                <p className='coach-words'>Lookin good, good lookin!</p>
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