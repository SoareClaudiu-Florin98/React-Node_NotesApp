import React, { useContext, useState } from 'react'
import './Sidebar.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDown,faSearch,faPlus,faStar, faStickyNote,faTrash, faThumbsUp} from '@fortawesome/free-solid-svg-icons'
import {NavLink, useHistory} from 'react-router-dom'
import { postRequest } from '../../util/apiRequests';
import { BASE_URL,CREATE_NOTE} from '../../util/apiEndpoints';
import {NotesContext} from './../../context/context'


const Sidebar= ()=>{
const notesContext= useContext(NotesContext) ; 
const history = useHistory() ; 
const [error,setError] = useState(null) ; 

const handleButtonCreate = async()=>{
    const response = await postRequest(`${BASE_URL}${CREATE_NOTE}`);
    console.log(response) ;
    if(response.error){
        setError(response.error) ; 
        return false ; 
    } 
    if(response._id){
        notesContext.notesDispatch({type:'createNoteSuccess',payload: response}) ; 
        history.push({
            pathname:`/all-notes/${response._id}`,
            note:response
        })
    }
}
  return (
    <div className="sidebar">
        <div className="sidebar_top">
            <div className="sidebar_profile">
                <div className="profile_icon">
                    A
                </div>
                <div className="profile_title">
                    Claudiu Soare
                    <FontAwesomeIcon className="icon" icon = {faAngleDown} />
                </div>
            </div>
            <div className= "search">
                <div className= "search_block">
                    <FontAwesomeIcon id="iconSearch" icon = {faSearch}/>
                    <input id= "input" placeholder="Cauta"/>
                </div>
            </div>
            <div className= "sidebare_new_note">
                <div className= "create_note_button" onClick={handleButtonCreate}>                
                <FontAwesomeIcon id="iconAdd" icon={faPlus}/>
                <div className="note_title">
                    <strong>Adauga notita</strong>
                </div>
                </div>
            </div>
            <hr id="horizontalLine"></hr>
            <div className="sidebar_menu">
                 <ul>
                     <li>
                        <NavLink to ="/dummy">
                            <FontAwesomeIcon className="iconDummy" icon={faStar} />  
                            Exemplu                    
                       </NavLink>

                     </li>
                     <li>
                        <NavLink to="/all-notes">
                            <FontAwesomeIcon className="iconAllNotes" icon={faStickyNote}/>
                            Toate notitele
                        </NavLink>

                     </li>
                     <li>
                        <NavLink to="/trash">
                            <FontAwesomeIcon className="iconTrash" icon={faTrash}/>
                            Cos de gunoi
                        </NavLink>
                     </li>
                 </ul>
            </div>
            <hr id="horizontalLine"></hr>
        </div>
        <footer className= "teamName">
            <FontAwesomeIcon className="ItxperienceIcon" icon={faThumbsUp}></FontAwesomeIcon>
                Itxperience
        </footer>
    </div>
  );
}

export default Sidebar;