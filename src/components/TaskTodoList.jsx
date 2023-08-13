import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import api from "../json-server/api";
import { SubtaskTodoList } from "./SubtaskTodoList";
import { Svg_delete, Svg_plus } from "./SVG";

export const TaskTodoList = ({ value, idx }) => {
  const [subTask, setSubTask] = useState([]);
  const fetchSubtask = async () => {
    await api
      .get(`subtaskTodo`, {
        params: { email: value.email, task_id: value.id },
      })
      .then((res) => {
        setSubTask(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchSubtask();
  }, []);
  return (
    <>
      <ListGroup.Item key={idx} className="d-flex" style={{ gap: "5px" }}>
        <Col xxl={0.5}>{idx + 1}</Col>
        <Col xxl={0.5} className="border-end border-secondary px-1">
          <input type="checkbox" name="status" id={value.id} />
        </Col>
        <Col>{value.task}</Col>
        <Col xxl={2}>
          <div
            style={{
              maxWidth: "16px",
              maxHeight: "16px",
              display: "inline-block",
            }}
          >
            <Svg_plus />
          </div>
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
      <ListGroup className="list-group-flush">
        {subTask.map((val, idx) => (
          <SubtaskTodoList val={val} idx={idx} />
        ))}
      </ListGroup>
    </>
  );
};
