import React,{useState,useEffect} from 'react';
import {auth, db, storage} from '../SERVICES/firebasse';
import '../CSS/Home.css';
import {useAuthState} from 'react-firebase-hooks/auth';
import { Avatar } from '@material-ui/core';
import firebase from 'firebase';
import Navbar from './Navbar'
import profileimg from '../Assets/profile.png';





function Home() {
    let today = new Date().toISOString().slice(0, 10)
    const [placeholder,setplaceholder]=useState('Compose your message....')
    const [user]=useAuthState(auth);
    const [pdf,setPdf]=useState([]);
    const[image,setimage]=useState('');
    const[name,setname]=useState('');
    const[sendin,setsendin]=useState(true)
    
    useEffect(() => {                  
      const getPostsFromFirebase = [];
      const subscriber =
      db
        .collection("chat").orderBy('createdat') 
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            getPostsFromFirebase.push({
              ...doc.data(), //spread operator
              key: doc.id, // `id` given to us by Firebase
            });
          });
          setPdf(getPostsFromFirebase);
          
        });
  
      // return cleanup function
      return () => subscriber();
    }, []);
    //useeffect end
    console.log(pdf);

    const upload = async ()=>{
      setsendin(false)

      if(image.size>2999999){
        image.value=""
        alert(`Hey ${user.displayName} We Limit The File Size To 1 MB To Provide More Study Materials Please Reduce The File Size To 1MB`)
      setsendin(true)
      }

      
      else if (image.valueOf()!=""){
        const storageRef = storage.ref();
        const fileRef = storageRef.child(image.name); 
        await fileRef.put(image);
        const downloadurl=(await fileRef.getDownloadURL());
        
        await  db.collection("chat").doc().set({
          url:downloadurl,
          uploadedby:user.displayName,
          photourl:user.photoURL,
          name:name,
          uploadedon:today,
          createdat:firebase.firestore.FieldValue.serverTimestamp(),
          uid:user.uid
          
        }).then(()=>{setsendin(true)});
        setname("");
      }
      else if (name!=""){
        await  db.collection("chat").doc().set({
          
          uploadedby:user.displayName,
          photourl:user.photoURL,
          name:name,
          uploadedon:today,
          createdat:firebase.firestore.FieldValue.serverTimestamp(),
          uid:user.uid
          
        }).then(()=>{setsendin(true)});
        setname("");
      }
      else{
        alert("Enter something a Text or upload a Image")
        setsendin(true)
      }
      };
      const placeholdersetter=()=>{setplaceholder('')}

      /* MAIN PART */
    return (
    <div className="main">
      
      {/* NAVBAR */}
      <Navbar/>
<div class="fixed-bottom" align="right">
<button style={{backgroundColor:'#FFFF00'}} type="button" class="btn border-none py-2 mr-4 mb-4" data-toggle="modal" data-target="#exampleModal">
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi text-dark bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg>
</button>
</div>

<div class="modal fade border-rounded-5" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
    <div class="modal-content" style={{backgroundColor:'#161616',borderRadius:'20px'}}>
      <div class="modal-header" style={{borderBottom:'1px solid #3b3b3b'}}>
      <h5 class="modal-title font-weight-bold text-white" id="exampleModalLabel">From: <span className="user-name ml-1">{user.displayName}</span></h5>
        
        <button type="button" class="close" id="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true" className="border-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-x-circle text-white" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
</svg>
          </span>
        </button>
      </div>
      <div class="modal-body overflow-hidden" style={{backgroundColor:'#161616'}}>
        <textarea style={{backgroundColor:'#161616',color:'#fff'}} type="text" className="form-control border-0 font-weight-bold" placeholder={placeholder} onFocus={placeholdersetter} onBlur={()=>{setplaceholder("Compose your message....")}} value={name} onChange={(e)=>{setname(e.target.value)}} rows="20" cols="100">

        </textarea>
      </div>
      <div class="modal-footer" style={{borderTop:'1px solid #3b3b3b'}}>
      <input class="btn" type="file" id="file" accept="image/x-png,image/gif,image/jpeg"  onChange={(e)=>{setimage(e.target.files[0])}} multiple/>
      <label for="file" className="file-btn-label text-dark" style={{backgroundColor:'transparent',position:'absolute',left:'0',marginBottom:'17px',marginLeft:'10px'}}>
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16" style={{color:'#FFFF00'}}>
  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
  <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
</svg>
      </label>
    
        
{sendin?<button type="button" class="btn" style={{backgroundColor:'#FFFF00', fontWeight:'bold',borderRadius:'20px'}} onClick={upload}>Publish</button>:<div  class="spinner-border text-light " role="status">
  <span  class="sr-only">Loading...</span>
</div>}
      </div>
    </div>
  </div>
</div>
      <br/>
      {/* POSTS OF USERS */}
      <div className="posts">
        <br/><br/>
        {pdf.length>0?pdf.map((post) => <  >
        <div key={post.key} className={"form "+(post.uid===user.uid?"if true":"if false")}>

          {/* USER-AVATAR */}
          
          {/*<Avatar key={post.key} className={"avatar ml-1 "+(post.uid===user.uid?"avatar-true":"avatar-false")} src={profileimg} />*/}

        <div key={post.key} className={"nav-tab mr-2 ml-1 mt-3"/* +(post.uploadedby===user.displayName?"if true":"if false") */} align="left">
          <div key={post.key} className={"nav-link mb-3 "+(post.uid===user.uid?"if tru":"if fals")}>
          
            <span key={post.key} className={"user-info font-weight-bolder " +(post.uploadedby===user.displayName?"if true":"if false") }>{post.uploadedby}</span>
            
            <div className="grid clearflix" style={{rowGap: "21"}}>
              {post.url?
              <a href={post.url} >
                <img src={post.url} className={"user-sent-img g-col-6"} width="144" height="144" align="center"/>
              </a>
              :<div></div>}
              <br/>
              <a key={post.key} className={"file-info g-col-6 " +(post.uploadedby===user.displayName?"if true":"if false")}>
                {(post.name).toUpperCase()}
              </a>
              <br/>
            </div>
              <span key={post.key} className={"date text-monospace " +(post.uploadedby===user.displayName?"if true":"if false")}>{post.uploadedon}</span>

            </div>
          </div>
        </div>
        </>):
        <h2 className="no-message-box mt-5 pt-5" align="center" style={{color:'#FFFF00', FontWeight:'bolder'}} ><b>NO MESSAGES :( </b></h2>}
      </div>

      {/* MESSAGE-TYPING-FIELD */}
      {/* <div className="message-typing-box">

        <nav className="navbar fixed-bottom navbar-expand-sm" id="message-typing-box">
          <h5 className="text mr-1" style={{color:"rgb(0,228,114)"}} >{''}</h5>
          <div className="input-group"> */}

            {/* TEXT-FIELD */}
            {/* <input type="text" className="form-control mt-3" placeholder={placeholder} onFocus={placeholdersetter} onBlur={()=>{setplaceholder("Type something...")}} value={name} onChange={(e)=>{setname(e.target.value)}} /> */}

            {/* FILE-IMPORT-BUTTON */}
            {/* <input type="file" id="file" accept=""  onChange={(e)=>{setimage(e.target.files[0])}}/>
            <label for="file" className="file-btn-label text-dark">
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-paperclip" viewBox="0 0 16 16">
                <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
              </svg>
            </label> */}

            {/* SEND-BUTTON */}
        {/* {sendin?<button className="button-send btn-group-sm" onClick={upload}><i className="fa fa-send pt-1"></i></button>:<div style={{marginTop:"17px",marginLeft:"5px"}} class="spinner-border text-light " role="status">
  <span  class="sr-only">Loading...</span>
</div>}
          </div>
        </nav>
      </div> */}
    </div>
        
    )
}

export default Home;