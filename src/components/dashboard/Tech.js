import React, {Component} from 'react';
import { apiurl } from "../../helpers/constants";
import firebase from 'firebase';
import { Panel } from 'react-bootstrap';

//WYSIWYG Editor
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


//UI Button LIB
import { Button } from 'react-bootstrap';



class Tech extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tickets: [],
            textEditor: EditorState.createEmpty(),
            selectedTicket: 1,
            status: "",
            selectedHelpdesk: null,
            helpdeskUsers: [],
            ticket_details_id: null
        };
    };

    componentDidMount() {
        // Call this function when the page is loaded.
        this.fetchTicketToTech()
    }

    fetchTicketToTech() {
        /*
         * Fetch all tickets and check which tickets have
         * been assigned to this tech user
         */
        fetch(apiurl + 'api/tickets')
            .then((response) => response.json())
            .then((responseJson) => {
                const myTickets = [];
                for(const ele in responseJson) {
                    firebase.database().ref('ticket/'+responseJson[ele].id).on('value', (snapshot) => {
                        if(snapshot.val() !== null && snapshot.val().user_id === this.props.user.uid) {
                            myTickets.push(responseJson[ele]);
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

        const users = firebase.database().ref('user/')
        users.on('value', (snapshot) => {
            const tempHelp = [];
            for(const ele in snapshot.val()) {
                if(snapshot.val()[ele].type === 'helpdesk') {
                    tempHelp.push(snapshot.val()[ele]);
                }
            }
            this.setState({
                helpdeskUsers: tempHelp
            });
        })
    }


    // WYSIWYG Function
    onEditorStateChange: Function = (textEditor) => {
        this.setState({
          textEditor: textEditor
        });
    };


    // Check the if the status is changed.
    handleStatusChange = (e) => {
        this.setState({
            status: e.target.value
        });
    };

    // Select the id to add comments or change status
    handleIdChange = (e) => {
        this.setState({
            selectedTicket: e.target.value
        });
    }


    //Posting of comments that are styled to the dtabase

    fetchComment = () => {
        fetch(apiurl + 'api/tickets/'+ this.state.selectedTicket + '/comment', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: {
                ticket_details_id: this.state.selectedTicket.id,
                comment : this.state.textEditor
            }
        });
        //CONSOLE LOG THE OUTPUTS
        console.log("Ticket ID :"+ this.state.selectedTicket.id);
        console.log(this.state.textEditor);
    };



    // Change status after work
    // If the request is not solved, it will get back to the helpdesk again.
    fetchStatus = () => {
        fetch(apiurl + 'api/tickets/'+ this.state.selectedTicket + '/status', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({
                status : this.state.status
            })
        });

        // need draftToHtml text to use some text effect
        console.log("STATUS: "+ this.state.status);
        console.log("SELECTED TICKET: "+ this.state.selectedTicket);
    };

    // Select the helpdesk user if the ticket is not solved successfully.
    handleHelpdeskChange = (e) => {
        this.setState({
            selectedHelpdesk: e.target.value
        });
    }

    // Callback function when assign button is clicked.
    resolveTicket = () => {

        this.fetchStatus();
        this.fetchComment();

        if(this.state.selectedHelpdesk === null) {
            return;
        }
    }

    render () {
        
        const { tickets, helpdeskUsers } = this.state;
        const { textEditor } = this.state;

        return (
            <div>
                <h1>My Tickets</h1>
                {tickets.length < 1 ? (
                        <div className="alert alert-info">You have not been assigned any tickets.</div>
                    )
                    : tickets.map((ticket, i) => (
                        <Panel key={i} header={ticket.id}>
                            <p>OS: {ticket.os}</p>
                            <p>ISSUE: {ticket.issue}</p>
                            <p>STATUS: {ticket.status}</p>
                            <p>PRIORITY: {ticket.priority}</p>
                            <p>ESC LEVEL: {ticket.escLevel}</p>
                            <p>COMMENTS:
                                {ticket.comments.map((comment, i) => (
                                    <span key={i}>{i === 0 ? "User" : "Staff"}: {comment.comment}</span>
                                ))}
                            </p>


                        </Panel>
                    ))}
                <hr/>


                <h3 className="text-uppercase">Ticket ID</h3>
                {tickets.length < 1 ? (
                        <hr/>
                    ):
                    <select className="form-control" value={this.state.selectedTicket} onChange={this.handleIdChange}>
                        {/*<option value="default" defaultValue disabled>Select the Ticket ID</option>*/}
                        {tickets.map((ticket, i) => (
                            <option key={i} value={ticket.id}>{ticket.id}</option>
                        ))}
                    </select>
                }

                <h2>Add Comments</h2>
                <Editor
                  editorState={textEditor}
                  wrapperClassName="demo-wrapper"
                  editorClassName="demo-editor"
                  onEditorStateChange={this.onEditorStateChange}
                />
                <textarea
                  disabled
                  value={draftToHtml(convertToRaw(textEditor.getCurrentContent()))}
                />


                <h3 className="text-uppercase">Ticket Status</h3>
                <select className="form-control" value={this.state.status} onChange={this.handleStatusChange}>
                    {/*<option value="-1" defaultValue disabled>Select the Status</option>*/}
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Unresolved">Unresolved</option>
                    <option value="Resolved">Resolved</option>
                </select>

                <h3 className="text-uppercase">Assign to tech</h3>
                <select className="form-control" onChange={this.handleHelpdeskChange} defaultValue="-1">
                    <option value="-1" defaultValue disabled>Select a tech user</option>
                    {helpdeskUsers.map((user, i) => (
                        <option key={i} value={user.id}>{user.name}</option>
                    ))}
                </select>

                <div className="clearfix"><br/>
                    <Button className="pull-right" bsStyle="success" onClick={this.resolveTicket}>Assign</Button>
                </div>
            </div>
        );
    }
}

export default Tech;