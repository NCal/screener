import React, { Component } from 'react'
import axios from 'axios'

class LinkInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      link: '',
      protocol: 'https://',
      display: '',
      error: '',
      reggy: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    }
  }

  handleInput = e => {
    console.log(e.target.value)
    this.setState({ link: e.target.value })
  }

  handleClick = () => {
    let self = this;
    // console.log('handle click')
    if (this.state.reggy.test(this.state.link)){
      alert('make post call');
            axios
        .post('/shorten', { link: this.state.link })
        .then(res => {
          console.log(res);
          let resLength = res.data.length;
          self.setState(
            {
              display: 'xzzz.herokuapp.com/' + res.data[resLength - 1].tag
            },
            () => {
              console.log('display', self.state.display);
            }
          );
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.setState({error: 'Please Enter a valid url'})
    }
  }

  handleProtocol = (e) => {
    console.log('handle protocol')
    this.setState({protocol: e.target.value + "://"}, ()=>{
      console.log('protocol', this.state.protocol)
    })
  }

  render() {
    return <div className="LinkInput">
        <h5 className="main-title">Link Obfuscator</h5>
        <input type="text" placeholder="enter a link to obfuscate" onChange={this.handleInput} />
        <button onClick={this.handleClick}>Shorten</button>
        <div>
          <div onClick={() => {
              // console.log('click', location.href)
              // location.href = this.state.display
              // console.log(location)
            }}>
            {this.state.display ? <p>
                Here's your link: <a href={'https://'+ this.state.display} target="_blank">
                  {this.state.display}
                </a>
              </p> : this.state.error}
          </div>
        </div>
      </div>
  }
}

export default LinkInput
