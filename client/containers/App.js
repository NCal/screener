import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import history from '../helper/history'
import '../styles/style.scss'
import Layout from '../components/Layout'
import Main from '../components/main'
import Four0Four from '../components/Four0Four'
import About from '../components/About'
import Info from '../components/Info'
import Footer from '../components/Footer'
import Terms from '../components/Terms'
class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {loading: false}
    this.loadingFunc = this.loadingFunc.bind(this)
    this.doneLoading = this.doneLoading.bind(this)
  }

  loadingFunc () {
    console.log('🌹🌹🌹LOADING FUNC🌹🌹🌹')
    this.setState({loading: true})
  }
  doneLoading () {
    console.log('🌹🌹🌹LOADING DONE')
    this.setState({ loading: false })
  }
  render (props) {
    return <div className="container">
      <Router history={history}>
        <Layout>
          <Info/>
          <div className="content-container" style={{height: '85vh', overflow: 'scroll', paddingBottom: '100px'}}>
            <Switch>
              <Route path="/" exact render={({ props, history }) => <Main loadingFunc={this.loadingFunc} doneLoading={this.doneLoading} {...props} history={history} />} />
              {/* <Route path="/about" exact render={({ props, history }) => <About {...props} history={history} />} /> */}
              <Route path="/terms" exact render={({ props, history }) => <Terms {...props} history={history} />} />
              <Route component={Four0Four} />
            </Switch>
          </div>
          <Footer loading={this.state.loading}/>
        </Layout>
      </Router>
    </div>
  }
}

export default App
