import * as React from 'react';
import {Link} from 'react-router';
import {Button, Row, Col} from "react-bootstrap"

interface Props extends React.Props<Main> {
}

export default class Main extends React.Component<Props, {}> {
  getInitialState() {
    return {
      dob: new Date()
    }
  }
  public render() {
    return (
     <div className="row">
       <h1 className="jumbotron">Get a Quote</h1>

       <Row>
        <Col sm={12} md={6} style={{marginLeft: "auto", marginRight: "auto", float: "none"}}>
          <div style={{textAlign: "center"}}>
            <h1>
              I am
            </h1>
            <Col sm={5}>
              <Button>MALE</Button>
            </Col>
            <Col sm={5}>
              <Button>FEMALE</Button>
            </Col>
          </div>
        </Row>
      </div>
     </div>
    );
  }
}
