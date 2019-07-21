import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

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
      limitError: null,
      opacity: 1
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

  onHover = () => {
    this.setState({opacity: 0.7})
  }

  onMouseLeave = () => {
    this.setState({opacity: 1})
  }

  screenshot = () => {
    console.log('screenshot');
    console.log('make a call to backend')
    let screenshotLink = document.getElementsByClassName('screenshot')[0];
    this.setState({ loading: true, photoName: null });
    axios
      .post('/screenshot', { url: this.state.input })
      .then(res => {
        console.log('res', res);

        if (res.data.success){
          console.log('success screenshot', res.data.photoName);
          setTimeout(() => {
            this.setState({loading: false, photoName: `https://screensh.s3.amazonaws.com/photos/${res.data.photoName}.jpeg`, disabled: false, error: null }); 
          }, 3000);
        } 

        if (!res.data.success){
          this.setState({ loading: false, photoName: null, disabled: false, limitError: 'Failed getting screenshot. Check Url and try again 🆘' }); 
          console.log('Failed getting screenshot from url.. 🆘', this.state.input);
        }

        if (res.data.limitError){
          console.log('res.data.error', res.data.limitError)
          this.setState({limitError: res.data.limitError})
        }
      })
      .catch(function (error) {
        console.log('we hassss an error', error);
        this.setState({limitError: 'Failed getting screenshot from url.. 🆘'})
      });
  }

  render = () => {
    return (
      <div className="App">
      <Link to={'About'}><span style={{position: 'absolute', top: '10px', left: '10px'}}>About</span></Link>
      <p>Enter a Page to Screenshot 🤳</p>
        <input disabled={this.state.disabled} type="text" value={this.state.input} onChange={this.handleInput} onKeyDown={this.handleKeyDown}></input>
        <input disabled={this.state.disabled} type="button" value="screenshot" onClick={this.fixProtocol}></input>
        {/*<input type="button" value="download" onClick={this.download}></input>*/}
        {this.state.loading ? <img style={{ display: 'block', filter: `invert(1)`, margin: '0 auto', height: '100px' }} src="http://aquar.io/images/loading.gif?2cab32044cb72a7a"/>: null}

        
        {this.state.photoName ? <a  href={`${this.state.photoName}`} target="_blank"><p style={{marginTop: '15px', marginBottom: '0px'}}>✅ Success! ✅</p><img style={{ position: 'relative', top: '20px', border: '4px solid #ffd254', opacity: `${this.state.opacity}`}} onMouseLeave={this.onMouseLeave} onMouseOver={this.onHover} src={`${this.state.photoName}?${Date.now()}`} alt={this.state.date}/></a> : null}
        {this.state.limitError !== null ? <p style={{marginTop: '15px'}}>{this.state.limitError}</p> : null}


      </div>
    );
  }
}

export default main;
