import React from 'react';
import axios from 'axios';


class Main extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      input:'', 
      browser: null, 
      regex: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
      ready: false
    };
  }

  componentDidMount(){}

  handleInput = (e) => {
    this.setState({ input: e.target.value })
  }



  fixProtocol = () => {
    if (this.state.regex.test(this.state.input)) {
      if (/^http?:\/\//i.test(this.state.input)) {
        console.log('no protocol')
        let noProtocol = this.state.input.split('').splice(7, this.state.input.length).join('')
        this.setState({ input: `https://${noProtocol}` });
      }

      if (!/^https?:\/\//i.test(this.state.input)) {
        this.setState({ input: `https://${this.state.input}` });
      }
    
    this.setState({ ready: true }, ()=>{
      this.screenshot();
    });
    }
  }

  screenshot = () => {
    console.log('screenshot');
    console.log('make a call to backend')

    axios
      .post('/screenshot', { url: this.state.input })
      .then(res => {
        console.log('res', res);
        // if (res.data.success){
        //   axios
        //     .post('/download', {}).then((res)=>{
        //       console.log('res', res);
        //     }).catch((err)=>{
        //       console.log('errrrror', err)
        //     })
        // }
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  render =()=>{
    return (
      <div className="App">
      <p>Enter a Page to Screenshot</p>
        <input type="text" value={this.state.input} onChange={this.handleInput}></input>
        <input type="button" value="screenshot" onClick={this.fixProtocol}></input>
      </div>
    );
  }
}

export default Main;
