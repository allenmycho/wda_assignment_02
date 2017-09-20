import React, { Component } from 'react';
import './App.css';
import logo from './logo.svg';


// Material UI Components
import {
    MuiThemeProvider,
    RaisedButton,
    AppBar,
    Snackbar,
    Dialog,
    FlatButton,
    CircularProgress,
    IconButton,
    IconMenu,
    MenuItem,
    Checkbox,
    Drawer,
} from 'material-ui';

// Theme
import {deepOrange500}  from 'material-ui/styles/colors';
import getMuiTheme      from 'material-ui/styles/getMuiTheme';

// Icons
import MoreVertIcon           from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose        from 'material-ui/svg-icons/navigation/close';
import ActionFavorite         from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder   from 'material-ui/svg-icons/action/favorite-border';

// Adds onTouchTap property to components
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

// The muiTheme we apply to MuiThemeProvider
const muiTheme = getMuiTheme({
    palette: {
        accent1Color: deepOrange500,
    },
});

class NavBar extends Component {
    constructor(props, context) {
        super(props, context);

        // "open" state keeps track of our Dialog box
        // changing the state to open will show the modal
        // changing it to close will close the modal

        // this is achieved through setting the Dialog open property to our state via <Dialog open={this.state.open}>
        // then handleRequestClose() or handleRequestOpen() can be called to change the state
        this.state = {
            drawerOpen: false,
            open: false,
        };
    }

    handleToggle = () => this.setState({drawerOpen: !this.state.drawerOpen});


    handleRequestClose() {
        this.setState({
            open: false,
        });
    }

    handleRequestOpen() {
        this.setState({
            open: true,
        });
    }

    render() {

        const name = this.props.greetTarget;

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <AppBar title="ITS Ticket Manager"
                            // iconElementLeft={
                            //     <IconButton><MoreVertIcon /></IconButton>
                            // }
                            iconElementRight={
                                <IconMenu
                                    iconButtonElement={
                                        <IconButton><MoreVertIcon /></IconButton>
                                    }
                                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                >
                                    <MenuItem primaryText="Refresh" />
                                    <MenuItem primaryText="Help" />
                                    <MenuItem primaryText="Sign out" />
                                </IconMenu>
                            }/>

                    <RaisedButton
                        label="Toggle Drawer"
                        onClick={this.handleToggle}
                    />
                    <Drawer width={200} openSecondary={true} open={this.state.drawerOpen} >
                        <AppBar title="AppBar" />
                    </Drawer>





                    <Dialog
                        open={this.state.open}
                        title="Super Secret Password"
                        actions={
                            <FlatButton
                                label="Ok"
                                primary={true}
                                onTouchTap={() => this.handleRequestClose()}
                            />
                        }

                        // When you tap outside the modal
                        onRequestClose={() => this.handleRequestClose()}
                    >
                        1-2-3-4-5
                    </Dialog>

                    <h1>Flat Button Example</h1>
                    <FlatButton label="Open Menu" onTouchTap={() => this.handleRequestOpen()} />
                    <FlatButton label="Primary" primary={true} />
                    <FlatButton label="Secondary" secondary={true} />
                    <FlatButton label="Disabled" disabled={true} />

                    <h1>Raised Button</h1>
                    <div>
                        <RaisedButton label="Default"/>
                        <RaisedButton label="Primary" primary={true}  />
                        <RaisedButton label="Secondary" secondary={true} />
                        <RaisedButton label="Disabled" disabled={true}  />
                        <br />
                        <br />
                        <RaisedButton label="Full width" fullWidth={true} />
                    </div>

                    <h1>Circular Progress Example</h1><div>
                    <CircularProgress />
                    <CircularProgress size={1.5} />
                    <CircularProgress size={2} />

                </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default NavBar;
