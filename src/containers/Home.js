import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import Table from 'react-bootstrap/Table';
import { useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { CheckMark, XMark, TrophySymbol } from "../components/Icons";
import Chart from "react-google-charts";
import Coach from "../components/Coach";
import HomeCheckInForm from "../components/HomeCheckInForm";
import HomeContentPortal from "../components/HomeContentPortal";

import {loadCheckIns} from "../libs/apiLib";
import {formatDate, setFilterBy, filterCheckIns} from "../libs/dateLib";

import "./Home.css";

export default function Home() {
  const history = useHistory();
  const [checkIns, setCheckIns] = useState([]);
  const {isAuthenticated} = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [mindAvg, setMindAvg] = useState(0.0);
  const [bodyAvg, setBodyAvg] = useState(0);
  const [socialAvg, setSocialAvg] = useState(0);
  const [mindfulAvg, setMindfulAvg] = useState(0);
  const [meTimeAvg, setMeTimeAvg] = useState(0);
  const [flags, setFlags] = useState({});
  const [dates, setDates] = useState([]);
  const [showFilter, setShowFilters] = useState(false);
  const [pushedSelfAvg, setPushedSelfAvg] = useState(0);
  const [dr_filter, setDrFilter] = useState('week');
  
/********************************
the useEffect method handles all loading requirements
   * It loads checkIns via a call to /checkin/list
   * It ensures the user is logged in
   * It sets the state for all parameters (like averages, checkIns, flags, dates)
********************************/
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

/********************************
the renderLander method will render the main logo (shown if the user is not logged in)
********************************/  
  function renderLander() {
    return (
        <div className="lander">
          <h1>Stable</h1>
          <p className="text-muted">Find Your Balance</p>
        </div>
    );
  }

/********************************
the renderCheckIns method is the controller for what is shown on the page
   * If the checkIns have loaded and there is at least one, it renders the checkInList
   * If the checkIns haven't loaded yet, it renders the loading screen
   * If the checkIns have loaded, but there aren't any, it renders the 'new user' screen
********************************/
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

/********************************
the renderCheckInList method is the MAIN RENDERER for the checkIn list
   * It filters the checkIns by the requested timeframe
   * It builds and renders the table of checkIns (the Balance History)
********************************/
  function renderCheckInList(checkIns){
    // Get the filter object
    const filter = setFilterBy(dr_filter);
    // Filter out all checkIns that don't fall into the range (inclusive) of the filter object
    checkIns = checkIns.filter(function (ci){
      return filterCheckIns(ci, filter);
    });
    // Sort the checkIns by date (ascending)
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
              {checkIns.map(({ checkInId, mindBool, bodyBool, socialBool, mindfulBool, meTimeBool, pushedSelfBool, dateCreated}) => (
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

/********************************
the renderCheckInButtonSingle method is used when there are 0 checkIns
when clicked, it takes the user to the new checkin page
********************************/ 
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

/********************************
the renderCheckInButtonSingle method is used when there are at least 1 checkIn
   * It ensures that no checkIn has been recorded on this day, if so, it disables the button
********************************/ 
  function renderCheckInButton() {
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

/********************************
the showFilters method is used to set the filter type
********************************/ 
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

/********************************
the newCheckIn method is used to navigate the user to the page to create a new checkIn
********************************/
  function newCheckIn() {
    history.push("/checkin/new");
  }

/********************************
the renderCoach method is used to render the coach object
********************************/
  function renderCoach() {
    return(
      <Coach 
        flags={flags}
        length={checkIns.length}
      />
    )
  }

/********************************
the renderAlert method is used to render an alert specifying how many days the user has gotten a trophy
********************************/
  function renderAlert() {
    // The logic for generating the alert messages
    if (checkIns.length >= 5){
      return (<p className='custom-alert'>You've gotten trophies on {Math.round(pushedSelfAvg*100*100) / 100}% of recorded days.</p>);
    }
  }

/********************************
the renderChart method is used to render a google pie chart based on the averages for each category. It also calls renderAlert()
********************************/  
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

// THE RETURN
  return (
    <div className="Home">
      {isAuthenticated ? renderCheckIns() : renderLander()}
    </div>
  );
}