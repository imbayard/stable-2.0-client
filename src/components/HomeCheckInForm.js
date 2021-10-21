import React, { useState } from "react";
import { onError } from "../libs/errorLib";
import { useHistory } from "react-router-dom";
import LoaderButton from "./LoaderButton";
import DatePicker from "react-datepicker";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

import {submitCheckIn} from "../libs/apiLib";

import "./HomeCheckInForm.css";
import "react-datepicker/dist/react-datepicker.css";

export default function HomeCheckInForm({
    dateList,
    ...props
}) {
    const history = useHistory();
    const [loading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState(Date.now());
    const [mind, setMind] = useState(false);
    const [body, setBody] = useState(false);
    const [social, setSocial] = useState(false);
    const [mindful, setMindful] = useState(false);
    const [meTime, setMeTime] = useState(false);
    const [trophy, setTrophy] = useState(false);

    function formatDate(date){
        const newDate = new Date(date).toLocaleString("en-US", { timeZone: 'EST'});
        const dateArr = newDate.split('/');
        const year = dateArr[2].substr(0,4);
        const month = dateArr[0];
        const day = dateArr[1];
        return (month + "/" + day + "/" + year);
    }

    function checkDates(dateCreated){
        const formattedDate = formatDate(dateCreated)
        for(let i = 0; i < dateList.length; i++){
            if(dateList[i] === formattedDate){
                return {
                    isValid: false,
                    message: "There's already a check-in for this day."
                }
            }
        }
        if (dateCreated > Date.now()){
            return {
                isValid: false,
                message: "You can't check-in for a day that hasn't happend yet!"
            }
        }
        return {
            isValid: true,
            message: "nothing to see here ;)"
        };
    }

    async function handleSubmit() {
        setIsLoading(true);
        let theDate;
        try{
            theDate = date.getTime()
        } catch {
            theDate = date
        }
        const outputObject = {
            dateCreated: theDate,
            mindBool: mind,
            bodyBool: body,
            socialBool: social,
            mindfulBool: mindful,
            meTimeBool: meTime,
            pushedSelfBool: trophy,
        }
        const isValid = checkDates(date);
        if(!isValid.isValid){
            window.confirm(isValid.message);
            setIsOpen(false);
            setIsLoading(false);
            return;
        }
        try{
            await submitCheckIn(outputObject);
            history.go(0);
        }
        catch(e) {
            onError(e);
        }
        setIsLoading(false);
        setIsOpen(false);
    }

    if(isOpen){
        return(
            <div>
                <form id="override-bootstrap">
                    <span className="dayForm">
                        <label>
                            Date:
                            <DatePicker selected={date} onChange={(chDate) => setDate(chDate)} />
                        </label>
                        <label>
                            Mind:
                            <ButtonGroup aria-label="Mind">
                                <Button
                                    variant={(mind) ? 'info' : 'secondary'}
                                    onClick={() => setMind(true)}
                                >Yes
                                </Button>
                                <Button
                                    variant={(mind === false) ? 'info' : 'secondary'} 
                                    onClick={() => setMind(false)}
                                >No</Button>
                            </ButtonGroup>
                        </label>
                        <label>
                            Body:
                                <ButtonGroup aria-label="Body">
                                    <Button
                                        variant={(body) ? 'info' : 'secondary'}
                                        onClick={() => setBody(true)}
                                    >Yes
                                    </Button>
                                    <Button
                                        variant={(body === false) ? 'info' : 'secondary'} 
                                        onClick={() => setBody(false)}
                                    >No</Button>
                                </ButtonGroup>
                        </label>
                        <label>
                            Social:
                                <ButtonGroup aria-label="Social">
                                    <Button
                                        variant={(social) ? 'info' : 'secondary'}
                                        onClick={() => setSocial(true)}
                                    >Yes
                                    </Button>
                                    <Button
                                        variant={(social === false) ? 'info' : 'secondary'} 
                                        onClick={() => setSocial(false)}
                                    >No</Button>
                                </ButtonGroup>
                        </label>
                        <label>
                            Mindful:
                                <ButtonGroup aria-label="Mindful">
                                    <Button
                                        variant={(mindful) ? 'info' : 'secondary'}
                                        onClick={() => setMindful(true)}
                                    >Yes
                                    </Button>
                                    <Button
                                        variant={(mindful === false) ? 'info' : 'secondary'} 
                                        onClick={() => setMindful(false)}
                                    >No</Button>
                                </ButtonGroup>
                        </label>
                        <label>
                            Me Time:
                            <ButtonGroup aria-label="MeTime">
                                <Button
                                    variant={(meTime) ? 'info' : 'secondary'}
                                    onClick={() => setMeTime(true)}
                                >Yes
                                </Button>
                                <Button
                                    variant={(meTime === false) ? 'info' : 'secondary'} 
                                    onClick={() => setMeTime(false)}
                                >No</Button>
                            </ButtonGroup>
                        </label>
                        <label>
                            Trophy:
                            <ButtonGroup aria-label="Trophy">
                                <Button
                                    variant={(trophy) ? 'info' : 'secondary'}
                                    onClick={() => setTrophy(true)}
                                >Yes
                                </Button>
                                <Button
                                    variant={(trophy === false) ? 'info' : 'secondary'} 
                                    onClick={() => setTrophy(false)}
                                >No</Button>
                            </ButtonGroup>
                        </label>
                        <LoaderButton isLoading={loading} variant='success' onClick={() => handleSubmit()}>+</LoaderButton>
                    </span>
                </form>
            </div>
        );
    } else {
        return(
            <div>
                    <Button variant='success' size='sm' onClick={() => setIsOpen(true)}>Open Quick-Add</Button>
            </div>
        )
    }
}
