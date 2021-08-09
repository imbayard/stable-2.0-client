import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Alert from "react-bootstrap/Alert";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import Table from 'react-bootstrap/Table';
import { CheckMark, XMark, TrophySymbol } from "../components/Icons";
import Chart from "react-google-charts";

import "./Home.css";

export default function Home() {

  const [checkIns, setCheckIns] = useState([]);
  const {isAuthenticated} = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [mindAvg, setMindAvg] = useState(0.0);
  const [bodyAvg, setBodyAvg] = useState(0);
  const [socialAvg, setSocialAvg] = useState(0);
  const [mindfulAvg, setMindfulAvg] = useState(0);
  const [meTimeAvg, setMeTimeAvg] = useState(0);
  const [lessOneAvg, setLessOneAvg] = useState(0);
  const [lessTwoAvg, setLessTwoAvg] = useState(0);
  const [pushedSelfAvg, setPushedSelfAvg] = useState(0);
  

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const result = await loadCheckIns();
        setCheckIns(result.checkIns);
        setMindAvg(result.averages.mind);
        setBodyAvg(result.averages.body);
        setSocialAvg(result.averages.social);
        setMindfulAvg(result.averages.mindful);
        setMeTimeAvg(result.averages.meTime);
        setLessOneAvg(result.averages.lessOne);
        setLessTwoAvg(result.averages.lessTwo);
        setPushedSelfAvg(result.averages.pushedSelf);
      } catch(e) {
        onError(e);
      }
      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadCheckIns(){
    return API.get("stable-2", "/checkin/list");
  }

  function renderCheckInList(checkIns){
    checkIns.sort((a, b) => (a.dateCreated > b.dateCreated) ? 1 : -1);
    return (
      <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Mind</th>
                <th>Body</th>
                <th>Social</th>
                <th>Mindful</th>
                <th>Me Time</th>
                <th>Weed</th>
                <th>Poor Eating</th>
                <th>Pushed Self</th>
              </tr>
            </thead>
            <tbody>
              {checkIns.map(({ checkInId, mindBool, bodyBool, socialBool, mindfulBool, meTimeBool, lessOneBool, lessTwoBool, pushedSelfBool, dateCreated}) => (
                  <tr key={checkInId}>
                    <td><a href={`/checkin/${checkInId}`}>{new Date(dateCreated).toLocaleString("en-US", { timeZone: 'EST'})}</a></td>
                    <td>{mindBool ? CheckMark() : XMark()}</td>
                    <td>{bodyBool ? CheckMark() : XMark()}</td>
                    <td>{socialBool ? CheckMark() : XMark()}</td>
                    <td>{mindfulBool ? CheckMark() : XMark()}</td>
                    <td>{meTimeBool ? CheckMark() : XMark()}</td>
                    <td>{lessOneBool ? CheckMark() : XMark()}</td>
                    <td>{lessTwoBool ? CheckMark() : XMark()}</td>
                    <td>{pushedSelfBool ? TrophySymbol() : "-"}</td>
                  </tr>
              ))}
            </tbody>
          </Table>
      </>
    );
  }

  function renderAlert() {
    if (checkIns.length >= 5){
      return (<Alert key={"pushed"} variant='info'>You've pushed yourself on {pushedSelfAvg*100}% of recorded days.</Alert>);
    } else if (checkIns.length >=3) {
      return (<Alert variant="info">Great work! Keep recording your daily check-ins.</Alert>);
    } else if (checkIns.length === 2) {
      return (<Alert variant="info">Nice! Remember, the more check-ins you record, the more aware you'll be of your tendencies.</Alert>);
    } else if (checkIns.length === 1) { 
      return (<Alert variant="info">Congrats on starting down this path! The more days where you record a check-in, the more aware you'll be of your tendencies. From there, you can make any adjustments you see fit.</Alert>);
    }
  }

  function renderChart() {
    return(
      <>
      <Chart
        width={'500px'}
        height={'300px'}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={[
          ['Balance Area', 'Percentage of Days Engaged'],
          ['Mind', mindAvg],
          ['Body', bodyAvg],
          ['Social', socialAvg],
          ['Mindful', mindfulAvg],
          ['Me Time', meTimeAvg],
          ['Weed', lessOneAvg],
          ['Poor Eating', lessTwoAvg],
        ]}
        options={{
          title: 'My Balance Profile',
        }}
        rootProps={{ 'data-testid': '1' }}
      />
        {renderAlert()}
      </>
    );
  }

  function renderLander() {
    return (
        <div className="lander">
          <h1>Stable</h1>
          <p className="text-muted">Find Your Balance</p>
        </div>
    );
  }

  function renderCheckIns() {
    if(checkIns.length > 0){
      return (
        <div className='checkIns'>
          <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Balance History</h2>
          <ListGroup>{!isLoading && renderCheckInList(checkIns)}</ListGroup>
          <>{!isLoading && renderChart()}</>
        </div>
      )
    } else {
      return (
        <div className='checkIns'>
          <br/>
          <h2>Looks like you haven't used this before.</h2>
          <h5>Click 'Daily Check-In' above in order to see your balance profile.</h5>
        </div>
      )
    }

  }

  return (
    <div className="Home">
      {isAuthenticated ? renderCheckIns() : renderLander()}
    </div>
  );
}