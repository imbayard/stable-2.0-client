import { React, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

import "./MorningMessage.css";
export default function MorningMessage({
    priorities,
    ...props
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [poor, setPoor] = useState([]);
    const [near, setNear] = useState([]);
    const [at, setAt] = useState([]);
    const [over, setOver] = useState([]);
    const [highestPriority, setHighestPriority] = useState('');

    useEffect(() => {
        function getHighestPriority(list){
            let max_p = "";
            let max = 0;
            for(let i = 0; i < list.length; i++){
                const p = list[i];
                if(p.priority > max){max_p = p.category;}
            }
            setHighestPriority(max_p);
        }
        function onLoad(){
            const p_list = priorities.sort((a,b) => b - a);
            let low = [];
            let med = [];
            let reached = [];
            let high = [];
            for(let i = 0; i < priorities.length; i++){
                const p = p_list[i];
                if(p.avg <= p.low){
                    low.push(p);
                } else if(p.avg < p.goal){
                    med.push(p);
                } else if(p.avg <= p.high){
                    reached.push(p);
                } else if(p.avg > p.high){
                    high.push(p);
                }
            }
            if(low.length >= 1){
                getHighestPriority(low);
            } else if (med.length >= 1){
                getHighestPriority(med);
            } else {
                setHighestPriority("Fun!");
            }
            setPoor(low);
            setNear(med);
            setAt(reached);
            setOver(high);
        }
        onLoad();
    })

    if(isOpen){
        return(
            <div className='report'>
                <span>
                    <span className='report-header'>
                        <Button style={{height: '100%', float: 'right', borderTopRightRadius: '12px'}} onClick={() => setIsOpen(false)}>Close</Button>
                        <h3>Today's Outlook</h3>
                    </span>
                    <span className='report-body'>
                        <div className='focus'>
                            <h3 className='headline'>Today's Focus: <strong className='focus-category'>{(highestPriority === 'meTime') ? "me-time" : highestPriority}</strong></h3>
                        </div>
                        <br />
                        <h3 className='headline'>Goal Pacing:</h3>
                        <span className='relatives'>
                            <span className='relative'>
                                <h6 className='low'>Lagging</h6>
                                {poor.map((p) => {
                                    return(
                                        <p className='low-category'>{p.category}</p>
                                    )
                                })}
                            </span>
                            <span className='relative'>
                                <h6 className='near'>Nearing</h6>
                                {near.map((p) => {
                                    return(
                                        <p className='near-category'>{p.category}</p>
                                    )
                                })}
                            </span>
                            <span className='relative'>
                                <h6 className='at'>Achieved</h6>
                                {at.map((p) => {
                                    return(
                                        <p className='at-category'>{p.category}</p>
                                    )
                                })}
                            </span>
                            <span className='relative'>
                                <h6 className='over'>Overshot</h6>
                                {over.map((p) => {
                                    return(
                                        <p className='over-category'>{p.category}</p>
                                    )
                                })}
                            </span>
                        </span>
                    </span>
                </span>
            </div>
        )
    } else {
        return(
            <div className='open-button'>
                <Button onClick={() => setIsOpen(true)}>Open Coach's Daily Report</Button>
            </div>
        )
    }
}