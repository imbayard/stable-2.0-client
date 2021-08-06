import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import Table from 'react-bootstrap/Table';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import "./Home.css";

export default function Home() {

  const [checkIns, setCheckIns] = useState([]);
  const {isAuthenticated} = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const checkIns = await loadCheckIns();
        setCheckIns(checkIns);
        console.log(checkIns);
        setIsLoading(false);
      } catch(e) {
        onError(e);
        setIsLoading(false);
      }

    }

    onLoad();
  }, [isAuthenticated]);

  function loadCheckIns(){
    return API.get("stable-2", "/checkin/list");
  }

  function renderCheckInList(checkIns){
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
                    <td>{Date(dateCreated).toLocaleString("en-US", { timeZone: 'EST'})}</td>
                    <td>{mindBool ? <FaCheckCircle/> : <FaTimesCircle />}</td>
                    <td>{bodyBool ? <FaCheckCircle/> : <FaTimesCircle />}</td>
                    <td>{socialBool ? <FaCheckCircle/> : <FaTimesCircle />}</td>
                    <td>{mindfulBool ? <FaCheckCircle/> : <FaTimesCircle />}</td>
                    <td>{meTimeBool ? <FaCheckCircle/> : <FaTimesCircle />}</td>
                    <td>{lessOneBool ? <FaCheckCircle/> : <FaTimesCircle />}</td>
                    <td>{lessTwoBool ? <FaCheckCircle/> : <FaTimesCircle />}</td>
                    <td>{pushedSelfBool ? <FaCheckCircle/> : <FaTimesCircle />}</td>
                  </tr>
              ))}
            </tbody>
          </Table>
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
    return (
      <div className='checkIns'>
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Balance History</h2>
        <ListGroup>{!isLoading && renderCheckInList(checkIns)}</ListGroup>
      </div>
    )
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderCheckIns() : renderLander()}
    </div>
  );
}