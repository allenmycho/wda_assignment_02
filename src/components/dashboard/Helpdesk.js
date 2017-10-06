import React, { Component } from 'react';
import { apiurl } from '../../helpers/constants';
import { Table, Row, Col, Jumbotron, Button } from 'react-bootstrap';
import firebase from 'firebase';

class Helpdesk extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tickets: [],
            selectedTicket: null,
            techUsers: [],
            selectedTech: null,
            priority: '1',
            escLevel: 'low'
        };

        // this.handlePriority = this.handlePriority.bind(this);
        // this.handleEscLevel = this.handleEscLevel.bind(this);
    }

    /* Once component has mounted, fetch from API + firebase */
    componentDidMount() {

        this.fetchTicketList()
    }

    /* Toggle the ticket dialog */
    ticketDetailsClick = (ticket) => {
        const { selectedTicket } = this.state;
        this.setState({
            selectedTicket: (selectedTicket !== null && selectedTicket.id === ticket.id ? null : ticket)
        });
    }

    /* Close button for dialog */
    closeDialogClick = () => {
        this.setState({
            selectedTicket: null
        })
    }

    /* Update the selected tech from dropdown box */
    handleTechChange = (e) => {
        this.setState({
            selectedTech: e.target.value
        });
    }

    handlePriority = (e) => {
        this.setState({
            priority: e.target.value
        });
    }

    handleEscLevel = (e) => {
        this.setState({
            escLevel: e.target.value
        });
    }

    fetchTicketList() {
        /* Fetch all tickets and check which tickets have
           an assigned tech
        */
        fetch(apiurl + 'api/tickets')
            .then((response) => response.json())
            .then((responseJson) => {
                const pendingTickets = [];
                for(const ele in responseJson) {
                    firebase.database().ref('ticket/'+responseJson[ele].id).on('value', (snapshot) => {
                        if(snapshot.val() === null) {
                            pendingTickets.push(responseJson[ele]);
                            /* Force the view to re-render (async problem) */
                            this.forceUpdate();
                        }
                    })
                }
                return pendingTickets;
            })
            .then((tickets) => {
                this.setState({
                    tickets: tickets
                });
            })

        /* Creates a firebase listener which will automatically
            update the list of tech users every time a new tech
            registers into the system
         */
        const users = firebase.database().ref('user/')
        users.on('value', (snapshot) => {
            const tempTech = [];
            for(const ele in snapshot.val()) {
                if(snapshot.val()[ele].type === 'tech') {
                    tempTech.push(snapshot.val()[ele]);
                }
            }
            this.setState({
                techUsers: tempTech
            });
        })
    }

    fetchPriority() {
        
        fetch(apiurl + 'api/tickets/'+ this.state.selectedTicket.id + '/priority', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({
                priority : this.state.priority
            })
        });
    }

    fetchEscLevel() {
        fetch(apiurl + 'api/tickets/'+ this.state.selectedTicket.id + '/esclevel', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({
                escLevel : this.state.escLevel
            })
        });
    }

    /* Click assign button */
    assignTicketToTech = () => {
        if(this.state.selectedTech === null) {
            return;
        }

        /* Add assigned ticket+tech into database*/
        const data = {};
        data['ticket/' + this.state.selectedTicket.id] = {
            ticket_id: this.state.selectedTicket.id,
            user_id: this.state.selectedTech, // stored Tech ID
        };
        firebase.database().ref().update(data)
        this.fetchPriority();
        this.fetchEscLevel();
        alert('Tech successfully assigned to ticket!');

        this.setState({
            selectedTicket: null
        })

        this.fetchTicketList();

    }

    /* Render the page! */
    /* TODO : Complete in your own time:
        Do you think you could split this page into separate sub-components?
     */
    render () {
        const vm = this;
        const { selectedTicket, tickets, techUsers } = this.state;

        return (
            <div>
                <Row>
                    <Col md={(selectedTicket !== null ? 7 : 12)}>
                        <h1>Pending Tickets</h1>
                        {tickets.length < 1 && (
                            <p className="alert alert-info">There are no tickets to display.</p>
                        )}
                        <Table striped hover>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>OS</th>
                                <th>Issue</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Esc Level</th>
                                <th>Comments</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tickets.map((ticket, i) => (
                                <tr key={i}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.os}</td>
                                    <td>{ticket.issue}</td>
                                    <td>{ticket.status}</td>
                                    <td>{ticket.priority}</td>
                                    <td>{ticket.escLevel}</td>
                                    <td>
                                        {ticket.comments.map((comment, i) => (
                                            <p key={i}>{comment.comment}</p>
                                        ))}
                                    </td>
                                    <td>
                                        <Button bsStyle={vm.state.selectedTicket !== null && vm.state.selectedTicket.id === ticket.id ? 'success' : 'info'} onClick={() => vm.ticketDetailsClick(ticket)}>More Details</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Col>
                    {selectedTicket !== null && (
                        <Col md={5}>
                            <Jumbotron style={{padding: 10}}>
                                <Button block bsStyle="danger" onClick={this.closeDialogClick}>Close Dialog</Button>
                                <h3 className="text-uppercase">Ticket Details</h3>
                                <p><b>ID: </b>{selectedTicket.id}</p>
                                <p><b>OS: </b><br/>{selectedTicket.os}</p>
                                <p><b>ISSUE: </b><br/>{selectedTicket.issue}</p>
                                <p><b>STATUS: </b><br/>{selectedTicket.status}</p>
                                <p><b>PRIORITY: </b><br/>{selectedTicket.priority}</p>
                                <p><b>ESC LEVEL: </b><br/>{selectedTicket.escLevel}</p>
                                <p>
                                    <b>COMMENT: </b><br/>
                                    {selectedTicket.comments.map((comment, i) => (
                                        <span key={i}>{comment.comment}</span>
                                    ))}
                                </p>
                                {techUsers.length > 0 && (
                                    <div>
                                        <hr/>

                                        <h3 className="text-uppercase">Select Priority</h3>
                                        <select id="priority" className="form-control" value={this.state.priority} onChange={this.handlePriority}>
                                            {/*<option value="-1" defaultValue disabled>Select the Priority</option>*/}
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                        </select>

                                        <h3 className="text-uppercase">Select EscLevel</h3>
                                        <select id="escLevel" className="form-control" value={this.state.escLevel} onChange={this.handleEscLevel}>
                                            {/*<option value="-1" defaultValue disabled>Select the EscLevel</option>*/}
                                            <option value="Low">Low</option>
                                            <option value="Moderate">Moderate</option>
                                            <option value="High">High</option>
                                        </select>

                                        <h3 className="text-uppercase">Assign to tech</h3>
                                        <select className="form-control" onChange={this.handleTechChange} defaultValue="-1">
                                            <option value="-1" defaultValue disabled>Select a tech user</option>
                                            {techUsers.map((user, i) => (
                                                <option key={i} value={user.id}>{user.name}</option>
                                            ))}
                                        </select>

                                        <div className="clearfix"><br/>
                                            <Button className="pull-right" bsStyle="success" onClick={this.assignTicketToTech}>Assign</Button>
                                        </div>
                                    </div>
                                )}
                            </Jumbotron>
                        </Col>
                    )}
                </Row>
            </div>
        );
    }
}

export default Helpdesk;