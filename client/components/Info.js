import React from 'react';
import { Link } from 'react-router-dom'

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() { }

  handleClick(){
    if (this.state.collapsed){
      this.setState({ collapsed: false })
    } else {
      this.setState({ collapsed: true })
    }
  }

  render = () => {
    return (this.state.collapsed ? <div className="info" onClick={this.handleClick}>❔</div>
      : <div className="info" style={{ width: '300px' }} onClick={this.handleClick}>
        <h5>What Does ScreenGrab Do?</h5>
        <p>
          ScreenGrab navigates to the pages you choose and takes a full-page screenshot.
          Your files are not stored longer than 24 hours so get them while they're hot.
          To get started simply enter a Url and click the screenshot button.</p>
      </div>
    );
  }
}

export default Info;
