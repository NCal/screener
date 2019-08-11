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
      limitError: null,
      fileOption: 'JPEG',
      fullPage: true, 
      fileType: null,
      opacity: 1,
      fullpageOption: 'inline'
    };
  }

  componentDidMount(){}

  handleKeyDown = (e) => {
    if (e.key == 'Enter') {
      this.fixProtocol();
    }
  }

  handleInput = (e) => {
    // //console.log('e.target.value', e.target.value)
    // if (e.target.value !== 'JPEG'){

    //   this.setState({input: e.target.value, fullpageOption: 'none'})
    // }
    this.setState({ input: e.target.value })
  }

  handleCheckbox = (e)=>{ 
    e.target.checked ? this.setState({fullPage: true}) : this.setState({fullPage: false})
  }

  fixProtocol = () => {
    if (this.state.regex.test(this.state.input)) {
      this.setState({disabled: true})

      if (!/^https?:\/\//i.test(this.state.input)) {
        //console.log('didnt find a protocol');
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
        //console.log('download res image', res.data)
      }).catch((err) => {
        //console.log('errrrror', err)
      })
  }

  onHover = () => {
    this.setState({opacity: 0.7})
  }

  onMouseLeave = () => {
    this.setState({opacity: 1})
  }

  handleSelectChange = (e) => {
    //console.log('e.target.value', e.target.value)
    if (e.target.value !== 'JPEG'){
      this.setState({ fileOption: e.target.value, fullpageOption: 'none'})
    } else {
      this.setState({ fileOption: e.target.value, fullpageOption: 'inline'})
    }
    //console.log('handleSelectChange', e.target.value);
  }

  screenshot = () => {
    //console.log('screenshot');
    //console.log('make a call to backend')
    let screenshotLink = document.getElementsByClassName('screenshot')[0];
    this.props.loadingFunc();
    this.setState({ loading: true, photoName: null, limitError: null, fileType: null });
    let self = this;
    axios
      .post('/screenshot', { url: this.state.input, fileOption: this.state.fileOption, fullPage: this.state.fullPage })
      .then(res => {
        //console.log('res', res);

        if (res.data.success && res.data.fileType === 'jpeg'){
          //console.log('success screenshot jpeg', res.data.photoName);
          setTimeout(() => {
            this.setState({loading: false, photoName: `https://screensh.s3.amazonaws.com/photos/${res.data.photoName}.jpeg`, disabled: false, error: null, fileType: res.data.fileType }); 
            this.props.doneLoading()
          }, 3000);
        }

        if (res.data.success && res.data.fileType !== 'jpeg') {
          //console.log('success screenshot pdf', res.data.photoName);
          setTimeout(() => {
            //console.log('should be setting state of pdf');
            this.setState({ loading: false, photoName: `https://screensh.s3.amazonaws.com/photos/${res.data.photoName}.pdf`, disabled: false, error: null, fileType: res.data.fileType });
            this.props.doneLoading()
          }, 3000);
        }

        if (!res.data.success){
          this.setState({ loading: false, photoName: null, disabled: false, limitError: 'Failed getting screenshot. Check Url and try again 🆘' }); 
          //console.log('Failed getting screenshot from url.. 🆘', this.state.input);
        }

        if (res.data.limitError){
          //console.log('res.data.error', res.data.limitError)
          this.setState({limitError: res.data.limitError})
        }
      })
      .catch(function (error) {
        //console.log('we hassss an error', error);
        self.setState({ loading: false, photoName: null, disabled: false, limitError: 'Failed getting screenshot. Check Url and try again 🆘' }); 
      });
  }

  render = () => {
    return (
      <div>
      <h1 className={'main-title'}>ScreenGrab</h1>
      {/*<Link to={'About'} ><span style={{position: 'absolute', top: '10px', left: '10px', display: `${this.state.loading ? 'none' : 'block'}`}}>About</span></Link>*/}
      <p>Simply enter a URL to take a screenshot🤳</p>
      <form >
        <input disabled={this.state.disabled} type="text" value={this.state.input} onChange={this.handleInput} onKeyDown={this.handleKeyDown}></input>
        {/*<select onChange={this.handleSelectChange} >
          <option value="JPEG">JPEG</option>
          <option value="PDF">PDF</option>
        </select>*/}
          <label style={{ display: this.state.fullpageOption !== 'inline' ? 'none' : 'block'}} >
          Full Page &nbsp;
          <input disabled={this.state.disabled} type="checkbox" name="fullpage" style={{display: this.state.fullpageOption}} defaultChecked onChange={this.handleCheckbox}/>
        </label>
        <input disabled={this.state.disabled} type="button" value="screenshot" onClick={this.fixProtocol}></input>
        </form>

        {/*<input type="button" value="download" onClick={this.download}></input>*/}
        
        {this.state.loading ? <div id='loader'></div> : null}
        {/* {this.state.loading ? <img style={{ display: 'block', filter: `invert(1)`, margin: '0 auto', height: '100px' }} src="http://aquar.io/images/loading.gif?2cab32044cb72a7a"/>: null}*/}
        {this.state.photoName && this.state.fileType === 'jpeg' ? <a  href={`${this.state.photoName}`} target="_blank"><p style={{marginTop: '15px', marginBottom: '0px'}}>✅ Success! ✅</p><img alt="A screenshot showing a webpage" style={{ position: 'relative', top: '20px', border: '4px solid #ffd254', opacity: `${this.state.opacity}`}} onMouseLeave={this.onMouseLeave} onMouseOver={this.onHover} src={`${this.state.photoName}?${Date.now()}`} alt={this.state.date}/></a> : null}
        {this.state.photoName && this.state.fileType === 'pdf' ? <a href={`${this.state.photoName}`} target="_blank"><p style={{ marginTop: '15px', marginBottom: '0px' }}>✅ Success! ✅</p><iframe style={{ position: 'relative', top: '20px', border: '4px solid #ffd254', width: '100%', height: '400px' }} sandbox="allow-popups-to-escape-sandbox" src={`${this.state.photoName}?${Date.now()}`} alt='pdf' /></a> : null}
        {this.state.limitError !== null ? <p style={{marginTop: '15px'}}>{this.state.limitError}</p> : null}


      </div>
    );
  }
}

export default main;
