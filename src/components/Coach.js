import {React, useState} from "react";
import { CoachSymbol } from "./Icons";
import Button from 'react-bootstrap/Button';
import "./Coach.css";
export default function Coach({
    flags,
    length,
    priorities,
    ...props
}) {
    const [queueNum, setQueueNum] = useState(0);

    function getTip(){
        const priorities_list = priorities.sort((a,b) => b.priority - a.priority);
        let tipQueue1 = [];
        let tipQueue2 = [];
        if (length === 1){
            return (
                <p className='coach-words'>Congrats on starting down this path! The more check-ins you complete, the better I can help.</p>
            )
        } else if (length === 2){
            return (
                <p className='coach-words'>Keep it up! Another day another great check-in.</p>
            )
        } else if(!flags.flagHasRecentCheckIn){
            return(
                <p className='coach-words'>For me to work properly, you'll need to record a daily check-in more frequently. <a href="https://tinyhabits.com/start-tiny/" target="_blank" rel="noreferrer">Here's some tips for helping you set up this small, daily habit.</a></p>
            )
        } else {
            for(let i = 0; i < priorities_list.length; i++){
                const pri = priorities_list[i];
                const poppingOff = flags.flagLackingOrPoppingOffInCategory.poppingOff;
                const cat = flags.flagLackingOrPoppingOffInCategory.category;
                if(cat === pri.category && poppingOff){
                    const message = "You're popping off! The " + ((pri.category === 'meTime') ? "me time" : pri.category) + " category looks great.";
                    tipQueue1.push(message);
                } else if(cat === pri.category && !poppingOff){
                    const message = "The " + ((pri.category === 'meTime') ? "me time" : pri.category) + " category looks pretty sparse recently. Try to incorporate it in your day today.";
                    tipQueue1.push(message);
                }
                if(pri.avg <= pri.low){
                    const message = "Pay attention to your " + ((pri.category === 'meTime') ? "me time" : pri.category) + " category. You are well below your pace of " + ((pri.goal * 7).toString()) + " per week.";
                    tipQueue1.push(message);
                } else if(pri.avg < pri.goal){
                    const message = "You're almost there! Your " + ((pri.category === 'meTime') ? "me time" : pri.category) + " category is above your low threshold of " + ((pri.low * 7).toString()) + ", but still just short of your pace of " + ((pri.goal * 7).toString()) + " per week.";
                    tipQueue1.push(message);
                } else if(pri.avg < pri.high){
                    const message = "Great work! You have reached your goal for the " + ((pri.category === 'meTime') ? "me time" : pri.category) + " category. Reward yourself!";
                    tipQueue1.push(message);
                } else if(pri.avg >= pri.high){
                    const message = "Don't overdo it! You deserve a break in your " + ((pri.category === 'meTime') ? "me time" : pri.category) + " category. You've surpassed your threshold of " + ((pri.high * 7).toString()) + " per week.";
                    tipQueue2.push(message);
                }
            }
            const tq = tipQueue1.concat(tipQueue2);
            return queue(tq);
        }
    }

    function handleNextMessage(length) {
        if(queueNum + 1 === length){
            setQueueNum(0);
        } else {
            setQueueNum(queueNum + 1);
        }
    }

    function queue(tq){
        const length = tq.length;
        return(
            <div>
                <p className='coach-words'>{tq[queueNum]}</p>
                <Button variant='success' onClick={() => handleNextMessage(length)}>Next Message</Button>
            </div>
        )
        
    }

    return(
        <div className="coach-wrapper">
            <h2>Coach</h2>
            <span className="coach-sym-wrapper">
                <div className='coach-sym'>{CoachSymbol()}</div>
                <div className='coach-tip'>{getTip()}</div>
            </span>
        </div>
    )
}