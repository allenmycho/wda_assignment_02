import React, { Component } from 'react';
import { apiurl } from "../../helpers/constants";
import firebase from 'firebase';
import { Panel } from 'react-bootstrap';

class Tech extends Component {
    state = {
        tickets: []
    }

    componentDidMount() {
        /* Fetch all tickets and check which tickets have
            been assigned to this tech user
         */
        fetch(apiurl + '/api/tickets')
            .then((response) => response.json())
            .then((responseJson) => {
                const myTickets = [];
                for(const ele in responseJson) {
                    firebase.database().ref('ticket/'+responseJson[ele].id).on('value', (snapshot) => {
                        if(snapshot.val() !== null && snapshot.val().user_id === this.props.user.uid) {
                            myTickets.push(responseJson[ele]);
                            // console.log(responseJson);
                            /* Force the view to re-render (async problem) */
                            this.forceUpdate();
                        }
                    })
                }
                return myTickets;
            })
            .then((tickets) => {
                this.setState({
                    tickets: tickets
                });
            })
    }

    render () {
        const { tickets } = this.state;
        return (
            <div>
                <h1>My Tickets</h1>
                {tickets.length < 1 ? (
                    <div className="alert alert-info">You have not been assigned any tickets.</div>
                )
                : tickets.map((ticket, i) => (
                    <Panel key={i} header={ticket.id}>
                        <p>OS : {ticket.os}</p>
                        <p>ISSUE : {ticket.issue}</p>
                        <p>STATUS : {ticket.status}</p>
                        <p>COMMENTS :
                            {ticket.comments.map((comment, i) => (
                                <div>{comment.comment}</div>
                            ))}
                        </p>



                    </Panel>
                ))}
            </div>
        );
    }
}

export default Tech;