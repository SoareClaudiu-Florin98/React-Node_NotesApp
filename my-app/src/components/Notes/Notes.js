import React,{Component, useContext, useEffect, useReducer, useState} from 'react'
import './Notes.css';
import{useRouteMatch, useHistory, NavLink} from "react-router-dom"
import { GET_ALL_NOTES,BASE_URL,GET_TRASH_NOTES } from '../../util/apiEndpoints';
import { getRequest } from '../../util/apiRequests';
import { NotesContext } from '../../context/context';
import Note from '../Note/Note';
import { listFormatDate } from './../../util/helpers';

const Notes = (props) =>{
     const[error,setError] = useState(null) ; 
     const notesContext = useContext(NotesContext) ; 
     const {title} = props ; 
     const history = useHistory() ; 
     const match = useRouteMatch() ; 
     useEffect(()=>{
          getNotes() ; 
     },[match.url])

     const getNotes = async () => {
          let endpoint = '';
          if (match.url == '/all-notes') {
              endpoint = GET_ALL_NOTES;
          } else if (match.url == '/trash') {
              endpoint = GET_TRASH_NOTES;
          } else {
              return;
          }
  
          const response = await getRequest(`${BASE_URL}${endpoint}`)
          if (response.error) {
              setError(response.error);
              return false;
          }
          notesContext.notesDispatch({ type: 'getAllNotesSuccess', payload: response });
          if (response.length > 0) {
              history.push({
                  pathname: `${match.url}/${response[0]._id}`,
                  note: response[0]
              })
          }
      }
  return (
    <div className="AllTheNotes">
         <div className="TopNotesList">
              <div className="TopNotesListTitle">
                  {title}
              </div>
              <div className="TopNotesListTitle2">
                  <div className="TopNotesListNumber">                       
                   {notesContext.notesState.length} notite
                  </div>
              </div>
         </div>
         <div class="MiddleNotesList">
              {
              notesContext.notesState.length >0 ? notesContext.notesState.map((note)=>(
               <NavLink key = {note._id} className="MiddleNotesListPreview"
                to ={
                    {
                    pathname:`${match.url}/${note._id}`,
                    note                  
                    }                  
               }>
               <div class="MiddleNotesListPreviewHead">
                    <div class="MiddleNotesListPreviewHead_NoteTitle">{note.title}</div>
                    <div class="MiddleNotesListPreviewHead_NoteDescription">{note.description}</div>
               </div>
               <div class="MiddleNotesListPreviewBottom_Date">
                   {listFormatDate(note.updatedDate)}</div>
               </NavLink>
              )
                    
              ):<div className="emptyState">Nu avem date </div>
               }

         </div>

    </div>
  );
}

export default Notes;