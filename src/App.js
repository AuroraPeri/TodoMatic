import React from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { useState,useEffect,useRef } from "react";
import { nanoid } from "nanoid";

/*function usePrevious(value) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}*/

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {

  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("All");
  let [editCount, setEditCount] = useState(0);


  useEffect(() => {
    fetch("http://localhost:8080/todo/all").then(
      (res) => { return res.json();}
    ).then((value) => {
      setTasks(value);
    })
  }, [editCount])


  function toggleTaskCompleted(id) {
    const updateTask = tasks.filter((task) => task.id == id);
    fetch("http://localhost:8080/todo/update?id=" + id + /*"&name=" + updateTask.name +*/ "&completed=" + !updateTask.completed, { method: "post" }).then(
      (res) => {
        console.log(res.text(),updateTask.completed);
        setEditCount(++editCount);
      }
    )
  }

  function deleteTask(id) {
    fetch("http://localhost:8080/todo/delete?id=" + id, { method: "post" }).then(
      (res) => {
        console.log(res.text());
        setEditCount(++editCount);}
    )
  }


  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // Copy the task and update its name
        return { ...task, name: newName };
      }
      // Return the original task if it's not the edited task
      return task;
    });
    setTasks(editedTaskList);
  }


  
  //filterbutton settings
  //set FILTER_MAP as objet

  function addTask(name) {
    fetch("http://localhost:8080/todo/add?name=" + name + "&completed=false", { method: "post"}).then((res) => {
      console.log(res.text());
      setEditCount(++editCount);
    } )
  }


  

  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));
  
  
  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;



  /*const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);*/


  
  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask}/>
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}

export default App;
