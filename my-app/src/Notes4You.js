import React, {useReducer} from 'react'
import './Notes4You.css';
import './components/Sidebar/Sidebar'
import Sidebar from './components/Sidebar/Sidebar';
import Notes from './components/Notes/Notes';
import Note from './components/Note/Note';
import{
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import{NotesContext} from './context/context'
import NoteReducer from './reducer/NoteReducer'
import Login from'./Login'
const initialState= [] ; 

const Notes4You = ()=> {

  const[notes,notesDispatch] = useReducer(NoteReducer,initialState) ; 
  return (
    <Router>
      <NotesContext.Provider value = {{notesState:notes,notesDispatch}}>
    <div className="Notes4You">
      <Sidebar/>
      <Switch>
        <Route path = "/all-notes">
          <Notes title="Toate notitele"/>
          <Route path="/all-notes/:id">
          </Route>
          <Note/>
        </Route>

        <Route path = "/trash">
          <Notes title="Cos de gunoi"/>
          <Route path="/trash/:id">
          </Route>
          <Note/>
        </Route>
      </Switch>
      
    </div>
    </NotesContext.Provider>
    </Router>
  );
}

export default Notes4You;
