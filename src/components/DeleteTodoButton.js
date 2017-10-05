import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { gql, graphql } from 'react-apollo';
import { todosListQuery } from '../views/Todos';

const deleteTodoMutation = gql`
mutation DeleteTodo($input: DeleteTodoByIdInput!) {
    deleteTodoById(input: $input) {
    clientMutationId
  }
}
`;

const DeleteTodoButtonTemplate = ({mutate, onDelete, todoId}) => {

    const onDeleteClick = () => {
        mutate({
            variables: {
              input: {
                id: todoId
              }
            },
            refetchQueries: [ { query: todosListQuery }]
          })
          .then(res => {
              if(typeof onDelete === 'function') {
                  onDelete();
              }
          });
    }

    return <RaisedButton className={'todo-editor-toolbar-button'} 
            label="Delete" secondary={true} 
            onClick={onDeleteClick} />
}

const DeleteTodoButton = graphql(deleteTodoMutation)(DeleteTodoButtonTemplate);
export default DeleteTodoButton;