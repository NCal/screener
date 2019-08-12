import React from 'react'
import path from 'path'
import { Link } from 'react-router-dom'
import ImageHolder from './imageHolder'

export default class Layout extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {}
  }

  render () {
    return (
      <div>
        {/* <Link to={'/'} style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1 }}>
            Home
        </Link> */}
        <div
          className="body_container"
          style={{ height: '100vh', overflow: 'hidden' }}
        >
          {this.props.children}

        </div>
      </div>
    )
  }
}
