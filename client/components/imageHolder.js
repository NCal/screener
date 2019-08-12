import React from 'react'
import path from 'path'
import { Link } from 'react-router-dom'

export default class ImageHolder extends React.Component {
  constructor (props, context) {
    super(props, context)

    console.log('image holder', this.props)
    this.state = {amount: null}
  }

  componentDidMount () {
    console.log('component did mount image holder', this.props.localImages)
    if (this.props.localImages) {
      console.log('this.props.localImages', this.props.localImages)
      this.setState({ amount: this.props.localImages.length + 1 })
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('nextProps', nextProps)
    if (nextProps.localImages !== this.props.localImages) {
      this.setState({
        amount: this.state.amount + 1
      })
    }
  }

  render () {
    return (
      <div className={'image_holder'} >
        <div className={'image_amount'}>
          {this.state.amount}
        </div>
      </div>
    )
  }
}
