import { Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { SVGjam, Svg_plus } from "../components/SVG";
import { useSelector } from "react-redux";
import api from "../json-server/api";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import { TaskTodoList } from "./taskTodoLIST";
export const MainBody = () => {
  const [todo, setTodo] = useState([]);
  const userSelector = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const fetchTask = async () => {
    await api
      .get(`taskTodo`, { params: { email: userSelector?.email } })
      .then((res) => {
        setTodo(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchTask();
  }, []);

  return (
    <>
      <Container className="d-flex justify-content-center">
        <Card style={{ flexBasis: "36rem" }}>
          <div className="d-flex justify-content-center">
            <SVGjam />
          </div>
          <h3 className="text-center">Welcome {userSelector.fullname}</h3>
          <Card.Body>
            <button
              style={{ float: "right", maxWidth: "24px" }}
              onClick={handleShow}
            >
              <Svg_plus />
            </button>
            <Card.Title>Task to do:</Card.Title>
          </Card.Body>
          <ListGroup className="list-group-flush">
            {todo.map((task, idx) => (
              <TaskTodoList value={task} idx={idx} />
            ))}
          </ListGroup>
          <Card.Body>
            <Card.Link href="#">Card Link</Card.Link>
            <Card.Link href="#">Another Link</Card.Link>
          </Card.Body>
        </Card>
        <ModalBody
          handleClose={handleClose}
          show={show}
          fetchTask={fetchTask}
        />
      </Container>
    </>
  );
};

function ModalBody({ handleClose, show, fetchTask }) {
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
      fetchTask();
      handleClose();
    },
  });

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add new task to do</Modal.Title>
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
