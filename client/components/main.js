import React from 'react';
import axios from 'axios';

class main extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      input:'', 
      browser: null, 
      regex: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
      ready: false,
      loading: false,
      photoName: null,
      limitError: null
    };
  }

  componentDidMount(){}

  handleKeyDown = (e) => {
    if (e.key == 'Enter') {
      this.fixProtocol();
    }
  }

  handleInput = (e) => {
    this.setState({ input: e.target.value })
  }

  fixProtocol = () => {
    if (this.state.regex.test(this.state.input)) {
      this.setState({disabled: true})
      // if (/^http?:\/\//i.test(this.state.input)) {
      //   console.log('no protocol')
      //   let noProtocol = this.state.input.split('').splice(7, this.state.input.length).join('')
      //   this.setState({ input: `https://${noProtocol}` });
      // }

      if (!/^https?:\/\//i.test(this.state.input)) {
        console.log('didnt find a protocol');
        this.setState({ input: `http://${this.state.input}` });
      }
    
    this.setState({ ready: true }, ()=>{
      this.screenshot();
    });
    }
  }

  download = () => {
    axios
      .get('/download', {}).then((res) => {
        console.log('download res image', res.data)
      }).catch((err) => {
        console.log('errrrror', err)
      })
  }

  screenshot = () => {
    console.log('screenshot');
    console.log('make a call to backend')
    let screenshotLink = document.getElementsByClassName('screenshot')[0];
    this.setState({ loading: true });
    axios
      .post('/screenshot', { url: this.state.input })
      .then(res => {
        console.log('res', res);

        if (res.data.success){
          console.log('success screenshot', res.data.photoName);
          setTimeout(() => {
            this.setState({loading: false, photoName: `https://screensh.s3.amazonaws.com/photos/${res.data.photoName}.jpeg`, disabled: false, error: null }); 
          }, 3000);
            // screenshotLink.click(); 
        } 

        if (!res.data.success){
          this.setState({ loading: false, photoName: null, disabled: false }); 
          console.log('failed getting screenshot from url', this.state.input);
        }

        if (res.data.limitError){
          console.log('res.data.error', res.data.limitError)
          this.setState({limitError: res.data.limitError})
        }
      })
      .catch(function (error) {
        console.log('we hassss an error', error);
      });
  }

  render = () => {
    return (
      <div className="App">
      <p>Enter a Page to Screenshot 🤳</p>
        <input disabled={this.state.disabled} type="text" value={this.state.input} onChange={this.handleInput} onKeyDown={this.handleKeyDown}></input>
        <input disabled={this.state.disabled} type="button" value="screenshot" onClick={this.fixProtocol}></input>
        {/*<input type="button" value="download" onClick={this.download}></input>*/}
        {this.state.loading ? <img style={{ display: 'block', filter: `invert(1)`, margin: '0 auto', height: '100px' }} src="http://aquar.io/images/loading.gif?2cab32044cb72a7a"/>: null}

        
        {this.state.photoName ? <a href={`${this.state.photoName}`}><img src={`${this.state.photoName}?${Date.now()}`} alt={this.state.date}/></a> : null}
        {this.state.limitError !== null ? <p>{this.state.limitError}</p> : null}


      </div>
    );
  }
}

export default main;
