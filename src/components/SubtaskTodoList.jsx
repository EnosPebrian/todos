import { Col } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import { Svg_delete } from "./SVG";
export const SubtaskTodoList = ({ val, idx }) => {
  return (
    <>
      <ListGroup.Item
        key={idx}
        className="d-flex"
        style={{ gap: "5px", marginLeft: "36px" }}
      >
        <Col xxl={0.5} className="border-end border-secondary px-1">
          <input type="checkbox" name="status" id={val.id} />
        </Col>
        <Col>{val.subtask}</Col>
        {/* <Col xxl={2}>{val.datestart}</Col> */}
        {/* <Col xxl={2}>{val.timestart}</Col> */}
        <Col xxl={2} className="d-flex justify-content-end">
          <div
            style={{
              maxWidth: "16px",
              maxHeight: "16px",
              display: "inline-block",
            }}
          >
            <Svg_delete />
          </div>
        </Col>
      </ListGroup.Item>
    </>
  );
};
