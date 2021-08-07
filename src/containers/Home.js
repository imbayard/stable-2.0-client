import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import Table from 'react-bootstrap/Table';
//import LoaderButton from "../components/LoaderButton";
import Chart from "react-google-charts";
import { FaCheckCircle, FaTimesCircle, FaTrophy } from "react-icons/fa";

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
  //const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const result = await loadCheckIns();
        setCheckIns(result.checkIns);
        setMindAvg(result.averages.mind);
        console.log(result.averages.mind);
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

  // function deleteCheckIn(id){
  //   return API.del("stable-2", `/checkin/delete/${id}`);
  // }

  // async function promptDelete(checkInId){
  //   const confirmed = window.confirm("Are you sure you want to delete this?");

  //   if(!confirmed){return;}
  //   else{
  //     setIsDeleting(true);
  //   }

  //   try {
  //     await deleteCheckIn(checkInId);
  //     setIsDeleting(false);
  //   } catch (e) {
  //     onError(e);
  //     setIsDeleting(false);
  //   }

  // }

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
                    <td>{new Date(dateCreated).toLocaleString("en-US", { timeZone: 'EST'})}</td>
                    <td>{mindBool ? <FaCheckCircle/> : <FaTimesCircle />}</td>
                    <td>{bodyBool ? <FaCheckCircle/> : <FaTimesCircle />}</td>
                    <td>{socialBool ? <FaCheckCircle/> : <FaTimesCircle />}</td>
                    <td>{mindfulBool ? <FaCheckCircle/> : <FaTimesCircle />}</td>
                    <td>{meTimeBool ? <FaCheckCircle/> : <FaTimesCircle />}</td>
                    <td>{lessOneBool ? <FaCheckCircle/> : <FaTimesCircle />}</td>
                    <td>{lessTwoBool ? <FaCheckCircle/> : <FaTimesCircle />}</td>
                    <td>{pushedSelfBool ? <FaTrophy/> : <FaTimesCircle />}</td>
                  </tr>
              ))}
            </tbody>
          </Table>
      </>
    );
  }

  function renderChart() {
    return(
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
    return (
      <div className='checkIns'>
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Balance History</h2>
        <ListGroup>{!isLoading && renderCheckInList(checkIns)}</ListGroup>
        <>{!isLoading && renderChart()}</>
      </div>
    )
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderCheckIns() : renderLander()}
    </div>
  );
}