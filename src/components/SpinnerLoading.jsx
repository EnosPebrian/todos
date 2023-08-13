import { Container } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

function SpinnerLoading() {
  return (
    <Container className="d-flex vh-100 justify-content-center align-items-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );
}

export default SpinnerLoading;
