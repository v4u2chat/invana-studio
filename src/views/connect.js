import React from "react";
import Modal from "../ui-components/modal/modal";
import {setDataToLocalStorage} from "../core/utils";
import {GE_CONSTANTS, VERSION, ABOUT_TEXT, DEMO_VIDEO_URL} from "../config";
import "./connect.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    // faPlayCircle,
    faAngleDown,
    faTimesCircle,
    faPlug, faUserAstronaut, faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import GEPanel from "../ui-components/panels/panel";
// import GEModal from "../ui-components/modal/modal";


export default class SetupGremlinServerConnection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            showExtraHeaderOptions: false,
            extraHeadersCount: 1
        }
    }

    checkIfSecureProtocol(url) {
        const protocol = new URL(url).protocol;
        return protocol === "https:" || protocol === "wss:";
    }


    getHeaders() {

        let headers = {};
        document.querySelectorAll(".headerItem").forEach((elem) => {
            const key = elem.querySelector(".headerKey").value;
            const val = elem.querySelector(".headerValue").value;
            console.log("======", key, val);
            headers[key] = val;
        })
        return headers;
    }

    onFormSubmit(e) {

        const gremlinServerUrl = e.target.gremlinServerUrl.value;
        const graphEngineName = e.target.graphEngineName.value;
        // const isHttps = new URL(window.location.href).protocol === "https:" || new URL(window.location.href).protocol === "wss:";
        e.preventDefault();

        if (!gremlinServerUrl) {
            alert("Invalid connection string");
        } else if (this.checkIfSecureProtocol(window.location.href) && !this.checkIfSecureProtocol(gremlinServerUrl)) {
            alert("Your connection string is not secure. You can only use https or wss connection string " +
                "when you are using Graph Explorer via https connection.")
        } else if (gremlinServerUrl) {
            const headers = this.getHeaders();
            setDataToLocalStorage(GE_CONSTANTS.gremlinServerUrlKey, gremlinServerUrl);
            setDataToLocalStorage(GE_CONSTANTS.httpHeadersKey, headers);
            setDataToLocalStorage(GE_CONSTANTS.graphEngineName, graphEngineName);
            window.location.href = "/";
        }
    }

    openDemo() {
        window.open(DEMO_VIDEO_URL);
    }

    getErrorFromUrlString() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('error');
    }

    componentDidMount() {

        // document.addEventListener('input', (e) => {
        //
        //     if (e.target.getAttribute('name') === "graphEngineName")
        //         console.log(e.target.value)
        // })

        function updateInputPlaceholder(event) {
            console.log("event", event.target.id);
            const el = document.querySelector("[name=gremlinServerUrl]");
            if (event.target.id === "gremlinEngine") {
                el.placeholder = "http://localhost:8182/gremlin";
            } else {
                el.placeholder = "http://localhost:8000/graphql";
            }
        }

        document.querySelectorAll("input[name='graphEngineName']").forEach((input) => {
            input.addEventListener('change', updateInputPlaceholder);
        });

        const errorMessage = this.getErrorFromUrlString();
        if (errorMessage) {
            alert(errorMessage);
        }
    }

    toggleMoreOptions() {

        const errorMessage = "To provide custom headers, " +
            "you need to provide connection string" +
            " with http(s) protocol.";
        const gremlinServerUrl = document.querySelector('[name="gremlinServerUrl"]').value;
        if (!gremlinServerUrl) {
            alert(errorMessage);
            return
        }
        const isHttp = new URL(gremlinServerUrl).protocol.includes("http");
        if (isHttp) {
            this.setState({showExtraHeaderOptions: !this.state.showExtraHeaderOptions})
        } else {
            alert(errorMessage);
        }

    }

    addNewHeader() {
        this.setState({extraHeadersCount: this.state.extraHeadersCount + 1})
    }

    removeHeader() {
        this.setState({extraHeadersCount: this.state.extraHeadersCount - 1})

    }


    render() {
        const headersArrayTemp = Array.from({length: this.state.extraHeadersCount}, (_, index) => index + 1);

        return (
            <div>
                <div className={"connect-heading"}>
                    <FontAwesomeIcon icon={faUserAstronaut} style={{"fontSize": "4rem"}}/>
                    <p className={"invana-logo"}>Invana</p>
                    <h1>Graph Explorer <small>({VERSION})</small></h1>
                    <p>{ABOUT_TEXT}</p>
                </div>
                <div className="github-stars">
                    <a href="https://github.com/invanalabs/graph-explorer"
                       target={"_blank"} rel="noopener noreferrer">
                        <img
                            src="https://img.shields.io/github/stars/invanalabs/graph-explorer?color=%23429770&label=stars%20on%20github&logo=github&style=for-the-badge"
                            alt=""/>
                    </a>
                </div>


                <Modal title={null} size={"md"}
                    // style={{"top": "100px", "left": "auto","right": "20px", }}
                    //    style={{"top": "250px", "left": "20px",}}
                       headerIcon={faPlug}
                       style={{
                           "position": "relative", "left": "20px", "width": "450px",
                           "borderBottomWidth": "4px"
                       }}
                >
                    <GEPanel
                        title={"Connect to Invana Engine"}
                        headerIcon={faPlug}
                        showToggleBtn={false}
                        showCloseBtn={false}
                    >
                        <div className={"connect p-10"}>
                            {/*<div className={"top-section"}>*/}
                            {/*    <h4><FontAwesomeIcon icon={faPlug}/> Connect to Invana Engine </h4>*/}
                            {/*    /!*<p>Invana Engine is a GraphQL API for Apache TinkerPop supported*!/*/}
                            {/*    /!*    Graph Databases.</p>*!/*/}
                            {/*</div>*/}
                            {/*/!*<hr/>*!/*/}

                            <div className={"bottom-section"}>
                                <form action="" onSubmit={this.onFormSubmit.bind(this)}>


                                    {/*<input type="radio" id="gremlinEngine" name="graphEngineName" value="gremlin"*/}
                                    {/*       defaultChecked/>*/}
                                    {/*<label className={"graphEngineNameLabel"} htmlFor="gremlinEngine">Gremlin</label>*/}

                                    <input type="hidden" id="invanaEngine" name="graphEngineName"
                                           value="invana-engine"/>
                                    {/*<label className={"graphEngineNameLabel"} htmlFor="invanaEngine">Invana Engine</label>*/}

                                    <input type="text" name={"gremlinServerUrl"}
                                        // defaultValue={"ws://localhost:8182/gremlin"}
                                           placeholder={"http://127.0.0.1:8000/graphql"}/>
                                    <br/>

                                    <p>
                                        <button className={"extra-headers-btn"} type={"button"}
                                                onClick={this.toggleMoreOptions.bind(this)}>
                                            http headers <FontAwesomeIcon icon={faAngleDown}/>
                                        </button>
                                    </p>
                                    {
                                        this.state.showExtraHeaderOptions
                                            ?
                                            <div className={"headersList"}>

                                                <h4>Extra HTTP Headers</h4>
                                                {
                                                    headersArrayTemp.map((headerItem) => {
                                                        return <div key={headerItem}
                                                                    className={"headerItem headerItem-" + headerItem}>
                                                            <input type="text"
                                                                   className={"headerKey"}
                                                                   placeholder={"header key"}
                                                                   name={"headerKey"}
                                                            />
                                                            <input type="text"
                                                                   className={"headerValue"}
                                                                   placeholder={"header value"}
                                                                   name={"headerValue"}
                                                            />
                                                            <button type={"button"}
                                                                    onClick={this.removeHeader.bind(this)}>
                                                                <FontAwesomeIcon icon={faTimesCircle}/>
                                                            </button>

                                                        </div>

                                                    })
                                                }

                                                <p>
                                                    <button type={"button"} onClick={this.addNewHeader.bind(this)}> +
                                                        add
                                                        new header
                                                    </button>
                                                </p>
                                            </div>
                                            : <span></span>

                                    }

                                    <button type={"submit"} className={"primary-btn button"}>
                                        Start Exploring <FontAwesomeIcon icon={faChevronCircleRight}/></button>

                                    {/*<button onClick={() => this.openDemo()} type={"button"}*/}
                                    {/*        className={" button secondary-btn ml-10"}>*/}
                                    {/*    <FontAwesomeIcon icon={faPlayCircle}/> watch demo*/}
                                    {/*</button>*/}
                                    {/*<a target={"_blank"} rel="noopener noreferrer" href="https://invana.io/help.html">*/}
                                    {/*    <FontAwesomeIcon icon={faQuestionCircle}/>*/}
                                    {/*</a>*/}

                                </form>
                                {this.state.errorMessage ?
                                    (
                                        <p>
                                            <small className={"errorMessage"}>{this.state.errorMessage}</small>
                                        </p>
                                    ) : (<span></span>)
                                }
                                <p style={{"marginTop": "1rem"}}>
                                    {/*<FontAwesomeIcon icon={faQuestionCircle}/> | &nbsp;*/}
                                    {/*<a href="">Training Videos &nbsp;</a>*/}
                                    {/*<FontAwesomeIcon icon={faQuestionCircle}/> &nbsp; | &nbsp;*/}
                                    <a href="https://invana.io/get-started.html" target={"_blank"} rel="noopener noreferrer" >Setup Instructions</a>&nbsp;
                                    | &nbsp; <a href={DEMO_VIDEO_URL} rel="noopener noreferrer"  target={"_blank"} >Watch demo</a>&nbsp;
                                    {/*| &nbsp; <a href="https://invana.io/help.html">Help</a>*/}
                                </p>

                            </div>
                        </div>
                    </GEPanel>
                </Modal>
                <p className={"built-with"}><small>Built with love for Humans
                    & Innovations at <a
                        className={"selected"}
                        target={"_blank"}
                        rel="noopener noreferrer"
                        href="https://invana.io">Invana</a></small>
                </p>

                {/*<Modal title={null} size={"md"} style={{"top": "250px", "right": "20px"}}>*/}
                {/*    <iframe width="560" height="315" src="https://www.youtube.com/embed/SuxC4EH0RCs" frameBorder="0"*/}
                {/*            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"*/}
                {/*            allowFullScreen></iframe>*/}
                {/*</Modal>*/}

            </div>

        )
    }
}
