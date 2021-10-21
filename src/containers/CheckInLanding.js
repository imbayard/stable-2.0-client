import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { onError } from "../libs/errorLib";
import {FaMeh, FaGrin, FaFrown} from "react-icons/fa";
import ToggleButton from "react-bootstrap/ToggleButton";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import LoaderButton from "../components/LoaderButton";

import {submitCheckIn} from "../libs/apiLib";

export default function NewCheckIn() {

    const history = useHistory();
    const [happiness, setHappiness] = useState(1);
    const [mind, setMind] = useState(false);
    const [body, setBody] = useState(false);
    const [social, setSocial] = useState(false);
    const [mindful, setMindful] = useState(false);
    const [meTime, setMeTime] = useState(false);
    const [pushedSelf, setPushedSelf] = useState(false);
    const [notes, setNotes] = useState("");
    const [excitement, setExcitement] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [pageCount, setPageCount] = useState(0); // Ranges 0 - 8 (9 pages)

    const handleGetStartedClick = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    function handleHappiness(e) {
        setHappiness(e);
        setPageCount(1);
    }

    function handleExcitement(e) {
        setExcitement(e);
        setPageCount(8);
    }

    function renderPage(){
        switch (pageCount) {
            case 0:
                return(
                    <>
                        <h4>Hey there, thanks for stopping by.<br />How was your day today?</h4>
                        <br />
                        <Button variant="success" onClick={() => handleHappiness(3)}><FaGrin /></Button>
                        <Button variant="secondary" onClick={()=> handleHappiness(2)}><FaMeh /></Button>
                        <Button variant="primary" onClick={() => handleHappiness(1)}><FaFrown /></Button>
                    </>
                )
            case 1:
                return(
                    <>
                        <h4>Did you engage your mind today?</h4>
                        <br />
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
                    </>
                )
            case 2:
                return(
                    <>
                        <h4>Did you engage your body today?</h4>
                        <br />
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
                    </>
                )
            case 3:
                return(
                    <>
                        <h4>Were you social today?</h4>
                        <br />
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
                    </>
                )
            case 4: 
                return(
                    <>
                        <h4>Did you practice mindfulness today?</h4>
                        <br />
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
                    </>
                )
            case 5: 
                return(
                    <>
                        <h4>Did you have any 'me-time' today?</h4>
                        <br />
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
                    </>
                )
            case 6: 
                return(
                    <>
                        <h4>Did you do any of the following today?</h4>
                        <ul>
                            <li>Pushed yourself in some way</li>
                            <li>Went on an adventure</li>
                            <li>Helped someone in need</li>
                            <li>Noticed self-growth</li>
                            <li>Just had a really fulfilling day</li>
                        </ul>
                        <br />
                        <ButtonGroup toggle className="mb-2">
                            <ToggleButton
                                type="checkbox"
                                checked={pushedSelf}
                                variant="success"
                                onChange={() => setPushedSelf(true)}
                            >Yes
                            </ToggleButton>
                            <ToggleButton 
                                type="checkbox"
                                checked={!pushedSelf}
                                variant="primary" 
                                onChange={() => setPushedSelf(false)}
                            >No</ToggleButton>
                        </ButtonGroup>
                    </>
                )
            case 7:
                return(
                    <>
                        <h4>Almost done! How excited are you for tomorrow?</h4>
                        <br />
                        <Button variant="success" onClick={() => handleExcitement(3)}><FaGrin /></Button>
                        <Button variant="secondary" onClick={()=> handleExcitement(2)}><FaMeh /></Button>
                        <Button variant="primary" onClick={() => handleExcitement(1)}><FaFrown /></Button>
                    </>
                )
            case 8:
                return(
                    <>
                        <h4>Care to reflect on today at all?</h4>
                        <br />
                        <Form>
                            <Form.Group>
                                <Form.Label>Notes</Form.Label>
                                <Form.Control value={notes} as="textarea" rows={3} onChange={e => setNotes(e.currentTarget.value)}/>
                            </Form.Group>
                        </Form>
                    </>
                )
            default:
                break;
        }
    }

    async function handleSubmit(){
        setIsLoading(true);
        try{
            await submitCheckIn({happiness: happiness, mindBool: mind, bodyBool: body, socialBool: social, mindfulBool: mindful, meTimeBool: meTime, pushedSelfBool: pushedSelf, excitement: excitement, notes: notes});
            history.push("/");
        } catch(e) {
            onError(e);
        }
        setIsLoading(false);
    }

    function handleBackClick(){
        if(pageCount === 0){ // Simply close the modal if the user hasn't progressed past first page
            closeModal();
        } else { // Otherwise, decrease the page count
            setPageCount(pageCount - 1);
        }
    }

    function handleForwardClick(){
        if(pageCount === 8){ // Start submission process if on last page
            handleSubmit();
        } else { // Otherwise, increase the page count
            setPageCount(pageCount + 1);
        }
    }

    function renderButton(){
        return(
            <Button variant="success" size="lg" onClick={handleGetStartedClick}>Get Started</Button>
        )
    }

    function renderModal(){
        return(
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Daily Check-In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderPage()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleBackClick}>Go Back</Button>
                    <LoaderButton isLoading={isLoading} variant='primary' onClick={handleForwardClick}>Go Forward</LoaderButton>
                </Modal.Footer>
            </Modal>
        )
    }

    return(
        <div>
            <h1>Daily Check-In</h1>
            <h6>Welcome to your check-in. Hit 'Get Started' below to reflect on your day.</h6>

            <br />
            {
            /* Before button click, render button. After button click, render modal */
            (!showModal ? renderButton() : renderModal())
            }

        </div>
    )

}