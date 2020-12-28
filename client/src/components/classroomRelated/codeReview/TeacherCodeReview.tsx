import React, {useState, useEffect} from 'react'
import network from "../../../helpers/network";
require('dotenv').config({path: __dirname + '/.env'})
const jwt = require("jsonwebtoken");

export default function TeacherCodeReview() {

    interface project{
        id: number,
        name: string, 
        organizationId: number,
        updatedAt: string,
        createdAt: string
    }

    const [projects, setProjects] = useState<project[]>();
    const [newProjectName, setNewProjectName] = useState<string>();

    const getProjects = async() => {
        let {data} = await network.get("/api/v1/projects/");
        setProjects(data);
        console.log("completed request");
        
        console.log(data);
    }
    const createProject = async() => {
        let createdProject = await network.post("/api/v1/projects/", {name: newProjectName});
        console.log(createdProject);
    }
    const deleteProject = async(projectId: number) => {
        console.log("deleting project " + projectId);
        let deletedProject = await network.delete(`/api/v1/projects/${projectId}`);
        console.log(deletedProject);
    }
    useEffect(() => {
        getProjects();
    },[])
    return (projects ?
        <div>
            <form>
                <table>
                    <tr>
                        <td>Current projects:
                            <ul>
                        {projects.map((project:project) => <li>name: {project.name}<button value={project.id} onClick={() => deleteProject(project.id)}>X</button></li>)}
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td>Create Project:</td>
                        <td><input type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProjectName(e.target.value)} ></input></td>
                        <td><button onClick={() => createProject()}>Create</button></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
            </form>
        </div>:<></>
    )
}
