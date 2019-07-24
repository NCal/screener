import React from 'react'

export default class Layout extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {}
  }

  render () {
    return (
      <div>
        <div
          className="body_container"
          style={{ height: '100vh', overflow: 'hidden' }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
