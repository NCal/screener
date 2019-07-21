import React from 'react'
import { BrowserRouter, Route, Switch, Redirect, IndexRoute } from 'react-router-dom'
import '../styles/style.scss'
import Layout from '../components/Layout'
import Main from '../components/main'
import Four0Four from '../components/Four0Four'

class App extends React.Component {
  // constructor (props) {
  //   super(props)
  // }

  // componentWillMount = () => {
  //   let self = this/
  // }

  render (props) {
    return <div className="container">
      <BrowserRouter>
        <Layout>
          <div className="content-container">
            <Switch>
              <Route path="/" exact render={({ props, history }) => <Main {...props} history={history} />} />
              <Route component={Four0Four} />
            </Switch>
          </div>
        </Layout>
      </BrowserRouter>
    </div>
  }
}

export default App
