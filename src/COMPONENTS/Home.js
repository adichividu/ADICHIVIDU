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
    const [placeholder,setplaceholder]=useState('Type something...')
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
      <br/>
      {/* POSTS OF USERS */}
      <div className="posts">
        <br/><br/>
        {pdf.length>0?pdf.map((post) => <  >
        <div key={post.key} className={"form "+(post.uid===user.uid?"if true":"if false")}>

          {/* USER-AVATAR */}
          {/*<Avatar key={post.key} className={"avatar ml-1 "+(post.uid===user.uid?"avatar-true":"avatar-false")} src={post.photourl} />*/}
          {/*<Avatar key={post.key} className={"avatar ml-1 "+(post.uid===user.uid?"avatar-true":"avatar-false")} src={profileimg} />*/}

          <div key={post.key} className={"nav-tab ml-1"/* +(post.uploadedby===user.displayName?"if true":"if false") */} align="left">
            {/*<span key={post.key} className={"user-info text-monospace " +(post.uploadedby===user.displayName?"if true":"if false") }>{post.uploadedby}</span>*/}

            <div key={post.key} className={"nav-link mb-3 "+(post.uid===user.uid?"if tru":"if fals")}>
            <div className="grid clearflix" style={{rowGap: "0"}}>
            {post.url?<a href={post.url} ><img src={post.url} className={"user-sent-img g-col-6"} width="144" height="144" align="center"/></a>:<div></div>}
              <br/>
              <a key={post.key} className={"file-info g-col-6 " +(post.uploadedby===user.displayName?"if true":"if false") } >
                {(post.name).toUpperCase()}
                </a>

              <br/>
              </div>
              {/*<span key={post.key} className={"date text-monospace "/* +(post.uploadedby===user.displayName?"if true":"if false") */}{/*}>{post.uploadedon}</span>*/}

            </div>
          </div>
        </div>
        </>):<h2 className="no-message-box mt-5 pt-5" align="center" style={{color:'#FFFF00', FontWeight:'bolder'}} ><b>NO MESSAGES :( </b></h2>}
      </div>

      {/* MESSAGE-TYPING-FIELD */}
      <div className="message-typing-box">

        <nav className="navbar fixed-bottom navbar-expand-sm" id="message-typing-box">
          <h5 className="text mr-1" style={{color:"rgb(0,228,114)"}} >{''}</h5>
          <div className="input-group">

            {/* TEXT-FIELD */}
            <input type="text" className="form-control mt-3" placeholder={placeholder} onFocus={placeholdersetter} onBlur={()=>{setplaceholder("Type something...")}} value={name} onChange={(e)=>{setname(e.target.value)}} />

            {/* FILE-IMPORT-BUTTON */}
            <input type="file" id="file" accept=""  onChange={(e)=>{setimage(e.target.files[0])}}/>
            <label for="file" className="file-btn-label text-dark">
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-paperclip" viewBox="0 0 16 16">
                <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
              </svg>
            </label>

            {/* SEND-BUTTON */}
        {sendin?<button className="button-send btn-group-sm" onClick={upload}><i className="fa fa-send pt-1"></i></button>:<div style={{marginTop:"17px",marginLeft:"5px"}} class="spinner-border text-light " role="status">
  <span  class="sr-only">Loading...</span>
</div>}
          </div>
        </nav>
      </div>
    </div>
        
    )
}

export default Home;