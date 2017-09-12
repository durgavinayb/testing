import * as React from 'react';
import {Link} from 'react-router';
import { Navbar } from "react-bootstrap"

interface Props extends React.Props<Header> {
}

export default class Header extends React.Component<Props, {}> {
  public render() {
    return (
      <Navbar className="cf-nav-main-header">
        <Navbar.Header>
          <Navbar.Brand>  
            Life Co.
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Text pullRight>
          <div className="cf-white-circle">                            
            Need help?
          </div>
          <div className="cf-white-circle">
            <a href="tel:1-800-555-1234" class="blue">
              1-800-555-1234
            </a>
          </div>
        </Navbar.Text>
      </Navbar>
    );
  }
}
