import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import history from '../helper/history'
import '../styles/style.scss'
import Layout from '../components/Layout'
import Main from '../components/main'
import Four0Four from '../components/Four0Four'
import About from '../components/About'
import Footer from '../components/Footer'
import Terms from '../components/Terms'
class App extends React.Component {
  render (props) {
    return <div className="container">
      <Router history={history}>
        <Layout>
          <div className="content-container" style={{height: '100vh', overflow: 'scroll', paddingBottom: '100px'}}>
            <Switch>
              <Route path="/" exact render={({ props, history }) => <Main {...props} history={history} />} />
              <Route path="/about" exact render={({ props, history }) => <About {...props} history={history} />} />
              <Route path="/terms" exact render={({ props, history }) => <Terms {...props} history={history} />} />
              <Route component={Four0Four} />
            </Switch>
          </div>
          <Footer/>
        </Layout>
      </Router>
    </div>
  }
}

export default App
