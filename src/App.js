import React,{useState} from 'react';
import Histogram from './containers/Histogram';
import './navbar.css';
import Navbar from './containers/Navbar';

function App() {
  const[mode,setMode]=useState('light');
  const toggleMode= ()=>{
    if(mode==='light'){  
      setMode('dark');
      document.body.style.backgroundColor='black';
    }
    else{ setMode('light'); document.body.style.backgroundColor='white';}
  }
  return (
    <>
    <Navbar mode={mode} toggleMode={toggleMode}/>
    <div> <Histogram /> </div>
    </>
    
  );
}

export default App;
