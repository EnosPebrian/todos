import { Col } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import { Svg_delete } from "./SVG";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useState } from "react";
import api from "../json-server/api";
export const SubtaskTodoList = ({ val, idx, fetchSubtask }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function handleDelete() {
    if (window.confirm("are you sure want to delete this subtask?")) {
      await api.delete(`subtaskTodo/${val.id}`);
      fetchSubtask();
    }
  }
  return (
    <>
      <ListGroup.Item
        key={idx}
        className="d-flex"
        style={{ gap: "5px", marginLeft: "36px" }}
      >
        <Col xxl={0.5} className="border-end border-secondary px-1">
          <input type="checkbox" name="status" id={val?.id} />
        </Col>
        <Col onClick={handleShow} style={{ cursor: "pointer" }}>
          {val?.subtask}
        </Col>
        {/* <Col xxl={2}>{val.datestart}</Col> */}
        {/* <Col xxl={2}>{val.timestart}</Col> */}
        <Col xxl={2} className="d-flex justify-content-end">
          <button
            style={{
              maxWidth: "16px",
              maxHeight: "16px",
              display: "inline-block",
            }}
            onClick={handleDelete}
          >
            <Svg_delete />
          </button>
        </Col>
        <ModalEditSubtask
          handleClose={handleClose}
          show={show}
          fetchSubtask={fetchSubtask}
          value={val}
        />
      </ListGroup.Item>
    </>
  );
};

function ModalEditSubtask({ handleClose, fetchSubtask, value, show }) {
  const userSelector = useSelector((state) => state.auth);
  const formik = useFormik({
    initialValues: {
      task_id: value?.task_id,
      email: value?.email,
      subtask: value?.subtask,
      status: "ongoing",
      datestart: value.datestart,
      dateend: value.dateend,
      timestart: value.timestart,
      timeend: value.timeend,
      deadline: value.deadline,
      deadlinetime: value.deadlinetime,
    },
    validationSchema: Yup.object().shape({
      subtask: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      const temp = { ...values };
      await api.patch(`subtaskTodo/${value?.id}`, temp);
      fetchSubtask();
      handleClose();
    },
  });
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add subtask to do</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Subtask</Form.Label>
              <Form.Control
                as="textarea"
                id="subtask"
                name="subtask"
                value={formik.values.subtask}
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
