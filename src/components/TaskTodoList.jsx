import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import api from "../json-server/api";
import { SubtaskTodoList } from "./SubtaskTodoList";
import { Svg_delete, Svg_plus } from "./SVG";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import { useSelector } from "react-redux";

export const TaskTodoList = ({ value, idx }) => {
  const [subTask, setSubTask] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
      <ListGroup.Item
        key={idx}
        className="d-flex"
        style={{ gap: "5px" }}
        id={`task-container-${value.id}`}
      >
        <Col xxl={0.5}>{idx + 1}</Col>
        <Col xxl={0.5} className="border-end border-secondary px-1">
          <input type="checkbox" name="status" id={value.id} />
        </Col>
        <Col id={`task-${value.id}`}>{value.task}</Col>
        <Col
          xxl={2}
          className="d-flex justify-content-end"
          style={{ gap: "10px" }}
        >
          <button
            style={{
              maxWidth: "16px",
              maxHeight: "16px",
              display: "inline-block",
            }}
            onClick={handleShow}
          >
            <Svg_plus />
          </button>
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
      <ModalEdit
        handleClose={handleClose}
        show={show}
        fetchSubtask={fetchSubtask}
      />
    </>
  );
};

function ModalEdit({ handleClose, show, fetchSubtask }) {
  const userSelector = useSelector((state) => state.auth);
  const formik = useFormik({
    initialValues: {
      email: "",
      task: "",
      status: "",
      datestart: "",
      dateend: "",
      timestart: "",
      timeend: "",
      deadline: "",
      deadlinetime: "",
    },
    onSubmit: async (values) => {
      const temp = { ...values };
      temp.datestart = new Date().toISOString().split("T")[0];
      temp.timestart = new Date().toString().split(" ")[4];
      temp.email = userSelector.email;
      temp.status = "ongoing";
      await api.post("taskTodo", temp).catch((err) => console.log(err));
      fetchSubtask();
      handleClose();
    },
  });
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit task to do</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Task</Form.Label>
              <Form.Control
                as="textarea"
                id="task"
                name="task"
                placeholder="write something to do"
                autoFocus
                style={{ height: "13rem" }}
                onChange={formik.handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deadline date</Form.Label>
              <Form.Control
                type="date"
                name="deadline"
                id="deadline"
                autoFocus
                onChange={formik.handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deadline time</Form.Label>
              <Form.Control
                type="time"
                name="dedlinetime"
                id="deadlinetime"
                autoFocus
                onChange={formik.handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={formik.handleSubmit}>
            Add new task
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
