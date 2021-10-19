import { React, useState } from 'react';
import Button from 'react-bootstrap/Button';
import LoaderButton from '../components/LoaderButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import "../containers/Home.css";
import {getVideo, updateVideo} from "../content/AMVideos";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";

export default function HomeContentPortal() {
    const [isOpen, setIsOpen] = useState(false);
    const [length, setLength] = useState("");
    const [type, setType] = useState("");
    const [video, setVideo] = useState([]);
    const [inReview, setInReview] = useState(false);
    const [didWatch, setDidWatch] = useState(false);
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState("");

    async function onSubmit() {
        if(!length || !type){
            window.confirm("You must select the length and type.");
            console.log(video);
        } else {
            const theVideo = await getVideo(length, type);
            console.log(theVideo);
            setVideo(theVideo);
            const win = window.open(theVideo.checkInId, "_blank");
            win.focus();
            setInReview(true);
        }
    }
    
    function renderDrawer() {
        if(!isOpen){
            return(<></>);
        } else {
            return(
                <div>
                    <form>
                        <span>
                        <label>
                            <strong>Video Length:</strong>{"   "}
                            <ButtonGroup aria-label="Video Length">
                                <Button variant={(length === 'five') ? 'info' : 'secondary'} onClick={() => setLength("five")}>~5 min</Button>
                                <Button variant={(length === 'ten') ? 'info' : 'secondary'} onClick={() => setLength("ten")}>~10 min</Button>
                                <Button variant={(length === 'thirty') ? 'info' : 'secondary'} onClick={() => setLength("thirty")}>~30 min</Button>
                                <Button variant={(length === 'fortyfive') ? 'info' : 'secondary'} onClick={() => setLength("fortyfive")}>~45 min</Button>
                            </ButtonGroup>
                        </label>
                        <label>
                            <strong>Video Type</strong>{"   "}
                            <ButtonGroup aria-label="Video Type">
                                <Button variant={(type === 'unwatched') ? 'info' : 'secondary'} onClick={() => setType("unwatched")}>Unwatched</Button>
                                <Button variant={(type === 'practice') ? 'info' : 'secondary'} onClick={() => setType("practice")}>Practice</Button>
                                <Button variant={(type === 'passive') ? 'info' : 'secondary'} onClick={() => setType("passive")}>Passive</Button>
                            </ButtonGroup>
                        </label>
                        <Button variant="success" onClick={() => onSubmit()}>Submit</Button>
                        </span>
                    </form>
                </div>
            )
        }
    }

    async function submitReview() {
        if(category === ""){
            onError("Need to choose a category");
            return;
        }
        const updated_video = updateVideo(video, didWatch, category, notes);
        setVideo(updated_video);
        setLoading(true);
        try{
            await updateVideoHere(updated_video);
            setLoading(false);
            setInReview(false);
        } catch(e) {
            onError(e);
            setLoading(false);
        }
    }

    async function updateVideoHere(updated_video){
        return API.post("stable-2", `/content/submit`, {body:updated_video});
    }

    function renderForm(){
        return(
            <span>
                <label>
                    <strong>Did you watch the video?</strong>
                    <ButtonGroup aria-label="Watched?">
                        <Button variant={(didWatch) ? 'success' : 'secondary'} onClick={() => setDidWatch(true)}>Yes</Button>
                        <Button variant={(!didWatch) ? 'info' : 'secondary'} onClick={() => setDidWatch(false)}>No</Button>
                    </ButtonGroup>
                </label>
                <label>
                    <strong>Which category does it fit?</strong>
                    <ButtonGroup aria-label="Category">
                        <Button variant={(category === 'practice') ? 'info' : 'secondary'} onClick={() => setCategory("practice")}>Practice</Button>
                        <Button variant={(category === 'passive') ? 'info': 'secondary'} onClick={() => setCategory("passive")}>Passive</Button>
                    </ButtonGroup>
                </label>
                <label>
                    <strong>Any notes?</strong>
                    <input type='text' value={notes} onChange={event => setNotes(event.target.value)}/>
                </label>
                <LoaderButton isLoading={loading} variant="success" onClick={() => submitReview()}>Submit</LoaderButton>
            </span>
        )
    }

    return(
        <div>
            <span className='check-in-row'>
            <Button variant='success' size='sm' onClick={() => setIsOpen(!isOpen)}>
                Content Portal
            </Button>
            <p className='custom-alert'>If you have the time, watch a video or two.</p>
            </span>
            {(inReview) ? renderForm() : renderDrawer()}
        </div>
      )
}