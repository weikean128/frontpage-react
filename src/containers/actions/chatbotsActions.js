/*({
    babel: {
        presets: ['react-app']
    }
})*/

import request from 'superagent'
import SocketConnect from './../socketapi'

// ignore my self-signed ssl
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

// get all chatbots infos
var GetAllChatbotsInfos = (backendurl, jwt) => {
    return new Promise((resolve, reject) => {
        request
            .get(backendurl + '/chatbot/v1/infos')
            .query({
                token: jwt
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

                        for(let i = 0; i < result.result.length; ++i) {
                            // init setting for the chatbot object

                            // setup the chatbot socket
                            result.result[i].chatbotSocket = new SocketConnect(result.result[i].uuid)

                            // first init the client list
                            result.result[i].clientsList = []

                            // chatbot ml data related stuff
                            result.result[i].domain = {}
                            result.result[i].nlu_data = {}
                            result.result[i].stories = []

                            // tmp delete later
                            result.result[i].entities = [
                                {
                                    value: 'Chinese', synonyms: ['Chines', 'chines', 'chin']
                                },
                                {
                                    value: 'Outlook', synonyms: ['outlook', 'OUTLOOK', 'Microsoft Outlook']
                                }
                            ]

                            result.result[i].intents = [
                                {
                                    intent: 'greet', 
                                    usersay: [
                                        {
                                            text: 'hello',
                                            entities: []
                                        },
                                        {
                                            text: 'hi',
                                            entities: []
                                        }
                                    ]
                                },
                                {
                                    intent: 'goodbye',
                                    usersay: [
                                        {
                                            text: 'goodbye',
                                            entities: []
                                        },
                                        {
                                            text: 'see you again',
                                            entities: []
                                        }
                                    ]
                                }
                            ]
                        }

                        resolve(result.result)
                    }
                } catch (e) {
                    reject(e.toString())
                }

            })
    })
}

// get chatbot domain info
var GetChatbotDomain = (backendurl, cbuuid, jwt) => {
    return new Promise((resolve, reject) => {
        request
            .get(backendurl + '/chatbot/v1/domain')
            .query({
                token: jwt,
                uuid: cbuuid
            })
            .end((err, res) => {

                try {
                    if (err || !res.ok) {
                        let errormsg = res.body.errors
                        throw errormsg
                    }
                    else {
                        let result = res.body

                        if (!result || !result.success) {
                            throw new Error('no body msg')
                        }

                        resolve(result.result.domain)
                    }
                } catch (e) {
                    reject(e.toString())
                }

            })
    })
}

// get chatbot nlu data
var GetChatbotNLUData = (backendurl, cbuuid, jwt) => {
    return new Promise((resolve, reject) => {
        request
            .get(backendurl + '/chatbot/v1/NLUData')
            .query({
                token: jwt,
                uuid: cbuuid
            })
            .end((err, res) => {

                try {
                    if (err || !res.ok) {
                        let errormsg = res.body.errors
                        throw errormsg
                    }
                    else {
                        let result = res.body

                        if (!result || !result.success) {
                            throw new Error('no body msg')
                        }

                        resolve(result.result.rasa_nlu_data)
                    }
                } catch (e) {
                    reject(e.toString())
                }

            })
    })
}

// get chatbot stories data
var GetChatbotStories = (backendurl, cbuuid, jwt) => {
    return new Promise((resolve, reject) => {
        request
            .get(backendurl + '/chatbot/v1/stories')
            .query({
                token: jwt,
                uuid: cbuuid
            })
            .end((err, res) => {

                try {
                    if (err || !res.ok) {
                        let errormsg = res.body.errors
                        throw errormsg
                    }
                    else {
                        let result = res.body

                        if (!result || !result.success) {
                            throw new Error('no body msg')
                        }

                        resolve(result.result.stories)
                    }
                } catch (e) {
                    reject(e.toString())
                }

            })
    })
}

// get query domain, nlu data, stories all at the same time
var GetChatbotMLData = (backendurl, cbuuid, jwt, cbid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let mldata = await Promise.all([
                GetChatbotDomain(backendurl, cbuuid, jwt),
                GetChatbotNLUData(backendurl, cbuuid, jwt),
                GetChatbotStories(backendurl, cbuuid, jwt)
            ])
            resolve({ domain: mldata[0], nlu_data: mldata[1], stories: mldata[2], cbindex: cbid})
        } catch(e) {
            reject(e.toString())
        }
    })
}

// request login action
export function reqChatbotsInfos_act(backendurl, jwt) {
    return {
        type: 'USR_REQ_CHATBOTS',
        payload: GetAllChatbotsInfos(backendurl, jwt)
    }
}

// chatbot listening for new client online
export function chatbotClientsListUpdate_act(cbindex, clientsList) {
    return {
        type: 'CHATBOT_UPDATE_CLIENTS',
        payload: { cbindex: cbindex, clientsList: clientsList }
    }
}

// request to get domain, nlu data, stories of this chatbot
export function reqChatbotMLData_act(backendurl, cbuuid, jwt, cbid) {
    return {
        type: 'USR_REQ_CHATBOT_ML_DATA',
        payload: GetChatbotMLData(backendurl, cbuuid, jwt, cbid)
    }
}