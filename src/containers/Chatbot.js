import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import {
    chatbotEntitiesUpdate_act,
    chatbotIntentsUpdate_act,
    chatbotActionsUpdate_act,
    chatbotStoriesUpdate_act,
    SaveChatbotDatas_act,
    setChatbotTrainingStatus_act
} from './actions/chatbotsActions'
import request from 'superagent'
import DisplayChatbotPage from './components/DisplayChatbotPage'

class Chatbot extends Component {
   
    componentDidMount() {
        // change the header title to dashboard
        this.props.changeTitle('Chatbot Console')
    }

    updateEntities = (cbindex, entities) => {
        // there is a chatbot want to update its entities
        this.props.dispatch(chatbotEntitiesUpdate_act(cbindex, entities))
    }

    updateIntents = (cbindex, intents) => {
        // there is a chatbot want to update its intents
        this.props.dispatch(chatbotIntentsUpdate_act(cbindex, intents))
    }

    updateActions = (cbindex, actions) => {
        // there is a chatbot want to update its actions
        this.props.dispatch(chatbotActionsUpdate_act(cbindex, actions))
    }

    updateStories = (cbindex, stories) => {
        // there is a chatbot want to update its stories
        this.props.dispatch(chatbotStoriesUpdate_act(cbindex, stories))
    }

    // save and train the chatbot datas, need give uuid for knowing which cb is it
    SaveChatbotDatas = (cbuuid, cbdatas, cbid) => {
        const { jwt, backendUrl } = this.props
        this.props.dispatch(setChatbotTrainingStatus_act(cbid, true))
        this.props.dispatch(SaveChatbotDatas_act(backendUrl, cbuuid, cbdatas, jwt, cbid))
    }

    // simple testing with my nlu engine, uuid for knowing which cb to communicate to
    checkQuery = (cbuuid, textmsg, callback) => {
        const { backendUrl, usremail } = this.props
        request
            .post(backendUrl + '/chatbot/v1/query')
            .set('contentType', 'application/json; charset=utf-8')
            .set('dataType', 'json')
            .send({
                uuid: cbuuid,
                text_message: textmsg,
                sender_id: usremail
            })
            .end((err, res) => {

                try {
                    if (err || !res.ok) {
                        let errormsg = res.body.errors
                        throw errormsg
                    }
                    else {
                        let result = res.body

                        if (!result) {
                            throw new Error('no body msg')
                        }

                        this.executeAction(backendUrl, result.next_action, cbuuid, usremail, callback, [result])

                    }
                } catch (e) {
                    console.log(e.toString())
                }

            })
    }

    executeAction = (backendUrl, next_action, uuid, sender_id, callback, compileActions) => {
        if (next_action === 'action_listen') {
            // stop calling execute action liao.. done
            callback(compileActions)
        }
        else {

            // if there is still got next action
            request
                .post(backendUrl + '/chatbot/v1/executeAction')
                .set('contentType', 'application/json; charset=utf-8')
                .set('dataType', 'json')
                .send({
                    uuid: uuid,
                    action: next_action,
                    sender_id: sender_id
                })
                .end((err, res)=>{

                    try {
                        if (err || !res.ok) {
                            let errormsg = res.body.errors
                            throw errormsg
                        }
                        else {
                            let result = res.body

                            if (!result) {
                                throw new Error('no body msg')
                            }

                            // store the action definition
                            compileActions.push(result.returnAct)

                            // execute again to see whether still got any action need to execute mah
                            this.executeAction(backendUrl, result.result.next_action, uuid, sender_id, callback, compileActions)

                        }
                    } catch (e) {
                        console.log(e.toString())
                    }

                })

        }
    }

    render() {
        return (
            <div>
                <Route 
                    path={`${this.props.match.url}/:topicId`} 
                    render= { 
                        props => <DisplayChatbotPage
                            {...props}
                            chatbotsReducer={this.props.chatbotsReducer}
                            updateEntities={this.updateEntities}
                            updateIntents={this.updateIntents}
                            updateActions={this.updateActions}
                            updateStories={this.updateStories}
                            SaveChatbotDatas={this.SaveChatbotDatas}
                            checkQuery={this.checkQuery}
                        />
                    }
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
