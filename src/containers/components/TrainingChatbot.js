import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Entities from './Entities'
import Intents from './Intents'
import Actions from './Actions'
import Stories from './Stories'
import { Menu } from 'semantic-ui-react'

class TrainingChatbot extends Component {

  constructor(props) {
    super(props)
    this.state = {
      menuItems: ['Stories', 'Entities', 'Intents', 'Actions']
    }
  }

  handleItemClick = (e, { name }) => {
    this.props.history.push(this.props.match.url + '/' + name)
  }

  render() {
    const { menuItems } = this.state
    const {
      chatbotInfo,
      updateStories,
      updateIntents,
      updateEntities,
      updateActions,
      match,
      history
    } = this.props
    const { entities, intents, actions, stories } = chatbotInfo
    let gs = history.location.pathname.split("/")
    let pathname = gs[5] // hardcoded magic number here.. whatever

    if (!pathname) {
      // if is undefined
      pathname = 'Entities'
    }

    return (
      <div>
        <Menu inverted>
          <Menu.Item name={menuItems[0]} active={pathname === menuItems[0]} onClick={this.handleItemClick} />
          <Menu.Item name={menuItems[1]} active={pathname === menuItems[1]} onClick={this.handleItemClick} />
          <Menu.Item name={menuItems[2]} active={pathname === menuItems[2]} onClick={this.handleItemClick} />
          <Menu.Item name={menuItems[3]} active={pathname === menuItems[3]} onClick={this.handleItemClick} />
        </Menu>

        <Route
          exact
          path={`${match.url}/`}
          render={props => {
            return (
              <Redirect to={`${match.url}/${menuItems[0]}`} />
            )
          }}
        />

        <Route
          path={`${match.url}/${menuItems[0]}`}
          render={props => <Stories {...props} cbStories={stories} cbIntents={intents} cbActions={actions} cbEntities={entities} updateStories={updateStories} />}
        />

        <Route
          path={`${match.url}/${menuItems[1]}`}
          render={props => <Entities {...props} cbEntities={entities} updateEntities={updateEntities} />}
        />

        <Route
          path={`${match.url}/${menuItems[2]}`}
          render={props => <Intents {...props} cbIntents={intents} cbEntities={entities} updateIntents={updateIntents} />}
        />

        <Route
          path={`${match.url}/${menuItems[3]}`}
          render={props => <Actions {...props} cbActions={actions} updateActions={updateActions} />}
        />

      </div>
    )
  }
}

export default TrainingChatbot