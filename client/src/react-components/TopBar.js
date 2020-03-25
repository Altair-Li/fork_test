import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider'

import {withRouter} from "react-router-dom"
import {readCookie, logout} from "../actions/user";

const studentNav = ['Home', 'Groups', 'Practice', 'Log Out'];
const profNav = ['Home', 'Make Quiz', 'Groups', 'Log Out'];

class TopBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
		};
		readCookie(this);
	}

	openDrawer = () => {
		this.setState({isOpen: true});
	};

	navigate = (text) => {
		let destPath = "/";
		const type = this.state.currentUser.type;

		switch (text) {
			case "Home":
				if (type === "student") {
					destPath = "/student"
				} else if (type === "professor") {
					destPath = "/professor"
				} else {
					console.log("ERROR type invalid");
					destPath = '/';
				}
				break;

			case "Groups":
				if (type === "professor") {
					destPath = "/professor/groups"
				} else if (type === "student") {
					destPath = "/student/groups"
				} else {
					console.log("ERROR type invalid");
					destPath = '/';
				}
				break;

			case "Practice":
				destPath = "/student/gen";
				break;

			case "Make Quiz":
				destPath = "/professor/quiz";
				break;

			case "Logout":
				logout();
				destPath = "/login";
				break;
		}

		this.props.history.push({
			pathname: destPath
		})
	};

	closeDrawer = () => {
		this.setState({isOpen: false});
	};

	render() {
		return (
			<div>
				<AppBar position="static">
					<Toolbar>
						<IconButton edge="start" onClick={this.openDrawer} color="inherit" aria-label="menu">
							<MenuIcon/>
						</IconButton>
						<h3>Phonogenesis</h3>
					</Toolbar>
				</AppBar>

				<Drawer variant="persistent" anchor="left" open={this.state.isOpen}>
					<IconButton onClick={this.closeDrawer}>
						<ChevronRightIcon/>
					</IconButton>
					<Divider/>
					<List>
						{(this.props.type === "student" ? studentNav : (this.props.type === "professor" ? profNav : ["Log Out"])).map((text) => (
							<ListItem button onClick={() => this.navigate(text)} key={text}>
								<ListItemText primary={text}/>
							</ListItem>
						))}
					</List>
				</Drawer>
			</div>
		)
	}
}

export default withRouter(TopBar);
