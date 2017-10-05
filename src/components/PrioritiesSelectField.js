import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const prioritiesListQuery = gql`
query PrioritiesListQuery {
    allPriorities {
        nodes {
            id
            name
        }
    }
}
`;

class PrioritiesSelectFieldTemplate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            priorityId: this.props.priorityId || null
        };
    }

    handleChange (event, index, value) {
        this.setState({
            priorityId: value
        });
        if(typeof this.props.onChange === 'function') {
            this.props.onChange(event, index, value);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ priorityId: nextProps.value });
    }

    render () {
        const { data: {loading, error, allPriorities } } = this.props;
        if (loading) {
            return <p>Loading ...</p>;
        }
        if (error) {
            return <p>{error.message}</p>;
        }
        return  <SelectField value={this.state.priorityId} floatingLabelText="Priority" hintText="Priority" onChange={this.handleChange.bind(this)} >
                    { allPriorities.nodes.map(p => <MenuItem key={p.id} value={p.id} primaryText={p.name} />) }
                </SelectField>;
    }
}

const PrioritiesSelectField = graphql(prioritiesListQuery)(PrioritiesSelectFieldTemplate);
export default PrioritiesSelectField;