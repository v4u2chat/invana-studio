import React from 'react';
import DefaultLayout from "../../layout/default";


export default class SchemaView extends React.Component {

    render() {
        return (<DefaultLayout {...this.props}>
            <div>Schema view</div>
        </DefaultLayout>)
    }

}