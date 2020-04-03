import React from "react";
import {withRouter} from "react-router-dom"
import TopBar from "./TopBar.js"
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import "./mainstyle.css"
import mark from "./avatars/mark_avatar.jpg";
import {findUser} from "../actions/user";
import Divider from "@material-ui/core/Divider";
import MessagePanel from "./MessagePanel";

class ProfessorHome extends React.Component {
	classes = makeStyles(theme => ({
		root: {
			display: 'flex',
			'& > *': {
				margin: theme.spacing(1),
			},
		},
		small: {
			width: theme.spacing(3),
			height: theme.spacing(3),
		},
		large: {
			width: theme.spacing(7),
			height: theme.spacing(7),
		},
	}));

	constructor(props) {
		super(props);
		this.props.history.push("/professor");
		this.state = {currentUser: this.props.app.state.currentUser};
		findUser(this, this.props.app.state.currentUser.username);
	}


	render() {
		const prof = this.state.currentUser;

		return (
			<div>
				<TopBar history={this.props.history} app={this.props.app}/>
				<div className="main-area">
					<Avatar alt={prof.name} src={mark} className={this.classes.large}/>
					<h1>{prof.name ? prof.name : "Anonymous"}</h1>
					<h2>Email: <span className="text">{prof.email ? prof.email : "Undefined"}</span></h2>
					<h2>Instructing: <span
						className="text">{prof.groups.length > 0 ? prof.groups.join(", ") : "None"}</span></h2>
					<br/><Divider/><br/>
					<MessagePanel page={this} currentUser={prof}/>
				</div>
			</div>
		);
	}

}

export default withRouter(ProfessorHome);
