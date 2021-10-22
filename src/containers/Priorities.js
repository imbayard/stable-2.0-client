import { React, useState, useEffect } from 'react';
import {getPriorities, setPriorities} from '../libs/apiLib';
import {onError} from '../libs/errorLib';
import { useAppContext } from "../libs/contextLib";
import LoaderButton from "../components/LoaderButton";
import Button from "react-bootstrap/Button";

import './Priorities.css';

export default function Priorities() {
    const [priorities_list, setPList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showPrioritiesForm, setShowPrioritiesForm] = useState(false);

    const [mindPriority, setMindPriority] = useState("");
    const [mindLow, setMindLow] = useState("");
    const [mindHigh, setMindHigh] = useState("");
    const [mindGoal, setMindGoal] = useState("");

    const [bodyPriority, setBodyPriority] = useState("");
    const [bodyLow, setBodyLow] = useState("");
    const [bodyHigh, setBodyHigh] = useState("");
    const [bodyGoal, setBodyGoal] = useState("");

    const [socialPriority, setSocialPriority] = useState("");
    const [socialLow, setSocialLow] = useState("");
    const [socialHigh, setSocialHigh] = useState("");
    const [socialGoal, setSocialGoal] = useState("");

    const [mindfulPriority, setMindfulPriority] = useState("");
    const [mindfulLow, setMindfulLow] = useState("");
    const [mindfulHigh, setMindfulHigh] = useState("");
    const [mindfulGoal, setMindfulGoal] = useState("");

    const [meTimePriority, setMeTimePriority] = useState("");
    const [meTimeLow, setMeTimeLow] = useState("");
    const [meTimeHigh, setMeTimeHigh] = useState("");
    const [meTimeGoal, setMeTimeGoal] = useState("");

    const [formStep, setFormStep] = useState(0); // MAX IS 3

    const {isAuthenticated} = useAppContext();

    useEffect(() => {
        async function onLoad() {
            setIsLoading(true);
            if (!isAuthenticated) {
                return;
            }        
            try {
                // Wait for the content to load, then populate the state
                const result = await getPriorities();
                setPList(result);
            } catch(e) {
                onError(e);
            }
            setIsLoading(false);
        }
        onLoad();
    }, [isAuthenticated]);

    function validateLow(){
        if(mindLow !== "" && bodyLow !== "" && socialLow !== "" && mindfulLow !== "" && meTimeLow !== ""){
            if(parseInt(mindLow) < 0 || parseInt(mindLow) > 7 || parseInt(bodyLow) < 0 || parseInt(bodyLow) > 7 || parseInt(socialLow) < 0 || parseInt(socialLow) > 7 || parseInt(mindfulLow) < 0 || parseInt(mindfulLow) > 7 || parseInt(meTimeLow) < 0 || parseInt(meTimeLow) > 7){
                onError("You must enter a value greater than or equal to 0 and less than or equal to 7.");
                return;
            } else {
                setFormStep(1);
                return;
            }
        } else {
            onError("You must enter a value for each field.");
            return;
        }
    }

    function validateGoal(){
        if(mindGoal !== "" && bodyGoal !== "" && socialGoal !== "" && mindfulGoal !== "" && meTimeGoal !== ""){
            if(parseInt(mindGoal) < mindLow || parseInt(mindGoal) > 7 || parseInt(bodyGoal) < bodyLow || parseInt(bodyGoal) > 7 || parseInt(socialGoal) < socialLow || parseInt(socialGoal) > 7 || parseInt(mindfulGoal) < mindfulLow || parseInt(mindfulGoal) > 7 || parseInt(meTimeGoal) < meTimeLow || parseInt(meTimeGoal) > 7){
                onError("You must enter a value greater than or equal to your goal goal and less than or equal to 7.");
                return;
            } else {
                setFormStep(2);
                return;
            }
        } else {
            onError("You must enter a value for each field.");
            return;
        }
    }

    function validateHigh(){
        if(mindHigh !== "" && bodyHigh !== "" && socialHigh !== "" && mindfulHigh !== "" && meTimeHigh !== ""){
            if(parseInt(mindHigh) < mindGoal || parseInt(mindHigh) > 7 || parseInt(bodyHigh) < bodyGoal || parseInt(bodyHigh) > 7 || parseInt(socialHigh) < socialGoal || parseInt(socialHigh) > 7 || parseInt(mindfulHigh) < mindfulGoal || parseInt(mindfulHigh) > 7 || parseInt(meTimeHigh) < meTimeGoal || parseInt(meTimeHigh) > 7){
                onError("You must enter a value greater than or equal to your goal and less than or equal to 7.");
                return;
            } else {
                setFormStep(3);
                return;
            }
        } else {
            onError("You must enter a value for each field.");
            return;
        }
    }

    function handleSubmit(){
        setSubmitLoading(true);
        if(mindPriority !== "" && bodyPriority !== "" && socialPriority !== "" && mindfulPriority !== "" && meTimePriority !== ""){
            const mind = parseInt(mindPriority);
            const body = parseInt(bodyPriority);
            const social = parseInt(socialPriority);
            const mindful = parseInt(mindfulPriority);
            const meTime = parseInt(meTimePriority);
            let list = [mind, body, social, mindful, meTime];
            list = list.sort();
            if(list[0] !== 1 || list[1] !== 2 || list[2] !== 3 || list[3] !== 4 || list[4] !== 5){
                setSubmitLoading(false);
                console.log(list);
                onError("Each category must be a unique integer from 1 to 5.");
                return;
            } else {
                trySetPriorities();
                return;
            }
        } else {
            setSubmitLoading(false);
            onError("You must enter a value for each field.");
            return;
        }
    }

    async function trySetPriorities(){
        let mind = 
            {
                'category': 'mind',
                'priority': mindPriority,
                'low': mindLow,
                'goal': mindGoal,
                'high': mindHigh
            };
        let body =
            {
                'category': 'body',
                'priority': bodyPriority,
                'low': bodyLow,
                'goal': bodyGoal,
                'high': bodyHigh
            };
        let social = 
            {
                'category': 'social',
                'priority': socialPriority,
                'low': socialLow,
                'goal': socialGoal,
                'high': socialHigh
            };
        let mindful =
            {
                'category': 'mindful',
                'priority': mindfulPriority,
                'low': mindfulLow,
                'goal': mindfulGoal,
                'high': mindfulHigh
            };
        let meTime =
            {
                'category': 'meTime',
                'priority': meTimePriority,
                'low': meTimeLow,
                'goal': meTimeGoal,
                'high': meTimeHigh
            };
        try{
            const req = {'mind': mind, 'body': body, 'social': social, 'mindful': mindful, 'meTime': meTime};
            console.log(req);
            await setPriorities(req);
            const pList = await getPriorities();
            setPList(pList);
            setSubmitLoading(false);
            setFormStep(0);
            setShowPrioritiesForm(false);
        }catch(e){
            onError(e);
        }
    }

    function renderPrioritiesForm(){
        if(showPrioritiesForm){
            switch(formStep){
                case 0: 
                    return (
                        <span>
                            <p>Enter the least amount of days / week that you'd like to engage each category.</p>
                            <span>
                                <label>
                                    Mind:
                                    <input type='text' value={mindLow} onChange={event => setMindLow(event.target.value)}></input>
                                </label>
                                <label>
                                    Body:
                                    <input type='text' value={bodyLow} onChange={event => setBodyLow(event.target.value)}></input>
                                </label>
                                <label>
                                    Social:
                                    <input type='text' value={socialLow} onChange={event => setSocialLow(event.target.value)}></input>
                                </label>
                                <label>
                                    Mindful:
                                    <input type='text' value={mindfulLow} onChange={event => setMindfulLow(event.target.value)}></input>
                                </label>
                                <label>
                                    Me Time:
                                    <input type='text' value={meTimeLow} onChange={event => setMeTimeLow(event.target.value)}></input>
                                </label>
                            </span>
                            <Button variant='success' onClick={() => validateLow()}>Next</Button>
                        </span>
                    )
                case 1:
                    return (
                        <span>
                            <Button variant='info' onClick={() => setFormStep(0)}>Previous</Button>
                            <p>Enter your goal, how many days is just right?</p>
                            <span>
                                <label>
                                    Mind:
                                    <input type='text' value={mindGoal} onChange={event => setMindGoal(event.target.value)}></input>
                                </label>
                                <label>
                                    Body:
                                    <input type='text' value={bodyGoal} onChange={event => setBodyGoal(event.target.value)}></input>
                                </label>
                                <label>
                                    Social:
                                    <input type='text' value={socialGoal} onChange={event => setSocialGoal(event.target.value)}></input>
                                </label>
                                <label>
                                    Mindful:
                                    <input type='text' value={mindfulGoal} onChange={event => setMindfulGoal(event.target.value)}></input>
                                </label>
                                <label>
                                    Me Time:
                                    <input type='text' value={meTimeGoal} onChange={event => setMeTimeGoal(event.target.value)}></input>
                                </label>
                            </span>
                            <Button variant='success' onClick={() => validateGoal()}>Next</Button>
                        </span>
                    )
                case 2:
                    return (
                        <span>
                            <Button variant='info' onClick={() => setFormStep(1)}>Previous</Button>
                            <p>Enter the most amount of days / week that you'd like to engage each category (limit yourself to avoid burnout).</p>
                            <span>
                                <label>
                                    Mind:
                                    <input type='text' value={mindHigh} onChange={event => setMindHigh(event.target.value)}></input>
                                </label>
                                <label>
                                    Body:
                                    <input type='text' value={bodyHigh} onChange={event => setBodyHigh(event.target.value)}></input>
                                </label>
                                <label>
                                    Social:
                                    <input type='text' value={socialHigh} onChange={event => setSocialHigh(event.target.value)}></input>
                                </label>
                                <label>
                                    Mindful:
                                    <input type='text' value={mindfulHigh} onChange={event => setMindfulHigh(event.target.value)}></input>
                                </label>
                                <label>
                                    Me Time:
                                    <input type='text' value={meTimeHigh} onChange={event => setMeTimeHigh(event.target.value)}></input>
                                </label>
                            </span>
                            <Button variant='success' onClick={() => validateHigh()}>Next</Button>
                        </span>
                    )
                case 3: 
                        return (
                            <span>
                                <Button variant='info' onClick={() => setFormStep(2)}>Previous</Button>
                                <p>Make changes to the suggested priorities</p>
                                <span>
                                    <label>
                                        Mind:
                                        <input type='text' value={mindPriority} onChange={event => setMindPriority(event.target.value)}></input>
                                    </label>
                                    <label>
                                        Body:
                                        <input type='text' value={bodyPriority} onChange={event => setBodyPriority(event.target.value)}></input>
                                    </label>
                                    <label>
                                        Social:
                                        <input type='text' value={socialPriority} onChange={event => setSocialPriority(event.target.value)}></input>
                                    </label>
                                    <label>
                                        Mindful:
                                        <input type='text' value={mindfulPriority} onChange={event => setMindfulPriority(event.target.value)}></input>
                                    </label>
                                    <label>
                                        Me Time:
                                        <input type='text' value={meTimePriority} onChange={event => setMeTimePriority(event.target.value)}></input>
                                    </label>
                                </span>
                                <LoaderButton variant='success' isLoading={submitLoading} onClick={() => handleSubmit()}>Set Priorities</LoaderButton>
                         </span>
                        )
                    default:
                        return(<></>);
            }
        } else {
            return(<></>);
        }
    }

    function renderLoading(){
        return(
            <h1>LOADING...</h1>
        )
    }

    function renderLander(){
        if(priorities_list.length > 0){
            let priorities = priorities_list.sort((a,b) => b.priority - a.priority)
            return(
                <div>
                    <Button variant='secondary' onClick={() => setShowPrioritiesForm(!showPrioritiesForm)}>Set Priorities</Button>
                    {renderPrioritiesForm()}
                    {priorities.map((category) => {
                        return(
                            <span key={category.category} className='priority'>
                                <span className='priority-header'>
                                    <h4 className='priority-category'><strong>{category.category}</strong></h4>
                                    <p className='priority-num'>{category.priority}</p> 
                                </span>
                                <span className='priority-goal-row'>
                                    <span className='goal'>
                                        <p>Low Goal</p>
                                        <p className='goal-num'>{category.low}</p>
                                    </span>
                                    <span className='target-goal'>
                                        <p>Target</p>
                                        <p className='goal-num'>{category.goal}</p>
                                    </span>
                                    <span className='goal'>
                                        <p>Limit</p>
                                        <p className='goal-num'>{category.high}</p>
                                    </span>
                                </span>
                            </span>
                        )
                    })}
                </div>
            )
        } else {
            return(
                <div>
                    <h3>No Priorities Set</h3>
                    <h6>Set them using the button below to activate the Coach</h6>
                    <Button variant='secondary' onClick={() => setShowPrioritiesForm(!showPrioritiesForm)}>Set Priorities</Button>
                    {renderPrioritiesForm()}
                </div>
            )
        }
    }
    return(
        <div>
            {(!isLoading) ? renderLander() : renderLoading()}
        </div>
    )
}
