import React from 'react';
import { Link } from 'react-router-dom'

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() { }

  render = () => {
    return (
      <footer className="footer">
        <p>
          Made by NCALMEDIA. By using this site you accept the <Link to={'/terms'}>terms</Link> of use.
        </p>
      </footer>
    );
  }
}
