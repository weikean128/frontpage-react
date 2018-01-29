import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reqChatbotsInfos_act } from './actions/chatbotsActions'
import UsrDashboard from './components/UsrDashboard'
import CbDashboard from './components/CbDashboard'
import LcDashboard from './components/LcDashboard'
import { Grid } from 'semantic-ui-react'

class Dashboard extends Component {

    componentDidMount() {
        // change the header title to dashboard
        this.props.changeTitle('Dashboard')

        const { userReducer, backendUrl } = this.props
        const jwt = userReducer.jwt

        // get all the chatbot projects info that this user own
        this.props.dispatch(reqChatbotsInfos_act(backendUrl, jwt))

        // same thing for live chat projects
    }

    render() {
        const { userReducer, chatbotsReducer, livechatsReducer } = this.props

        return (
            <Grid stackable columns='equal'>

                <Grid.Column>
                    <UsrDashboard userReducer={userReducer} chatbotsReducer={chatbotsReducer} livechatsReducer={livechatsReducer}/>
                </Grid.Column>

                <Grid.Column>
                    <CbDashboard chatbotsReducer={chatbotsReducer}/>
                </Grid.Column>

                <Grid.Column>
                    <LcDashboard livechatsReducer={livechatsReducer}/>
                </Grid.Column>

            </Grid>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        chatbotsReducer: state.chatbotsReducer,
        livechatReducer: state.livechatReducer
    }
}

export default connect(mapStateToProps)(Dashboard)
