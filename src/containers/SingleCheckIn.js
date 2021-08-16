import React, { useState, useEffect } from "react";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import Table from 'react-bootstrap/Table';
import LoaderButton from "../components/LoaderButton";
import { CheckMark, XMark, TrophySymbol } from "../components/Icons";
import { useParams, useHistory } from "react-router-dom";

export default function SingleCheckIn() {
  // This page will render a single checkIn and allow for deletion
  // TODO: Add functionality to edit the checkIn
    
    const [checkIn, setCheckIn] = useState([]); // This is the checkIn that will be displayed
    const {isAuthenticated} = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams(); // The id from the URI
    const history = useHistory();
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        function loadCheckIn(){
          // The API call to get a single checkIn
          return API.get("stable-2", `/checkin/${id}`);
        }
        async function onLoad() {
          if (!isAuthenticated) {
            return;
          }
    
          try {
            // Wait for the checkIn to load
            const result = await loadCheckIn();
            setCheckIn(result);
          } catch(e) {
            onError(e);
          }
          setIsLoading(false);
        }
    
        onLoad();
    }, [isAuthenticated, id]);

    function deleteCheckIn(id){
        // The API call to delete a checkIn based on its ID
        return API.del("stable-2", `/checkin/delete/${id}`);
    }

    async function promptDelete(){
        const confirmed = window.confirm("Are you sure you want to delete this?");

        if(!confirmed){
          return;
        }
        else{
          setIsDeleting(true);

          try {
            await deleteCheckIn(id);
            history.push("/"); // Force the user back to the homepage after deletion
          } catch (e) {
            onError(e);
            setIsDeleting(false);
          }
        }
    }
    
    function renderCheckIn(){
        return(
            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Mind</th>
                    <th>Body</th>
                    <th>Social</th>
                    <th>Mindful</th>
                    <th>Me Time</th>
                    <th>Gaming</th>
                    <th>Poor Eating</th>
                    <th>Trophy</th>
                  </tr>
                </thead>
                <tbody>
                      <tr key={id}>
                        <td>{new Date(checkIn.dateCreated).toLocaleString("en-US", { timeZone: 'EST'})}</td>
                        <td>{checkIn.mindBool ? CheckMark() : XMark()}</td>
                        <td>{checkIn.bodyBool ? CheckMark() : XMark()}</td>
                        <td>{checkIn.socialBool ? CheckMark() : XMark()}</td>
                        <td>{checkIn.mindfulBool ? CheckMark() : XMark()}</td>
                        <td>{checkIn.meTimeBool ? CheckMark() : XMark()}</td>
                        <td>{checkIn.lessOneBool ? CheckMark() : XMark()}</td>
                        <td>{checkIn.lessTwoBool ? CheckMark() : XMark()}</td>
                        <td>{checkIn.pushedSelfBool ? TrophySymbol() : "-"}</td>
                      </tr>
                </tbody>
              </Table>
              <p><strong>Notes: </strong>{checkIn.notes}</p>
              <LoaderButton 
                variant="danger"
                onClick={promptDelete}
                isLoading={isDeleting}
              >
                  Delete
              </LoaderButton>
            </div>
        );
    }

    function renderLander() {
        return (
            <div className="lander">
              <h1>Stable</h1>
              <p className="text-muted">Find Your Balance</p>
              <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="Home">
          {/* The page is authenticated based on its route, so we only need to check if it's loading or not */}
          {/* Once it finishes loading, we will render the checkIn */}
          {(!isLoading) ? renderCheckIn() : renderLander()}
        </div>
      );
}