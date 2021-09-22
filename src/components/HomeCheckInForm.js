import React, { useState } from "react";
import { onError } from "../libs/errorLib";
import { useHistory } from "react-router-dom";
import LoaderButton from "./LoaderButton";
import { API } from "aws-amplify";
import DatePicker from "react-datepicker";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Button from "react-bootstrap/Button";

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
        for(let i = 0; i < dateList.length; i++){
            if(dateList[i] === dateCreated){
                return false
            }
        }
        return true;
    }

    function submitCheckIn(checkInObject){
        return API.post("stable-2", "/checkin/submit", {
            body: checkInObject
        });
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
        const isValid = checkDates(formatDate(date));
        if(!isValid){
            window.confirm("A Check-in with this date already exists");
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
                <form>
                    <span className="dayForm">
                        <label>
                            Date:
                            <DatePicker selected={date} onChange={(chDate) => setDate(chDate)} />
                        </label>
                        <label>
                            Mind:
                            <ButtonGroup toggle className="mb-2">
                                <ToggleButton
                                    type="checkbox"
                                    checked={mind}
                                    variant="success"
                                    onChange={() => setMind(true)}
                                >Yes
                                </ToggleButton>
                                <ToggleButton 
                                    type="checkbox"
                                    checked={!mind}
                                    variant="primary" 
                                    onChange={() => setMind(false)}
                                >No</ToggleButton>
                            </ButtonGroup>
                        </label>
                        <label>
                            Body:
                                <ButtonGroup toggle className="mb-2">
                                    <ToggleButton
                                        type="checkbox"
                                        checked={body}
                                        variant="success"
                                        onChange={() => setBody(true)}
                                    >Yes
                                    </ToggleButton>
                                    <ToggleButton 
                                        type="checkbox"
                                        checked={!body}
                                        variant="primary" 
                                        onChange={() => setBody(false)}
                                    >No</ToggleButton>
                                </ButtonGroup>
                        </label>
                        <label>
                            Social:
                                <ButtonGroup toggle className="mb-2">
                                    <ToggleButton
                                        type="checkbox"
                                        checked={social}
                                        variant="success"
                                        onChange={() => setSocial(true)}
                                    >Yes
                                    </ToggleButton>
                                    <ToggleButton 
                                        type="checkbox"
                                        checked={!social}
                                        variant="primary" 
                                        onChange={() => setSocial(false)}
                                    >No</ToggleButton>
                                </ButtonGroup>
                        </label>
                        <label>
                            Mindful:
                                <ButtonGroup toggle className="mb-2">
                                    <ToggleButton
                                        type="checkbox"
                                        checked={mindful}
                                        variant="success"
                                        onChange={() => setMindful(true)}
                                    >Yes
                                    </ToggleButton>
                                    <ToggleButton 
                                        type="checkbox"
                                        checked={!mindful}
                                        variant="primary" 
                                        onChange={() => setMindful(false)}
                                    >No</ToggleButton>
                                </ButtonGroup>
                        </label>
                        <label>
                            Me Time:
                            <ButtonGroup toggle className="mb-2">
                                <ToggleButton
                                    type="checkbox"
                                    checked={meTime}
                                    variant="success"
                                    onChange={() => setMeTime(true)}
                                >Yes
                                </ToggleButton>
                                <ToggleButton 
                                    type="checkbox"
                                    checked={!meTime}
                                    variant="primary" 
                                    onChange={() => setMeTime(false)}
                                >No</ToggleButton>
                            </ButtonGroup>
                        </label>
                        <label>
                            Trophy:
                                <ButtonGroup toggle className="mb-2">
                                    <ToggleButton
                                        type="checkbox"
                                        checked={trophy}
                                        variant="success"
                                        onChange={() => setTrophy(true)}
                                    >Yes
                                    </ToggleButton>
                                    <ToggleButton 
                                        type="checkbox"
                                        checked={!trophy}
                                        variant="primary" 
                                        onChange={() => setTrophy(false)}
                                    >No</ToggleButton>
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
