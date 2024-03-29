import { isEmpty, size } from 'lodash';
import React, { useState, useEffect } from 'react';
/* import shortid from 'shortid'; */
import { addDocument, deleteDocument, getCollection, updateDocument } from './actions';

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState("");
  const [error, setError] = useState(null);

  // debe mostrar la data luego de cargada la pagina
  useEffect(()=>{
    (async () =>{
        const result = await getCollection('tasks');
        //console.log(result);
        if (result.statusResponse){
          setTasks(result.data);
        }
    })()
  }, [])

  const validForm = () =>{
    let isValid = true;
    setError(null);
    if(isEmpty(task)){      
      setError("You must add a Task");
      isValid = false;
    }
    return isValid;
  }
  const addTask = async (e) => {
    e.preventDefault();
    if(!validForm()){
      return;
    }
   /*  const newTask = {
      id : shortid.generate(),
      name: task
    };
    setTasks([...tasks, newTask]); */
    const result = await addDocument("tasks" ,{ name:task });
    if (!result.statusResponse){
      setError(result.error);
      return;
    }
    setTasks([...tasks, {id: result.data.id, name: task}]);
    setTask("");
  }
  const saveTask = async (e) => {
    e.preventDefault();
    if(!validForm()){
      return;
    }
    const result = await updateDocument("tasks", id, { name:task });
    if(!result.statusResponse){
       setError(result.error);
       return;
    }
    const editedTasks = tasks.map(item => item.id === id ? {id, name: task} : item);
    setTasks(editedTasks);
    setEditMode(false);
    setTask("");
    setId("");
  }
  const deleteTask = async (id) => {
    const result = await deleteDocument('tasks', id);
    if (!result.statusResponse){
      setError(result.error);
      return;
    }
    const filteredTasks = tasks.filter(task=>task.id !== id);
    setTasks(filteredTasks);
  }
  const editTask = (task) => {
    setTask(task.name);
    setEditMode(true);
    setId(task.id);
  }
  return (
    <div className="container mt-5">
     <h1>Tasks</h1>
     <hr/>
     <div className="row">
       <div className="col-8">
          <h4 className="text-center">Task List</h4>
          { 
            size(tasks) === 0 ? (
              /* <h5 className="text-center"> Aun no hay lista de tareas programadas </h5> */
              <li className="list-group-item">There is not proggrammed task List</li>
            ) : (
              <ul className="list-group">
              {
                tasks.map((task)=>(
                  <li className="list-group-item" key={task.id}>
                    <span className="lead">{task.name}</span>
                    <button
                        className="btn btn-danger btn-sm float-right mx-2"
                        onClick={()=>deleteTask(task.id)}
                    >Delete
                    </button>
                    <button
                        className="btn btn-warning btn-sm float-right"
                        onClick={()=> editTask(task)}
                    >Edit
                    </button>
                  </li>
                ))
              }
              </ul>
            )
          }
       </div>
       <div className="col-4">
          <h4 className="text-center">
            {
              editMode ? "Edit your Tasks" : "Input your Tasks"
            }              
          </h4>
          <form onSubmit = { editMode ? saveTask : addTask}>
            {
              error && <span className="text-danger">{error}</span>
            }
            <input 
            type="text"
            className="form-control mb-2" 
            placeholder='Input the task'
            onChange={(text) => setTask(text.target.value)}
            value={task}/>
            <button
                className={ editMode ? "btn btn-warning btn-block" : "btn btn-dark btn-block" }
                type="submit"
            > { editMode ? "Save" : "Add" }
            </button>
          </form>
       </div>
    </div>
    </div>
  );
}

export default App;
