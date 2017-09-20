import React, { Component } from 'react';

class ApiCRUD extends Component {

    render() {

        const tickets = this.props.tickets;
        const select = this.props.selectAction;
        const deleteAction = this.props.deleteAction;

        return (
            <table><tbody>
            <tr><th>ID</th><th>OS</th><th>ISSUE</th><th>STATUS</th></tr>
            {tickets.map( function(ticket, i) {
                return (
                    <tr key={i}>
                        <td>{ticket.id}</td>
                        <td>{ticket.os}</td>
                        <td>{ticket.issue}</td>
                        <td>{ticket.status}</td>
                        <td><button onClick={() => select(i)}>Update</button></td>
                        <td><button onClick={() => deleteAction(ticket.id)}>Delete</button></td>
                    </tr>
                )
            })}
            </tbody></table>
        )
    }

}

export default ApiCRUD;