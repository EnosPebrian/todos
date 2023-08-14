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
import * as Yup from "yup";

export const TaskTodoList = ({ value, idx, fetchTask }) => {
  const [subTask, setSubTask] = useState([]);
  const [modalState, setModalState] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setModalState("");
  const handleShowModalOne = () => setModalState("modal-one");
  const handleShowModalTwo = () => setModalState("modal-two");

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

  const handleDelete = async (val) => {
    if (
      window.confirm("Are you sure want to delete this task and its subtasks?")
    ) {
      const res = await api.get(`/subtaskTodo?task_id=${value.id}`);
      const allsubtask = res.data;
      for (let item of allsubtask) {
        await api.delete(`/subtaskTodo/${item.id}`);
      }
      await api.delete(`/taskTodo/${value.id}`);
    }
    fetchTask();
    fetchSubtask();
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
        <Col
          id={`task-${value.id}`}
          style={{ cursor: "pointer" }}
          onClick={handleShowModalOne}
        >
          {value.task}
        </Col>
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
            onClick={handleShowModalTwo}
          >
            <Svg_plus />
          </button>
          <ModalAddSubtask
            handleClose={handleClose}
            show={show}
            fetchSubtask={fetchSubtask}
            modalState={modalState}
            value={value}
          />
          <button
            style={{
              maxWidth: "16px",
              maxHeight: "16px",
              display: "inline-block",
            }}
            onClick={() => handleDelete(value)}
          >
            <Svg_delete />
          </button>
        </Col>
      </ListGroup.Item>
      <ListGroup className="list-group-flush">
        {subTask.map((val, idx) => (
          <SubtaskTodoList val={val} idx={idx} fetchSubtask={fetchSubtask} />
        ))}
      </ListGroup>
      <ModalEdit
        handleClose={handleClose}
        show={show}
        fetchTask={fetchTask}
        modalState={modalState}
        value={value}
      />
    </>
  );
};

function ModalEdit({ handleClose, fetchTask, modalState, value }) {
  const userSelector = useSelector((state) => state.auth);
  const formik = useFormik({
    initialValues: {
      task: value.task,
      status: value.status,
      datestart: value.datestart,
      dateend: value.dateend,
      timestart: value.timestart,
      timeend: value.timeend,
      deadline: value.deadline,
      deadlinetime: value.deadlinetime,
    },
    onSubmit: async (values) => {
      const temp = { ...values };
      await api
        .patch(`taskTodo/${value.id}`, temp)
        .catch((err) => console.log(err));
      fetchTask();
      handleClose();
    },
  });
  return (
    <>
      <Modal show={modalState === "modal-one"} onHide={handleClose}>
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
                value={formik.values.task}
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
                value={formik.values.deadline}
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
                value={formik.values.deadlinetime}
                autoFocus
                onChange={formik.handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start date</Form.Label>
              <Form.Control
                type="date"
                name="datestart"
                id="datestart"
                value={formik.values.datestart}
                autoFocus
                onChange={formik.handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start time</Form.Label>
              <Form.Control
                type="time"
                name="timestart"
                id="timestart"
                value={formik.values.timestart}
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
            Apply changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function ModalAddSubtask({ handleClose, fetchSubtask, modalState, value }) {
  const userSelector = useSelector((state) => state.auth);
  const formik = useFormik({
    initialValues: {
      task_id: value.id,
      email: value.email,
      subtask: "",
      status: "ongoing",
      datestart: "",
      dateend: "",
      timestart: "",
      timeend: "",
      deadline: "",
      deadlinetime: "",
    },
    validationSchema: Yup.object().shape({
      subtask: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      const temp = { ...values };
      temp.datestart = new Date().toISOString().split("T")[0];
      temp.timestart = new Date().toString().split(" ")[4];
      await api.post(`subtaskTodo`, temp);
      fetchSubtask();
      handleClose();
    },
  });
  return (
    <>
      <Modal show={modalState === "modal-two"} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add subtask to do</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Task</Form.Label>
              <Form.Control
                as="textarea"
                id="subtask"
                name="subtask"
                value={formik.values.task}
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
                value={formik.values.deadline}
                autoFocus
                onChange={formik.handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deadline time</Form.Label>
              <Form.Control
                type="time"
                name="deadlinetime"
                id="deadlinetime"
                value={formik.values.deadlinetime}
                autoFocus
                onChange={formik.handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start date</Form.Label>
              <Form.Control
                type="date"
                name="datestart"
                id="datestart"
                value={formik.values.datestart}
                autoFocus
                onChange={formik.handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start time</Form.Label>
              <Form.Control
                type="time"
                name="timestart"
                id="timestart"
                value={formik.values.timestart}
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
            Apply changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
