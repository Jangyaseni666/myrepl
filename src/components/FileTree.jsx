import './FileTree.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons'
const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
    const isDir = !!nodes;
    const icon = isDir?faFolder:faFile;
    return (
        <div style={{margin: '20px'}} onClick={(e)=>{
            e.stopPropagation();
            if(isDir) return;
            onSelect(path)
        }} >
            <FontAwesomeIcon icon={icon} style={{cursor: 'pointer'}} />
            {' '+fileName}   
            {nodes&&fileName !== "node_modules" &&<ul>
                {Object.keys(nodes).map((child) => {
                    return (
                        <li key={child} style={{cursor: 'pointer'}}>
                            <FileTreeNode onSelect={onSelect} fileName={child} path={path+"/"+child} nodes={nodes[child]} />
                        </li>
                    )
                })}
            </ul>}
        </div>
    )
}
const FileTree = ({ tree, onSelect }) => {
    return (
        <div>
            <FileTreeNode onSelect={onSelect} fileName={'/'} path={""} nodes={tree} />
        </div>
    )
}

export default FileTree
