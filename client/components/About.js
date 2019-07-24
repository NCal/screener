import React from 'react';
import { Link } from 'react-router-dom'

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() { }


  render = () => {
    return (
      <div className="App">
        <Link to={'/'}><span style={{ position: 'absolute', top: '10px', left: '10px' }}>Home</span></Link>
        <h3>About</h3>
        <p>Simply enter a Url to take a screenshot</p>
      </div>
    );
  }
}

export default About;
