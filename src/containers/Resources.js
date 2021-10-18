import "./Resources.css";
import { React, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import LoaderButton from "../components/LoaderButton";
import { API } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";

export default function Resources() {
    // This is the resources page
    // It will contain 10 minute or less exercies / lessons for each of the 5 categories
    const history = useHistory();
    const [length, setLength] = useState(0);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setIsLoading] = useState(false);

    const theP = "thisisbayard";

    function validateSubmit(password) {
        if (password === theP){
            return true;
        }
        return false;
    }

    async function handleSubmit(){
        const validate = validateSubmit(password);
        if(!validate){
            return;
        }
        setIsLoading(true);
        try{
            await submitCheckIn({url: url, title: title, length: length});
            history.push("/");
        }
        catch(e){
            onError(e);
        }
        setIsLoading(false);
    }

    function submitCheckIn(checkInObject){
        return API.post("stable-2", "/content/submit", {
            body: checkInObject
        });
    }


    return(
        <div>
            <h1>Add Content</h1>
            <span className='form'>
                <label>
                    <h6>Video Name</h6>
                    <input type='text' value={title} onChange={event => setTitle(event.target.value)}/>
                </label>
                <label>
                    <Dropdown>
                        <Dropdown.Toggle variant='info'>
                            Length
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onSelect={() => setLength(5)}>5</Dropdown.Item>
                            <Dropdown.Item onSelect={() => setLength(5)}>10</Dropdown.Item>
                            <Dropdown.Item onSelect={() => setLength(5)}>30</Dropdown.Item>
                            <Dropdown.Item onSelect={() => setLength(5)}>45</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </label>
                <label>
                    <h6>URL</h6>
                    <input type='text' value={url} onChange={event => setUrl(event.target.value)}/>
                </label>
                <label>
                    <h6>Bayard?</h6>
                    <input type='text' value={password} onChange={event => setPassword(event.target.value)}/>
                </label>
                <LoaderButton variant="success" isLoading={loading} onClick={() => handleSubmit()}>Submit</LoaderButton>
            </span>
        </div>
    )

}