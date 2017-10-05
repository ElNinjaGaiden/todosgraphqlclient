import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TodoEditor from '../components/TodoEditor';
import TodoItem from '../components/TodoItem';

const style = {
    grid: {
        display:'-webkit-box',
    },
    todosList: {
        margin: 20,
        width: 700
    }
};

class TodosViewTemplate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            todo: {
                priorityByPriorityid: {},
                userByOwnerid: {}
            }
        };
    }

    onItemClick = (todo) => {
        this.setState({ todo: todo });
    }

    render () {
        const { data: {loading, error, allTodos }} = this.props;
        if (loading) {
            return <p>Loading ...</p>;
        }
        if (error) {
            return <p>{error.message}</p>;
        }
        return (
            <div style={style.grid}>
                <div>
                    <Paper style={style.todosList}>
                        <List>
                            <Subheader>{allTodos.nodes.length ? 'Todos' : 'No todos available yet'}</Subheader>
                            <Divider />
                            { allTodos.nodes.map(n => <TodoItem key={n.id} todo={n} onClick={this.onItemClick.bind(this)} />) }
                        </List>
                    </Paper>
                </div>
                <div>
                    <TodoEditor id={this.state.todo.id} title={this.state.todo.title} 
                                description={this.state.todo.description}
                                duedate={this.state.todo.duedate} 
                                priorityId={this.state.todo.priorityByPriorityid.id}
                                ownerId={this.state.todo.userByOwnerid ? this.state.todo.userByOwnerid.id : null} />
                </div>
            </div>);
    }
}

export const todosListQuery = gql`
query TodosListQuery {
    allTodos {
        nodes {
            id
            title
            description
            todostatusByStatusid {
                id
                name
            }
            priorityByPriorityid {
                id
                name
            }
            userByCreatorid {
                id
                firstname
                lastname
            }
            userByOwnerid {
                id
                firstname
                lastname
            }
            createdon
            duedate
        }
    }
}
`;
const TodosView = graphql(todosListQuery)(TodosViewTemplate);
export default TodosView;