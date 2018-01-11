import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import ChatbotConsole from './components/ChatbotConsole'
import { Grid, Segment } from 'semantic-ui-react'

class DisplayChatbotPage extends Component {

    render() {

        const chatbotsReducer = this.props.chatbotsReducer

        if (chatbotsReducer.length > 0) {
            // if there are any chatbots

            const chatbotIndex = this.props.match.params.topicId

            return (
                <Grid columns={2} stackable divided>

                    <Grid.Column width={11}>
                        <ChatbotConsole match={this.props.match} history={this.props.history} chatbotInfo={chatbotsReducer[chatbotIndex]}/>
                    </Grid.Column>

                    <Grid.Column width={5}>
                        <Segment>kekek</Segment>
                    </Grid.Column>

                </Grid>
            )
        }
        else {
            return(<div>loading chatbot info</div>)
        }

    }

}

class Chatbot extends Component {
   
    componentDidMount() {
        // change the header title to dashboard
        this.props.changeTitle('Chatbot Console')
    }

    render() {
        return (
            <div>
                <Route 
                    path={`${this.props.match.url}/:topicId`} 
                    render={props => <DisplayChatbotPage {...props} chatbotsReducer={this.props.chatbotsReducer}/>}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        chatbotsReducer: state.chatbotsReducer
    }
}

export default connect(mapStateToProps)(Chatbot)

/*
<Grid stackable columns='equal'>
                        <Grid.Row columns='equal'>
                            <Grid.Column>
                                <h3>Domain</h3>
                                <ReactJson src={chatbotInfo.domain} />
                            </Grid.Column>

                            <Grid.Column>
                                <h3>Intents</h3>
                                <ReactJson src={chatbotInfo.nlu_data} />
                            </Grid.Column>

                            <Grid.Column>
                                <h3>Stories</h3>
                                <ReactJson src={chatbotInfo.stories} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row columns='equal'>
                            <Grid.Column>
                                <h3>Chatbot public token: </h3>
                                {chatbotInfo.uuid}
                            </Grid.Column>

                            <Grid.Column>
                                <h3>Total Chatbots Online: </h3>
                                {clientsList}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
*/