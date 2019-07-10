import React, { Component } from 'react'
import axios from 'axios'

class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tag: ''
    }
  }

  componentDidMount = () => {
    let loc = String(this.props.history.location.pathname)
    let locLength = loc.length
    loc = loc.slice(1, loc.length)
    console.log('str', loc)
    this.setState({tag: loc}, ()=>{
      axios
        .post('/redirect', { tag: this.state.tag })
        .then(res => {
          console.log('res', res)
          console.log('url to redirect to', res.data[0].url)
          let redirect = res.data[0].url
          let prot = 'http://'

          if (redirect[0] !== 'h'){
            redirect = prot.concat(redirect)
          }
          console.log('redirect', redirect)
          location.href = redirect
        })
        .catch(err => {
          console.log(err)
        })
    })
  }

  render() {
    return (
      <div className="Test">
      {/*duzntevnmatur
      <br/>
      {this.state.tag}*/}
      </div>
    )
  }
}

export default Test
