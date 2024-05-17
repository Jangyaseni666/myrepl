import { useCallback, useEffect, useState } from 'react'
import './App.css'
import Terminal from './components/Terminal'
import FileTree from './components/FileTree';
import socket from './socket';
import AceEditor from 'react-ace'

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
function App() {
  const [fileTree, setFileTree] = useState({});
  const [selectedFile, setSelectedFile] = useState('');
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [code, setCode] = useState("")
  const getFileTree = async () => {
    const response = await fetch('https://42a7c88a-5c2b-4150-a57a-06da458f157b-00-22d2lrsqd0mwo.worf.replit.dev/files');
    const result = await response.json();
    setFileTree(result.tree)
  }

  const isSaved = selectedFileContent === code;

  const getFileContent = useCallback(async () => {
    if(!selectedFile) return;
    const res = await fetch(`https://42a7c88a-5c2b-4150-a57a-06da458f157b-00-22d2lrsqd0mwo.worf.replit.dev/files/content?path=${selectedFile}`);
    const result = await res.json();
    setSelectedFileContent(result.content)
    // console.log(result.content)

  },[selectedFile])

  useEffect(()=>{
    if(selectedFile) getFileContent();
  },[getFileContent, selectedFile])

  useEffect(() => {
    getFileTree();
  }, [])

  useEffect(()=>{
    setCode("")
  },[selectedFile])

  useEffect(()=>{
    setCode(selectedFileContent)
  },[selectedFileContent])

  useEffect(() => {
    socket.on('file:refresh', getFileTree);
    return () => {
      socket.off('file:refresh', getFileTree)
    }
  }, [])

  useEffect(() => {
    if (!isSaved && code) {
      const timer = setTimeout(() => {
        console.log('Save code ', code);
        socket.emit('file:change',{
          path: selectedFile,
          content: code
        })
      }, 5 * 1000)
      return () => {
        clearTimeout(timer);
      }
    }
  }, [code, selectedFile, isSaved])

  return (
    <div className='playground'>
      <div className='editor-container'>
        <div className='files'>
          <FileTree tree={fileTree} onSelect={(path) => { setSelectedFile(path)}} />
        </div>
        <div className='editor'>
          {selectedFile && <p>{selectedFile.replaceAll('/', '>')} {isSaved?'Saved':'Unsaved'}</p>}
          <AceEditor value={code} onChange={(e) => setCode(e)} />
        </div>
      </div>
      <div className='terminal'>
        <Terminal />
      </div>
    </div>
  )
}

export default App
