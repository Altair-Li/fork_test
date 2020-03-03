import React from "react";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import {users} from "./User";
import TopBar from "./TopBar.js";
import {withRouter} from "react-router-dom";

import "./AdminPage.css";

class AdminPage extends React.Component {
  state = {
    redirect: null,
    hidden: true
  };
  addUser = e => {
    this.props.users.push({
      id: this.props.users.length-1,
      type: this.state.type,
      name: this.state.name,
      email: this.state.email,
      username: this.state.username,
      password: this.state.password
    });
    this.setState({redirect: "/admin"});
  };

  editUser = e => {
    this.state.hidden = false;
    this.setState({redirect: "/admin"});
  };

  changeUser = e => {
    // TODO: Implement
  };

  removeUser = i => {
    this.props.users.splice(i, 1);
    this.setState({redirect: "/admin"});
  };

	handleTextFieldChange = e => {
		this.setState({
			[e.target.id]: e.target.value
		});
	};

  render() {
    return (
      <div>
        <TopBar {...this.props.location.state}></TopBar>
        <h3> Total User Count: <span id="userCount">{this.props.users.length}</span></h3>
        <div className="addButton">
          <TextField
            id="type"
            label="Type"
            onChange={this.handleTextFieldChange}
          />
          <TextField
            id="name"
            label="Name"
            onChange={this.handleTextFieldChange}
          />
          <TextField
            id="email"
            label="Email"
            onChange={this.handleTextFieldChange}
          />
          <TextField
            id="username"
            label="Username"
            onChange={this.handleTextFieldChange}
          />
          <TextField
            id="password"
            label="Password"
            onChange={this.handleTextFieldChange}
          />
          <Button onClick={this.addUser}>Add User</Button>
        </div>
        <div>
          {
            this.state.hidden ?
            <Button onClick={this.editUser}>Edit</Button> :
            <Button onClick={this.changeUser}>Submit Changes</Button>
          }
        </div>
        <TableContainer component={Paper}>
          <Table className="table" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">Type</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Username</TableCell>
                <TableCell align="right">Password</TableCell>
                <TableCell align="right">Remove User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.users.map((row, i) => (
                <TableRow key={i}>
                  <TableCell align="right">
                    {this.state.hidden ? <p>{row.type}</p> :
                    <TextField
                      id="typeChange"
                      label={row.type}
                      onChange={this.handleTextFieldChange}
                    />}
                  </TableCell>
                  <TableCell align="right">
                    {this.state.hidden ? <p>{row.name}</p> :
                    <TextField
                      id="typeChange"
                      label={row.name}
                      onChange={this.handleTextFieldChange}
                    />}
                  </TableCell>
                  <TableCell align="right">
                    {this.state.hidden ? <p>{row.email}</p> :
                    <TextField
                      id="typeChange"
                      label={row.email}
                      onChange={this.handleTextFieldChange}
                    />}
                  </TableCell>
                  <TableCell align="right">
                    {this.state.hidden ? <p>{row.username}</p> :
                    <TextField
                      id="typeChange"
                      label={row.username}
                      onChange={this.handleTextFieldChange}
                    />}
                  </TableCell>
                  <TableCell align="right">
                    {this.state.hidden ? <p>{row.password}</p> :
                    <TextField
                      id="typeChange"
                      label={row.password}
                      onChange={this.handleTextFieldChange}
                    />}
                  </TableCell>
                  <TableCell align="right"><Button onClick={this.removeUser.bind(this, i)}>Remove</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

    );
  }
}

export default withRouter(AdminPage);
