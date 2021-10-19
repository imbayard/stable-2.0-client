import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import Table from 'react-bootstrap/Table';
import { useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { CheckMark, XMark, TrophySymbol } from "../components/Icons";
import Chart from "react-google-charts";
import Coach from "../components/Coach";
import HomeCheckInForm from "../components/HomeCheckInForm";
import HomeContentPortal from "../components/HomeContentPortal";

import "./Home.css";

export default function Home() {
  // This is the user's homepage. It will render:
  // - All of the user's checkIns
  // - A pie chart (the user's balance profile)
  // - An alert message based on how many checkIns the user has submitted
  const history = useHistory();
  const [checkIns, setCheckIns] = useState([]); // This generates the list of checkIns
  const {isAuthenticated} = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  // These averages below are all used for the pie chart
  const [mindAvg, setMindAvg] = useState(0.0);
  const [bodyAvg, setBodyAvg] = useState(0);
  const [socialAvg, setSocialAvg] = useState(0);
  const [mindfulAvg, setMindfulAvg] = useState(0);
  const [meTimeAvg, setMeTimeAvg] = useState(0);
  const [lessOneAvg, setLessOneAvg] = useState(0);
  const [lessTwoAvg, setLessTwoAvg] = useState(0);
  const [flags, setFlags] = useState({});
  const [dates, setDates] = useState([]);
  const [showFilter, setShowFilters] = useState(false);
  // This is used for the alert message after 5 checkIns have been submitted
  const [pushedSelfAvg, setPushedSelfAvg] = useState(0);
  const [dr_filter, setDrFilter] = useState('week');
  

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        // Wait for the checkIns to load, then populate the state
        const result = await loadCheckIns();
        await getDates(result.checkIns);
        setCheckIns(result.checkIns);
        setMindAvg(result.averages.mind);
        setBodyAvg(result.averages.body);
        setSocialAvg(result.averages.social);
        setMindfulAvg(result.averages.mindful);
        setMeTimeAvg(result.averages.meTime);
        setLessOneAvg(result.averages.lessOne);
        setLessTwoAvg(result.averages.lessTwo);
        setPushedSelfAvg(result.averages.pushedSelf);
        setFlags(result.flags);
      } catch(e) {
        onError(e);
      }
      setIsLoading(false);
    }
    function getDates(checks){
      let addDates = [];
      for(let i = 0; i < checks.length; i++){
        addDates.push(formatDate(checks[i].dateCreated));
      }
      setDates(addDates);
    }
    onLoad();
  }, [isAuthenticated]);

  function loadCheckIns(){
    // This is the API call used to load the list of checkIns and their averages
    return API.get("stable-2", "/checkin/list");
  }

  function formatDate(date){
    const newDate = new Date(date).toLocaleString("en-US", { timeZone: 'EST'});
    const dateArr = newDate.split('/');
    const year = dateArr[2].substr(0,4);
    const month = dateArr[0];
    const day = dateArr[1];
    return (month + "/" + day + "/" + year);
  }

  function setFilterBy(range){
    const today = new Date();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    let year = today.getFullYear();
    const end = {
      'month': month,
      'date': date,
      'year': year
    };
    if(range === 'month'){
      month = month - 1;
    } else if (range === 'week'){
      date = date - 7;
    } else if (range === 'year'){
      year = year - 1;
    } else if (range === 'alltime'){
      year = 0;
    }
    return {
        'start': {
          'month': month,
          'date': date,
          'year': year
        },
        'end': end
    }
  }

  function renderCheckInList(checkIns){
    // Sort by date (most recent checkIns on the bottom)
    checkIns = checkIns.filter(function (ci) {
      const dateCreated = new Date(ci.dateCreated);
      const month = dateCreated.getMonth() + 1;
      const date = dateCreated.getDate();
      const year = dateCreated.getFullYear();
      const filter = setFilterBy(dr_filter);
      if(year < filter.start.year || year > filter.end.year){
        return false;
      }
      if(year > filter.start.year && year <= filter.end.year){
        return true;
      }
      if(month < filter.end.month && month > filter.start.month){
        return true;
      }
      if(month > filter.start.month && month === filter.end.month){
        if(date <= filter.end.date){
          return true;
        }
      }
      if(month === filter.start.month && date >= filter.start.date){
        return true;
      }
      if(month < filter.start.month || month > filter.end.month){
        return false;
      }
      if(date < filter.end.date && date > filter.start.date){
        return true;
      }
      if(date < filter.start.date || date > filter.end.date){
        return false;
      }
      return true;
    });
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
                <th>Trophy</th>
              </tr>
            </thead>
            <tbody>
              {checkIns.map(({ checkInId, mindBool, bodyBool, socialBool, mindfulBool, meTimeBool, lessOneBool, lessTwoBool, pushedSelfBool, dateCreated}) => (
                  <tr key={checkInId}>
                    <td><a href={`/checkin/${checkInId}`}>{formatDate(dateCreated)}</a></td>
                    <td style={{backgroundColor: (mindAvg > 0.5) ? '#D1F2EB' : '#FAE5D3' }}>{mindBool ? CheckMark() : XMark()}</td>
                    <td style={{backgroundColor: (bodyAvg > 0.3) ? '#D1F2EB' : '#FAE5D3' }}>{bodyBool ? CheckMark() : XMark()}</td>
                    <td style={{backgroundColor: (socialAvg > 0.3) ? '#D1F2EB' : '#FAE5D3' }}>{socialBool ? CheckMark() : XMark()}</td>
                    <td style={{backgroundColor: (mindfulAvg > 0.5) ? '#D1F2EB' : '#FAE5D3' }}>{mindfulBool ? CheckMark() : XMark()}</td>
                    <td style={{backgroundColor: (meTimeAvg > 0.5) ? '#D1F2EB' : '#FAE5D3' }}>{meTimeBool ? CheckMark() : XMark()}</td>
                    <td>{pushedSelfBool ? TrophySymbol() : "-"}</td>
                  </tr>
              ))}
            </tbody>
          </Table>
          <HomeCheckInForm 
            dateList={dates}
          />
      </>
    );
  }

  function renderAlert() {
    // The logic for generating the alert messages
    if (checkIns.length >= 5){
      return (<p className='custom-alert'>You've gotten trophies on {Math.round(pushedSelfAvg*100*100) / 100}% of recorded days.</p>);
    }
  }

  function renderChart() {
    // The pie chart a.k.a balance profile
    return(
      <>
      <Chart
        width={'300px'}
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
          ['Gaming', lessOneAvg],
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

  function newCheckIn() {
    history.push("/checkin/new");
  }

  function renderCheckInButtonSingle() {
    // Had to be created due to the case when there are 0 checkIns
    return(
      <span className='check-in-row'>
        <Button variant='success' onClick={newCheckIn}>
          Record Daily Check-In
        </Button>
        <p className='custom-alert'>Remember to record your check-in at the end of the day today!</p>
      </span>
    )
  }

  function renderCheckInButton() {
    // Renders a disabled button if a check-in has been recorded today, else it is clickable
    const mostRecentCheckInIndex = checkIns.length - 1;
    // Since the below line is null in case of 0 checkIns, renderCheckInButtonSingle had to be created
    if (formatDate(checkIns[mostRecentCheckInIndex].dateCreated) === formatDate(Date.now())){
      return(
        <span className='check-in-row'>
          <Button variant='success-outline' size='sm' disabled>
            Record Daily Check-In
          </Button>
          <p className='custom-alert'>Good work! You've already recorded your check-in today. Click the date to edit / delete it.</p>
        </span>
      )
    } else {
      return(
        <span className='check-in-row'>
          <Button variant='success' size='sm' onClick={newCheckIn}>
            Record Daily Check-In
          </Button>
          <p className='custom-alert'>Remember to record your check-in at the end of the day today!</p>
        </span>
      )
    }
  }

  function renderCoach() {
    return(
      <Coach 
        flags={flags}
        length={checkIns.length}
      />
    )
  }

  function showFilters(){
    if(showFilter){
      return(
        <span className='filters'>
          <h4>Currently showing the last {dr_filter} of entries.</h4>
          <Button variant={(dr_filter === 'week') ? 'info' : 'secondary'} onClick={() => setDrFilter('week')}>1 Week</Button>
          <Button variant={(dr_filter === 'month') ? 'info' : 'secondary'} onClick={() => setDrFilter('month')}>1 Month</Button>
          <Button variant={(dr_filter === 'year') ? 'info' : 'secondary'} onClick={() => setDrFilter('year')}>1 Year</Button>
          <Button variant={(dr_filter === 'alltime') ? 'info' : 'secondary'} onClick={() => setDrFilter('alltime')}>All Time</Button>
        </span>
      )
    } else {
      return(
        <></>
      )
    }
  }

  function renderCheckIns() {
    if(checkIns.length > 0){
      // Return the list of checkIns if there are at least 1
      return (
        <div className='checkIns'>
          {renderCoach()}
          {renderCheckInButton()}
          <HomeContentPortal />
          <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Balance History <Button onClick={() => setShowFilters(!showFilter)}>Filter</Button></h2>
          {showFilters()}
          <ListGroup>{!isLoading && renderCheckInList(checkIns)}</ListGroup>
          <>{!isLoading && renderChart()}</>
        </div>
      )
    } else if (isLoading){
      return (
        <h2>Loading...</h2>
      )
    } else {
      // Return a message to prompt the user to submit their first checkIn if they haven't made any submissions yet
      return (
        <div className='checkIns'>
          {renderCheckInButtonSingle()}
          <br/>
          <h2>Looks like you haven't used this before.</h2>
          <br/>
          <h5>Click 'Record Daily Check-In' at the end of the day today to log your first check-in and get started.</h5>
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