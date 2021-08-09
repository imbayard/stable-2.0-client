import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import ToggleButton from "react-bootstrap/ToggleButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { API } from "aws-amplify";
import { onError } from "../libs/errorLib";

export default function NewNote() {
  // This page lets you begin the check-in journey
  const history = useHistory();
  const [mind, setMind] = useState(false);
  const [body, setBody] = useState(false);
  const [social, setSocial] = useState(false);
  const [mindful, setMindful] = useState(false);
  const [meTime, setMeTime] = useState(false);
  const [lessOne, setLessOne] = useState(false);
  const [lessTwo, setLessTwo] = useState(false);
  const [pushedSelf, setPushedSelf] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
        await createCheckIn({mindBool: mind, bodyBool: body, socialBool: social, mindfulBool: mindful, meTimeBool: meTime, lessOneBool: lessOne, lessTwoBool: lessTwo, pushedSelfBool: pushedSelf});
        history.push("/");
    } catch (e) {
        onError(e);
        setIsLoading(false);
    }
  }

  function createCheckIn(checkInObject) {
        return API.post("stable-2", "/checkin/submit", {
            body: checkInObject
        });
  }

  return (
    <div className="DailyCheckIn">
      <h1>Daily Check-in</h1>
      <h6>Press the button to say that you engaged in the activity today.</h6>
      <br></br>
      <Form onSubmit={handleSubmit}>
        <ButtonGroup toggle className="mb-2">
            <ToggleButton 
             type="checkbox"
             checked={mind}
             value="1"
             variant="success"
             onChange={e => setMind(e.currentTarget.checked)}
            >
                Mind
            </ToggleButton>
            <ToggleButton 
             type="checkbox"
             checked={body}
             value="2"
             variant="success"
             onChange={e => setBody(e.currentTarget.checked)}
            >
                Body
            </ToggleButton>
            <ToggleButton 
             type="checkbox"
             checked={social}
             value="3"
             variant="success"
             onChange={e => setSocial(e.currentTarget.checked)}
            >
                Social
            </ToggleButton>
            <ToggleButton 
             type="checkbox"
             checked={mindful}
             value="4"
             variant="success"
             onChange={e => setMindful(e.currentTarget.checked)}
            >
                Mindful
            </ToggleButton>
            <ToggleButton 
             type="checkbox"
             checked={meTime}
             value="5"
             variant="success"
             onChange={e => setMeTime(e.currentTarget.checked)}
            >
                Me Time
            </ToggleButton>
            <ToggleButton 
             type="checkbox"
             checked={lessOne}
             value="6"
             variant="danger"
             onChange={e => setLessOne(e.currentTarget.checked)}
            >
                Weed
            </ToggleButton>
            <ToggleButton 
             type="checkbox"
             checked={lessTwo}
             value="7"
             variant="danger"
             onChange={e => setLessTwo(e.currentTarget.checked)}
            >
                Poor Eating
            </ToggleButton>
            <ToggleButton 
             type="checkbox"
             checked={pushedSelf}
             value="8"
             variant="info"
             onChange={e => setPushedSelf(e.currentTarget.checked)}
            >
                Did you push yourself?
            </ToggleButton>
        </ButtonGroup>
        <LoaderButton
          block
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
        >
          Submit Check-in
        </LoaderButton>
      </Form>
    </div>
  );
}