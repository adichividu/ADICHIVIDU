import React from 'react'
import { Avatar } from '@material-ui/core';
import {useAuthState} from 'react-firebase-hooks/auth';
import { auth } from '../SERVICES/firebasse';
import "../CSS/Navbar.css"

function Navbar() {
    const [user]=useAuthState(auth)
    const signout=()=>{auth.signOut()}

    return (
        <div className="Navbar">      
      <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">

      <h1 className="heading font-weight-bolder ml-2 mt-">AV<span className="nav-head-span-1">K</span><span className="nav-head-span-2">ONNECT</span>{/*<span className="sub-brand-name text-253C78 font-weight-bolder text-white">Chat</span>*/}</h1>

<a href="whatsapp://send?text=Share this with all your AVKian friends! lets grow this community together guys! https://adichividu.netlify.app -By Students For Students." class="badge px-2 py-1" id="wa-share-btn" data-action="share/whatsapp/share"  
        target="_blank"><i class="fa fa-whatsapp font-weight-bolder" aria-hidden="true"></i> Share</a>
    
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

<div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav ml-auto">
        <li class="nav-item mx-2 d-inline-flex">
            <img className="avatar" src={user.photoURL} />
            <button type="button" class="btn"><span className="user-name">{user.displayName}</span></button>
        </li>
        <li class="nav-item mx-2">
          <button id="signoutbtn" className="btn btn-sm" onClick={signout}>
            <b>
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" class="bi bi-box-arrow-right mr-2" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                </svg>
                <span className="signout-btn-text">Logout</span>
            </b>
          </button>
        </li>
    </ul>
</div>
</nav>
</div>
    )
}

export default Navbar