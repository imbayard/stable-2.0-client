import React from 'react';
import "./Welcome.css";
import afterCheckIn from './images/afterCheckIn.jpeg';
import checkIn from "./images/checkIn.jpeg";
import preCheckIn from "./images/preCheckIn.jpeg";

export default function Welcome() {
    return(
        <div className='welcome'>
            <h1 className='header'>Welcome to Stable.</h1>
            <h3 className='header'>Read the statements below to get started! (1min)</h3>
            <p>Thanks for trying out the app! I'll try to keep this part brief. <br /> The idea is to track habits by category. <br />Check out the example below.</p>
            <p>This is what your view will be like after completing many daily check-ins</p>
            <img alt="The homepage before user checks in" src={preCheckIn} style={{border:'1px solid'}} />
            <p>Some things to note
                <ul>
                    <li>See the coach, he notices patterns and alerts you to them. </li>
                    <li>Here, he notices that the user hasn't had any 'me time' in the last three days</li>
                    <li>The user isn't consistent in their inputs, more consistency trains the coach better</li>
                </ul>
            </p>
            <p>Next, the user will go through a daily check-in. Here's one question the coach will ask you (it corresponds to the trophy)</p>
            <img alt="The trophy part of the daily check-in" src={checkIn} />
            <p>After submitting their check-in (takes less than three minutes), it takes us back to the home page</p>
            <img alt="The homepage after user checks in" src={afterCheckIn} style={{border:'1px solid'}} />
            <p>Some things to note
                <ul>
                    <li>The coach notices a new pattern and commends the user</li>
                    <li>The record check-in button is disabled (you only need to record once per day)</li>
                </ul>
            </p>
            <h3>That's all for now, hit 'Next' below and don't forget to record your check-in tonight!</h3>
            <a href="/">Next</a>
        </div>
    )
}