import React from "react";
import "./table.scss";
import GremlinResponseSerializers from "../../base/gremlin-serializer";
import {getDataFromLocalStorage} from "../../utils";


const gremlinSerializer = new GremlinResponseSerializers();

export class TableComponent extends React.Component {
    static defaultProps = {
        data: null,
        label: null
    }

    getPropertyKeys() {
        if (this.props.data.length === 0) {
            return []
        } else {
            return Object.keys(this.props.data[0].properties || {})
        }
    }

    render() {
        const propertyKeys = this.getPropertyKeys();
        console.log("TableComponent here", this.props.label)
        let colorOptions = {};
        if (this.props.type === "Vertex") {
            const _ = getDataFromLocalStorage("nodeLabels", true) || {}
            colorOptions = _[this.props.label] || {};
        } else {
            const _ = getDataFromLocalStorage("linkLabels", true) || {}
            colorOptions = _[this.props.label] || {}
        }

        return (
            <div className={"tableComponent"}>
                <h3>{this.props.type} | {this.props.label}</h3>
                <table>
                    <thead>
                    <tr style={{
                        "backgroundColor": colorOptions.bgColor || "inherit",
                    }}>
                        {
                            propertyKeys.map((propertyKey, index) => {
                                return (
                                    <th style={{"borderColor": colorOptions.borderColor || "inherit"}}
                                        key={index}>{propertyKey}</th>
                                )
                            })
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.data.map((node) => {
                            return (
                                <tr key={node.id}>
                                    {
                                        propertyKeys.map((prop, index) => {
                                            return (<td key={index}>{node.properties[prop]}</td>)
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>


            </div>
        )
    }

}

export default class TableCanvas extends React.Component {

    static defaultProps = {
        responses: null
    }


    convertResponses2JSONs(responses) {

        let jsonResponses = [];
        responses.forEach(function (response) {
            console.log("=======response", response)
            const _ = gremlinSerializer.process(response)
            jsonResponses.push(_)
        })
        return jsonResponses;
    }

    render() {
        const jsonResponses = this.convertResponses2JSONs(this.props.responses);


        let responsesDataFinal = [];
        jsonResponses.forEach(function (jsonResponse) {
            const _ = gremlinSerializer.separateVerticesAndEdges(jsonResponse);
            console.log("==========", _);
            const nodeGroups = gremlinSerializer.groupByLabel(_['nodes']);
            const linkGroups = gremlinSerializer.groupByLabel(_['links']);
            console.log("nodeGroups==", nodeGroups);
            responsesDataFinal.push({
                "nodeGroups": nodeGroups,
                "linkGroups": linkGroups,
                "requestInfo": jsonResponse
            })
        })

        console.log("========jsonResponses", jsonResponses);
        console.log("========responsesDataFinal", responsesDataFinal, typeof responsesDataFinal);
        return (
            <div className={"p-10 tableCanvas"}>
                {
                    responsesDataFinal.map((responseDatum, index) => {
                        console.log("responseDatum", responseDatum)
                        const nodeGroups = responseDatum['nodeGroups'];
                        const linkGroups = responseDatum['linkGroups'];
                        console.log("nodeGroups", nodeGroups)
                        return (
                            <div className={"responseBox "} key={index}>

                                {


                                    Object.keys(nodeGroups).map((nodeLabel, index) => (
                                        <TableComponent type={"Vertex"} key={nodeLabel + index} label={nodeLabel}
                                                        data={nodeGroups[nodeLabel]}/>
                                    ))


                                }
                                {
                                    Object.keys(linkGroups).map((linkLabel, index) => (
                                        <TableComponent type={"Edge"} key={linkGroups + index} label={linkLabel}
                                                        data={linkGroups[linkLabel]}/>
                                    ))
                                }
                            </div>
                        )

                    })
                }
            </div>
        )
    }
}
