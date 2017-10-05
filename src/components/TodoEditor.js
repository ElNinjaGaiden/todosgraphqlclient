import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import PrioritiesSelectField from '../components/PrioritiesSelectField';
import UsersSelectField from '../components/UsersSelectField';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { gql, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { todosListQuery } from '../views/Todos';
import DeleteTodoButton from '../components/DeleteTodoButton';
import UpdateTodoButton from '../components/UpdateTodoButton';

class TodoEditor extends Component {

  constructor (props) {
    super(props);
    this.state = this.getEmptyTodo();
  }

  getEmptyTodo = () => {
    return {
      id: null,
      creatorId: 1,
      createdOn: null,
      title: '',
      description: '',
      priorityId: null,
      statusId: 1,
      ownerId: null,
      duedate: null
    };
  }

  componentWillReceiveProps(nextProps) {
    const newState = Object.assign({}, nextProps);
    if(nextProps.duedate && typeof nextProps.duedate === 'string') {
      const duedateparts = nextProps.duedate.split('-');
      newState.duedate = new Date(parseInt(duedateparts[0]), parseInt(duedateparts[1]) - 1, parseInt(duedateparts[2]));
    }
    this.setState(newState);
  }

  render () {
    return (
      <Paper style={style.paperStyle} zDepth={2}>
        <Toolbar>
          <ToolbarGroup>
          <ToolbarTitle text="Todo Details" />
          </ToolbarGroup>
        </Toolbar>
        <form style={style.formStyle}>
          <TextField hintText="Title" floatingLabelText="Title" fullWidth={true} value={this.state.title} onChange={this.handleTitle.bind(this)} />
          <TextField hintText="Description" floatingLabelText="Description" multiLine={true} rows={2} fullWidth={true} value={this.state.description} onChange={this.handleDescription.bind(this)}/>
          <br />
          <DatePicker hintText="Due Date" floatingLabelText="Due Date" value={this.state.duedate} onChange={this.handleDueDate.bind(this)} autoOk={true} />
          <PrioritiesSelectField value={this.state.priorityId} onChange={this.handlePriority.bind(this)} />
          <UsersSelectField value={this.state.ownerId} onChange={this.handleOwner.bind(this)} />
        </form>
        <Toolbar>
          <ToolbarGroup firstChild={true} />
          <ToolbarGroup lastChild={true}>
            <RaisedButton className={'todo-editor-toolbar-button'} label="Clear" primary={true} onClick={this.onClearClick.bind(this)} />
            {
              this.state.id && <DeleteTodoButton todoId={this.state.id} onDelete={this.onDelete.bind(this)} />
            }
            {
              !this.state.id && <RaisedButton className={'todo-editor-toolbar-button'} label="Add" primary={true} onClick={this.onSaveClick.bind(this)} />
            }
            {
              this.state.id && <UpdateTodoButton onUpdate={this.onUpdate.bind(this)} todo={this.state} />
            }
          </ToolbarGroup>
        </Toolbar>
      </Paper>
    )
  }

  handleTitle(event) {
    this.setState({ title: event.target.value });
  }

  handleDescription(event) {
    this.setState({ description: event.target.value });
  }

  handlePriority(event, index, value) {
    this.setState({
      priorityId: value
    });
  }

  handleOwner(event, index, value) {
    this.setState({
      ownerId: value
    });
  }

  handleDueDate = (event, date) => {
    this.setState({ duedate: date });
  }

  onSaveClick = () => {
    const { mutate } = this.props;
    const state = this.state;
    mutate({
      variables: {
        todo: {
          ownerid: state.ownerId,
          title: state.title,
          description: state.description,
          priorityid: state.priorityId,
          statusid: state.statusId,
          creatorid: state.creatorId,
          duedate: `${state.duedate.getFullYear()}-${state.duedate.getMonth() + 1}-${state.duedate.getDate()}`
        }
      },
      refetchQueries: [ { query: todosListQuery }]
    })
    .then(res => {
      this.onClearClick();
    });
  }

  onClearClick = () => {
    this.setState(this.getEmptyTodo());
  }

  onDelete = () => {
    this.onClearClick();
  }

  onUpdate = () => {

  }
}

const addTodoMutation = gql`
mutation CreateTodo($todo: CreatetodoInput!) {
  createtodo(input: $todo) {
    clientMutationId
  }
}
`;

const style = {
  paperStyle: {
    margin: 20,
    width: 500
  },
  formStyle: {
    padding: 10
  }
};

const TodoEditorWithMutation = graphql(addTodoMutation)(withRouter(TodoEditor));
export default TodoEditorWithMutation;
