import React from 'react'
import path from 'path'
import { Link } from 'react-router-dom'

export default class ImageHolder extends React.Component {
  constructor (props, context) {
    super(props, context)

    console.log('image holder', this.props)
    this.state = {amount: null, localImages: null}
  }

  componentDidMount () {
    console.log('component did mount image holder', this.props.localImages)
    if (this.props.localImages) {
      console.log('this.props.localImages', this.props.localImages)
      this.setState({ amount: this.props.localImages.length, localImages: this.props.localImages })
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log('nextProps', nextProps)
    if (nextProps.localImages !== this.props.localImages) {
      console.log('should set state')
      this.setState({
        amount: this.state.amount += 1,
        localImages: nextProps.localImages
      })
    }
  }

  render () {
    return (
      <div className={'image_holder'} >
        {this.state.amount !== 0 ? <div onClick={() => { console.log('this.state.localImages', this.state.localImages) }} className={'image_amount'}>{this.state.amount}</div> : ''}
        {this.state.localImages !== null ? this.state.localImages.map((image, index) => { return <div key={`${index}`} style={{width: '100px', cursor: 'pointer', height: '100px', backgroundSize: 'contain', backgroundImage:`url(${image.image})`,  backgroundRepeat: 'no-repeat'}}></div> }) : ''}
      </div>
    )
  }
}
