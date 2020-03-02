import React from "react";
import {Redirect} from "react-router-dom"
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AccountCircle from '@material-ui/icons/AccountCircle';
import Grid from '@material-ui/core/Grid';

import "./LoginPage.css";

/* Component for the Home page */
class LoginPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			redirect: null,
			err: false,
			user: null
		};
	}

	login = e => {
		const filtered_user = this.props.users.filter(user => user.username === this.state.username);
		if (filtered_user.length === 1) {
			if (filtered_user[0].password === this.state.password) {
				this.setState({
					user: {
						type: filtered_user[0].type,
						name: filtered_user[0].name,
						email: filtered_user[0].email,
						username: filtered_user[0].username,
						password: filtered_user[0].password
					}
				});
				this.setState({redirect: "/" + filtered_user[0].type});
			} else {
				this.setState({err: true})
			}
		} else if (filtered_user.length === 0) {
			this.setState({err: true})
		}

		e.preventDefault();
	};

	handleTextFieldChange = e => {
		this.setState({
			[e.target.id]: e.target.value
		});
	};

	render() {
		if (this.state.redirect) {
			return <Redirect to={{
				pathname: this.state.redirect,
				user: this.state.user
			}}/>
		}

		return (
			<div className="loginForm">
				<Grid container spacing={1} alignItems="flex-end">
					<Grid item>
						<AccountCircle/>
					</Grid>
					<Grid item>
						<TextField
							id="username"
							label="Username"
							onChange={this.handleTextFieldChange}
							error={this.state.err}
							helperText={this.state.err ? "Incorrect username or password" : ''}
						/>
					</Grid>
				</Grid>

				<div className="passwordForm">
					<TextField
						id="password"
						label="Password"
						onChange={this.handleTextFieldChange}
						error={this.state.err}
						helperText={this.state.err ? "Incorrect username or password" : ''}
					/>
				</div>
				<div className="loginButton">
					<Button onClick={this.login}>Login</Button>
				</div>
			</div>
		);
	}
}

export default LoginPage;
