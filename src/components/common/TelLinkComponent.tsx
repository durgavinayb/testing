import * as React from "react"

export interface TelLinkProps {
  phoneNumber: string
}

const TelLinkComponent = React.createClass<TelLinkProps, {}>({
  render() {
    return (
      <a href={"tel:" + this.props.phoneNumber}>{this.props.phoneNumber}</a>
    )
  }
})

export default TelLinkComponent
