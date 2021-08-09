import React, { useState, useEffect } from "react";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import Table from 'react-bootstrap/Table';
import LoaderButton from "../components/LoaderButton";
import { CheckMark, XMark, TrophySymbol } from "../components/Icons";
import { useParams, useHistory } from "react-router-dom";

export default function SingleCheckIn() {
    
    const [checkIn, setCheckIn] = useState([]);
    const {isAuthenticated} = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const history = useHistory();
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        function loadCheckIn(){
          return API.get("stable-2", `/checkin/${id}`);
        }
        async function onLoad() {
          if (!isAuthenticated) {
            return;
          }
    
          try {
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
            history.push("/");
            setIsDeleting(false);
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
                    <th>Weed</th>
                    <th>Poor Eating</th>
                    <th>Pushed Self</th>
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
          {(!isLoading) ? renderCheckIn() : renderLander()}
        </div>
      );
}