import Layout from "components/Layout";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";

// const DebugPage = (): JSX.Element => {
//   return (
//     <Container>
//       <Row>
//         <Col>1 of 3</Col>
//         <Col xs={6}>2 of 3 (wider)</Col>
//         <Col>3 of 3</Col>
//       </Row>
//       <Row>
//         <Col>1 of 3</Col>
//         <Col xs={5}>2 of 3 (wider)</Col>
//         <Col>3 of 3</Col>
//       </Row>
//     </Container>
//   );
// };

const DebugPage = (): JSX.Element => {
  return (
    <Layout>
      <Row className="justify-content-center">
        <Col xs lg="2">
          1 of 3
        </Col>
        <Col md="auto">Variable width content</Col>
        <Col xs lg="2">
          3 of 3
        </Col>
      </Row>
      <Row>
        <Col>1 of 3</Col>
        <Col md="auto">Variable width content</Col>
        <Col xs lg="2">
          3 of 3
        </Col>
      </Row>
    </Layout>
  );
};

export default DebugPage;
