import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const userListQuery = gql`
query UsersListQuery {
    allUsers {
        nodes {
            id
            firstname
            lastname
        }
    }
}
`;

class UsersSelectFieldTemplate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.ownerId || null
        };
    }

    handleChange (event, index, value) {
        this.setState({
            userId: value
        });
        if(typeof this.props.onChange === 'function') {
            this.props.onChange(event, index, value);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ userId: nextProps.value });
    }

    render () {
        const { data: {loading, error, allUsers } } = this.props;
        if (loading) {
            return <p>Loading ...</p>;
        }
        if (error) {
            return <p>{error.message}</p>;
        }
        return  <SelectField value={this.state.userId} floatingLabelText="Owner" hintText="Owner" onChange={this.handleChange.bind(this)}>
                    { allUsers.nodes.map(u => <MenuItem key={u.id} value={u.id} primaryText={u.firstname + ' ' + u.lastname} />) }
                </SelectField>;
    }
}

const UsersSelectField = graphql(userListQuery)(UsersSelectFieldTemplate);
export default UsersSelectField;