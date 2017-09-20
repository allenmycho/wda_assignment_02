import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ApiCRUD from "./subcomponents/ApiCRUD"

//API Url- Cloud9 users to change localhost to their Url
const apiURL = "http://localhost/wda_assignment_01/public/api/";

class ApiApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tickets: [],
            view: "tickets",
            selectedIndex: "",

            updateId: "",
            updateName: "",
            updateDetails: "",

            createName: "",
            createDetails: "",
        };

        this.getTickets = this.getTickets.bind(this);
        this.select = this.select.bind(this);

        this.submitCreate = this.submitCreate.bind(this);
        this.submitUpdate = this.submitUpdate.bind(this);
        this.submitDelete = this.submitDelete.bind(this);

        this.changeUpdateOS = this.changeUpdateOS.bind(this);
        this.changeUpdateIssue = this.changeUpdateIssue.bind(this);
        this.changeUpdateStatus = this.changeUpdateStatus.bind(this);
        this.changeUpdateId = this.changeUpdateId.bind(this);

        this.changeCreateOS = this.changeCreateOS.bind(this);
        this.changeCreateIssue = this.changeCreateIssue.bind(this);
        this.changeCreateStatus = this.changeCreateStatus.bind(this);
    }

    componentDidMount(){
        this.getTickets();
    }


    changeUpdateOS(event) {
        this.setState({updateOS: event.target.value});
    }
    changeUpdateIssue(event) {
        this.setState({updateIssue: event.target.value});
    }
    changeUpdateStatus(event) {
        this.setState({updateStatus: event.target.value});
    }
    changeUpdateId(event) {
        this.setState({updateId: event.target.value});
    }

    changeCreateOS(event) {
        this.setState({createOS: event.target.value});
    }
    changeCreateIssue(event) {
        this.setState({createIssue: event.target.value});
    }
    changeCreateStatus(event) {
        this.setState({createStatus: event.target.value});
    }

    select(i) {
        this.setState({view: "update"})
        this.setState({selectedIndex: i})
        this.setState({updateId: this.state.tickets[i].id})
        this.setState({updateOS: this.state.tickets[i].os})
        this.setState({updateIssue: this.state.tickets[i].issue})
        this.setState({updateStatus: this.state.tickets[i].status})
    }

    getTickets() {
        fetch(apiURL+"tickets")
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({tickets: responseJson});
                console.log("Downloaded new ticket list.")
            })
            .catch((error) => {
                console.error(error);
            });
    }

    submitUpdate() {
        var id = this.state.updateId;
        var os = this.state.updateOS;
        var issue = this.state.updateIssue;
        var status = this.state.updateStatus;

        fetch(apiURL+"/"+id+"/update", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                os: os,
                issue: issue,
                status: status,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === "SUCCESS") {
                    alert("Successfully updated tickets!")
                    this.getTickets();
                } else {
                    alert("Could not update ticket.")
                }
            })
            .then(this.setState({view: "tickets"}))
    }

    submitCreate() {
        var os = this.state.createOS;
        var issue = this.state.createIssue;
        var status = this.state.createStatus;

        fetch(apiURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                os: os,
                issue: issue,
                status: status,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === "SUCCESS") {
                    alert("Successfully created ticket!")
                    this.getTickets();
                } else {
                    alert("Could not create ticket.")
                }
            })
    }


    submitDelete(id) {
        var os = this.state.createOS;
        var issue = this.state.createIssue;
        var status = this.state.createStatus;

        fetch(apiURL+"/"+id+"/delete", {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === "SUCCESS") {
                    alert("Successfully deleted ticket!")
                    this.getProducts();
                } else {
                    alert("Could not delete ticket.")
                }
            })
            .then(this.setState({view: ""}))
    }

    render() {

        const select = this.select;

        const submitCreate = this.submitCreate;
        const submitUpdate = this.submitUpdate;
        const submitDelete = this.submitDelete;


        const changeUpdateOS = this.changeUpdateOS;
        const changeUpdateIssue = this.changeUpdateIssue;
        const changeUpdateStatus = this.changeUpdateStatus;
        const changeUpdateId = this.changeUpdateId;

        const changeCreateOS = this.changeCreateOS;
        const changeCreateIssue = this.changeCreateIssue;
        const changeCreateStatus = this.changeCreateStatus;


        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>React Fetch()</h2>
                </div>
                <p className="App-intro">
                    Make sure the fetch address and port matches your xamp server!
                </p>
                <center>

                    {this.state.view === "tickets" ?

                        <div>
                            <br/>
                            OS: &nbsp;<input value={this.state.createOS} onChange={changeCreateOS} />
                            <br />
                            <br />
                            Issue: <input value={this.state.createIssue} onChange={changeCreateIssue} />
                            <br />
                            <br />
                            Status: <input value={this.state.createStatus} onChange={changeCreateStatus} />
                            <br />
                            <br />
                            <button onClick={submitCreate}>Create New Ticket</button>

                            <br/>
                            <br/>
                            <ApiCRUD tickets={this.state.tickets} selectAction={select} deleteAction={submitDelete}/>

                        </div>

                        :null
                    }

                    {this.state.view === "update" ?
                        <div>
                            ID: <input value={this.state.updateId} disabled onChange={changeUpdateId} />
                            <br />
                            OS: <input value={this.state.updateOS} onChange={changeUpdateOS} />
                            <br />
                            Issue: <input value={this.state.updateIssue} onChange={changeUpdateIssue} />
                            <br />
                            Status: <input value={this.state.updateStatus} onChange={changeUpdateStatus} />
                            <br />
                            <button onClick={submitUpdate}>Submit Changes</button>
                        </div>
                        :null
                    }

                </center>

            </div>
        );
    }
}

export default ApiApp;
