import React from "react";
import { CoachSymbol } from "./Icons";
import "./Coach.css";
export default function Coach({
    flags,
    length,
    ...props
}) {
    function getTip(){
        if (length === 1){
            return (
                <p className='coach-words'>Congrats on starting down this path! The more check-ins you complete, the better I can help.</p>
            )
        } else if (length === 2){
            return (
                <p className='coach-words'>Keep it up! Another day another great check-in.</p>
            )
        }
        else if(!flags.flagHasRecentCheckIn){
            return(
                <p className='coach-words'>For me to work properly, you'll need to record a daily check-in more frequently. <a href="https://tinyhabits.com/start-tiny/" target="_blank" rel="noreferrer">Here's some tips for helping you set up this small, daily habit.</a></p>
            )
        } else if (flags.flagLackingOrPoppingOffInCategory.category !== "nothing" && !flags.flagLackingOrPoppingOffInCategory.poppingOff){
            return (
                <p className='coach-words'>Looks like you've been slacking in the {flags.flagLackingOrPoppingOffInCategory.category} category recently. Try to incorporate {flags.flagLackingInCategory} in your day today!</p>
            )
        } else if (flags.flagLackingOrPoppingOffInCategory.category !== "nothing" && flags.flagLackingOrPoppingOffInCategory.poppingOff){
            return (
                <p className='coach-words'>You're popping off! The {flags.flagLackingOrPoppingOffInCategory.category} category looks great. Treat yourself and keep up the good work!</p>
            )
        } else {
            return (
                <p className='coach-words'>Lookin good, good lookin! Nothing to report.</p>
            )
        }
    }
    return(
        <div className="coach-wrapper">
            <h2>Coach</h2>
            <span className="coach-sym-wrapper">
                <div className='coach-sym'>{CoachSymbol()}</div>
                <div className='coach-tip'>{getTip()}</div>
            </span>
        </div>
        // <div>
        //     <h3>{flags.flagHasRecentCheckIn ? "true" : "false"}</h3>
        //     {CoachSymbol()}
        // </div>
    )
}