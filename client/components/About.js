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
      <div className="about">
        <h3>About</h3>
        <p>Simply enter a Url to take a screenshot</p>
      </div>
    );
  }
}

export default About;
