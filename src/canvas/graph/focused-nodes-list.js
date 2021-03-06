import React from "react";
import "./focused-nodes-list.scss";
import GEList from "../../ui-components/lists/list";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faWindowClose
} from "@fortawesome/free-solid-svg-icons";
import {invertColor} from "../../core/utils";

export default class FocusedNodesList extends React.Component {

    static defaultProps = {
        focusedNodes: [],
        removeFocusedNode: (nodeId) => console.log("removedFocusedNode", nodeId)
    }

    static propTypes = {
        focusedNodes: PropTypes.array,
        removeFocusedNode: PropTypes.func
    }

    removeFocusedNode(nodeId) {
        console.log("removeFocusedNode", nodeId);
        this.props.removeFocusedNode(nodeId);
    }

    render() {
        return (
            <div className={"focused-nodes-list"}>
                <GEList>
                    {
                        this.props.focusedNodes.map((focusedNode, index) => {
                            console.log("=====focusedNode", focusedNode);
                            return (
                                <li key={index} className={"focused-node"}
                                    style={{
                                        "backgroundColor": focusedNode.meta.shapeOptions.fillColorHex,
                                        "color": invertColor(focusedNode.meta.shapeOptions.fillColorHex, true)
                                    }}>
                                    {focusedNode.meta.labelOptions.labelText}
                                    <span className={"close"}
                                          style={{"color": invertColor(focusedNode.meta.shapeOptions.fillColorHex, true)}}
                                          onClick={() => this.removeFocusedNode(focusedNode.id)}>
                                        <FontAwesomeIcon icon={faWindowClose}/>
                                    </span>
                                </li>
                            )
                        })
                    }
                </GEList>

            </div>
        )
    }
}
