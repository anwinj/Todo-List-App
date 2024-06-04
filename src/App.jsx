import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import { collection, onSnapshot, query, updateDoc ,doc, addDoc, deleteDoc } from 'firebase/firestore'
import {db} from './firebase'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [incompleteTodos,setIncompleteTodos] = useState([])
  const [completeTodos,setCompleteTodos] = useState([])
  const [input,setInput] = useState("")

  useEffect(()=>{
    readTodo()
  },[])

  // create todo
  const createTodo = async (e)=>{
    e.preventDefault(e)
    if(input ===""){
      toast.warning("Please fill the form!!!")
    }
    else{
      await addDoc(collection(db,'todos'),{
        text: input,
        completed: false,
      })
      setInput("")
    }
    
  }

  // read todo from firebase
  const readTodo = ()=>{
    const q = query(collection(db,'todos'))  
    const unsubscribe = onSnapshot(q, (querySnapshot)=>{
      let todosArr = []
      querySnapshot.forEach((doc)=>{
        todosArr.push({...doc.data(),id:doc.id})
      })
      const filterIncompletedTodos = todosArr.filter(todo => !todo.completed);
      setIncompleteTodos(filterIncompletedTodos)
      const filterCompletedTodos = todosArr.filter(todo => todo.completed);
      setCompleteTodos(filterCompletedTodos)
      // console.log(incompleteTodos,completeTodos);
    })
    return ()=>unsubscribe()
  }

  // update todo status in firebase
  const toggleComplete = async(todo)=>{
    await updateDoc(doc(db,'todos',todo.id),{
      completed : true
    })
  }

  // delete todo
  const deleteTodo = async (id)=>{
    await deleteDoc(doc(db,'todos',id))
  }

  return (
    <div className='w-full h-svh lg:h-screen bg-slate-800'>
      {/* heading */}
      <div className='text-center p-4'>
        <h1 className='text-4xl text-white font-thin'>Todo List</h1>
        <p className='mt-1 ms-2 font-light text-slate-400'>Add your tasks and manage the progress of it.</p>
      </div>

      {/* todo section */}
      <div className='max-w-11/12 h-5/6 bg-white rounded-2xl my-2 mx-4'>
        {/* add section */}
        <form onSubmit={createTodo} className='pt-6 flex justify-center items-center'>
          <input value={input} onChange={(e)=>setInput(e.target.value)} className='bg-slate-100 px-3 py-3 rounded-xl w-64 lg:w-96 focus:outline-none placeholder:font-light' type="text" placeholder='Type your task' />
          <button onClick={createTodo} className='ms-3 bg-slate-800 text-white px-3 py-2 rounded-xl'><i className="fa-solid fa-plus"></i></button>
        </form>

        <div className='flex flex-col lg:flex-row lg:justify-evenly mt-8 px-5'>
          {/* pending section */}
          <div className='mb-5 lg:mb-0'>
            {/* pending heading */}
            <div className='flex justify-between items-center text-slate-800'>
              <h2 className='text-xl'>Pending tasks</h2>
              <i className="fa-solid fa-list fa-lg"></i>
            </div>
            <hr className='bg-slate-300 h-px border-0 mt-2 mb-4'/>

            {/* pending content */}
            {
              incompleteTodos?.length>0?incompleteTodos.map((todo)=>(
                <div className='flex justify-between items-center mt-2'>
                  <button onClick={()=> toggleComplete(todo)} className='flex'>
                    {/* <input type="checkbox" className='w-5 h-5 accent-green-500 p-2' /> */}
                    <p className='text-slate-600 ms-4'>{todo.text}</p>
                  </button>
                  <div>
                    <button className='bg-red-300 text-white text-sm px-2 py-1 rounded-xl ms-4 lg:ms-20'>Incomplete</button>
                    <button onClick={()=>deleteTodo(todo.id)} className='text-slate-500 ms-3'><i className="fa-solid fa-trash"></i></button>
                  </div>
                </div>
              )):null
            }
            
            
          </div>
  
          {/* completed section */}
          <div>
            {/* completed heading */}
            <div className='flex justify-between items-center text-slate-800'>
              <h2 className='text-xl'>Completed tasks</h2>
              <i className="fa-solid fa-square-check fa-lg"></i>
            </div>
            <hr className='bg-slate-300 h-px border-0 mt-2 mb-4'/>

            {/* completed content */}
            {
              completeTodos?.length>0?completeTodos.map((todo)=>(
                <div className='flex justify-between items-center mt-2'>
                  <div className='flex'>
                    <input type="checkbox" defaultChecked disabled className='w-5 h-5 p-2' />
                    <p className='text-slate-600 ms-4 line-through'>{todo.text}</p>
                  </div>
                  <div>
                    <button className='bg-green-300 text-white text-sm px-2 py-1 rounded-xl ms-4 lg:ms-20'>Completed</button>
                    <button onClick={()=>deleteTodo(todo.id)} className='text-slate-500 ms-3'><i className="fa-solid fa-trash"></i></button>
                  </div>
                </div>
              )):null
            }
            
          </div>
        </div>
        
      </div>
      <ToastContainer  autoClose={2000} theme="dark" />
    </div>
  )
}

export default App
