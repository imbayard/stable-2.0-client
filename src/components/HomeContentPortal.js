import { React, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import "../containers/Home.css";
import getVideo from "../content/AMVideos";

export default function HomeContentPortal() {
    const [isOpen, setIsOpen] = useState(false);
    const [length, setLength] = useState("");
    const [type, setType] = useState("");
    const [video, setVideo] = useState([]);

    async function onSubmit() {
        if(!length || !type){
            window.confirm("You must select the length and type.");
            console.log(video);
        } else {
            const theVideo = await getVideo(length, type);
            setVideo(theVideo);
            const win = window.open(theVideo.url, "_blank");
            win.focus();
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
                                <Button variant={(type === 'motivational') ? 'info' : 'secondary'} onClick={() => setType("motivational")}>Motivational</Button>
                                <Button variant={(type === 'perspectives') ? 'info' : 'secondary'} onClick={() => setType("perspectives")}>Perspectives</Button>
                                <Button variant={(type === 'selfwork') ? 'info' : 'secondary'} onClick={() => setType("selfwork")}>Self-Work</Button>
                            </ButtonGroup>
                        </label>
                        <Button variant="success" onClick={() => onSubmit()}>Submit</Button>
                        </span>
                    </form>
                </div>
            )
        }
    }

    return(
        <div>
            <span className='check-in-row'>
            <Button variant='success' size='sm' onClick={() => setIsOpen(!isOpen)}>
                Content Portal
            </Button>
            <p className='custom-alert'>If you have the time, watch a video or two.</p>
            </span>
            {renderDrawer()}
        </div>
      )
}