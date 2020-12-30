import React, {useState, useEffect} from 'react'
import network from "../../../helpers/network";
import "./TeacherCodeReview.css";
require('dotenv').config({path: __dirname + '/.env'})
const jwt = require("jsonwebtoken");

export default function TeacherCodeReview() {

    interface Project{
        id: number,
        name: string, 
        organizationId: number,
        updatedAt: string,
        createdAt: string
    }
    interface PullRequest{
        id: number | null,
        solutionRepo: string
        organizationId: number,
        projectId: number,
        userId: number,
        totalScore: number,
        updatedAt: string,
        createdAt: string
    }
    interface Rule{
        organizationId: number,
        description: string,
        correctExample: string,
        incorrectExample: string,
    }
    const emptyPr: PullRequest = {
        id: null,
        solutionRepo: "",
        organizationId: 1, // change later
        projectId: 0,
        userId: 0,
        totalScore: 0,
        updatedAt: "",
        createdAt: ""
    }
    const emptyRule: Rule = {
        organizationId: 1, // change later
        description: "",
        correctExample: "",
        incorrectExample: "",
    }
    const [projects, setProjects] = useState<Project[]>([]);
    const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number>();
    const [selectedProjectRules, setSelectedProjectRules] = useState<Rule[]>([]);

    const [newProjectName, setNewProjectName] = useState<string>();
    const [newPullRequest, setNewPullRequest] = useState<PullRequest>(emptyPr);
    
    const [newRule, setNewRule] = useState<Rule>(emptyRule);
    const [newRuleProjectId, setNewRuleProjectId] = useState<number>();

    const getProjects = async() => {
        let {data} = await network.get("/api/v1/projects/");
        setProjects(data);
        console.log(data);
    }
    const getPrs = async() => {
        let {data} = await network.get(`/api/v1/projects/by-organization/${newPullRequest.organizationId}/pull-requests`);
        setPullRequests(data);
        console.log(data);
    }
    const getProjectRules = async() => {
        let {data} = await network.get(`/api/v1/rules/${selectedProjectId}`);
        setSelectedProjectRules(data);
        console.log(data);
    }
    const createProject = async() => {
        let createdProject = await network.post("/api/v1/projects/", {name: newProjectName});
        getProjects();
    }
    const deleteProject = async(projectId: number) => {
        console.log("deleting project " + projectId);
        let deletedProject = await network.delete(`/api/v1/projects/${projectId}`);
        getProjects();
    }
    const createPr = async() => {
        setNewPullRequest((prevPr:PullRequest) => {
            prevPr.organizationId = (projects as Project[])[0].organizationId;
            return prevPr;
        })
        await network.post("/api/v1/projects/pull-requests", newPullRequest);
        getPrs();

    }
    const createRule = async() => {
        setNewRule((prevRule:Rule) => {
            prevRule.organizationId = (projects as Project[])[0].organizationId;
            return prevRule;
        })
        await network.post(`/api/v1/rules/bulk/${newRuleProjectId}`, newRule);
        getPrs();
    }
  
    const updatePr = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPullRequest((prevPr: PullRequest) => {
            const origin = e.target.id;
            switch (origin) {
                case "solutionRepo":
                    prevPr.solutionRepo = e.target.value;
                    break;
                case "userId":
                    prevPr.userId = parseInt(e.target.value);
                    break;
                case "projectId":
                    prevPr.projectId = parseInt(e.target.value);
                    break;
                case "totalScore":
                    prevPr.totalScore = parseInt(e.target.value);
                    break;
                default:
                    break;
            }
            return prevPr;
        })
    }
    const updateRule = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewRule((prevRule: Rule) => {
            const origin = e.target.id;
            switch (origin) {
                case "description":
                    prevRule.description = e.target.value;
                    break;
                case "correctExample":
                    prevRule.correctExample = e.target.value;
                    break;
                case "incorrectExample":
                    prevRule.incorrectExample = e.target.value;
                    break;
                default:
                    break;
            }
            return prevRule;
        })
    }
    const deletePr = async(pullRequestId: number, projectId: number) => {
        let deletedPr = await network.delete(`/api/v1/projects/${projectId}/pull-requests/${pullRequestId}`);
        getPrs();
    }
    useEffect(() => {
        getProjects();
        getPrs();
    },[])
    return (
        <div className="container">
            
                <div>
                    <div>
                        <h1>Projects</h1>
                        {Array.isArray(projects) &&
                        <div>Current projects:
                            <ul>
                                {projects.map((project:Project) => <li><div>project id: {project.id}</div><div> name: {project.name}<button value={project.id} onClick={() => deleteProject(project.id)}>X</button></div></li>)}
                            </ul>
                        </div>}
                    </div>
                    <div>
                        <div>Create Project:</div>
                        <div><input type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProjectName(e.target.value)} ></input></div>
                        <div><button onClick={() => createProject()}>Create</button></div>
                    </div>
                </div>
                <div>
                    
                    <div>
                        <h1>PullRequests</h1>
                        {Array.isArray(pullRequests) &&
                        <div>Current pull requests:
                            <ul>
                            
                        {pullRequests.map((pr:PullRequest) => <li>
                            <div>pull request id: {pr.id}</div>
                            <div>project id: {pr.projectId}</div>
                            <div>user id: {pr.userId}</div>
                            <div>totalScore: {pr.totalScore}</div>
                            <div>solutionRepo: {pr.solutionRepo}</div>
                            <div>organizationId: {pr.organizationId}<button value={pr.projectId as number} onClick={(e: React.MouseEvent<HTMLElement>) => deletePr((pr.id as number), (e.target as any).value)}>X</button></div></li>)}
                            </ul>
                        </div>}
                    </div>
                    <div>
                        <div>Create Pull request:</div>
                        <div><input id="solutionRepo" type="text" placeholder="Solution repo" onChange={updatePr}></input></div>
                        <div><input id="userId" type="text" placeholder="userId" onChange={updatePr}></input></div>
                        <div><input id="projectId" type="text" placeholder="projectId" onChange={updatePr}></input></div>
                        <div><input id="totalScore" type="text" placeholder="total score" onChange={updatePr}></input></div>
                        <div><button onClick={createPr}>Create Pull Request</button></div>
                    </div>
                    
                </div>
                <div>
                    <h1>Rules</h1>
                    {Array.isArray(projects) && projects.length > 0 ?
                    <div>
                        Select project:<br />
                    <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedProjectId(parseInt(e.target.value))}>
                          {projects.map((project:Project, index:number) => {
                          if(selectedProjectId === undefined && index === 0){setSelectedProjectId(project.id)}
                          return <option>{project.name}</option>
                          })}
                    </select>
                    <button onClick={() => getProjectRules()}>Show rules</button>
                    {Array.isArray(selectedProjectRules) && selectedProjectRules.length > 0 ? 
                    <ul>
                        {selectedProjectRules.map((rule: Rule) => {return <li>
                                <p>description: {rule.description}</p>
                                <p>correctExample: {rule.correctExample}</p>
                                <p>incorrectExample: {rule.incorrectExample}</p></li>})}
                    </ul>:<><h3>Does'nt have any rules yet</h3></>}
                    </div>:<></>}
                    <br></br>
                    <div>
                        <div>Create a rule:</div>
                        <div><input id="description" type="text" placeholder="description" onChange={updateRule}></input></div>
                        <div><input id="correctExample" type="text" placeholder="correctExample" onChange={updateRule}></input></div>
                        <div><input id="incorrectExample" type="text" placeholder="incorrectExample" onChange={updateRule}></input></div>
                        {Array.isArray(projects) && projects.length > 0 ?
                    <div>
                    For Project <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewRuleProjectId(parseInt(e.target.value))}>
                          {projects.map((project:Project, index:number) => {
                          if(selectedProjectId === undefined && index === 0){setSelectedProjectId(project.id)}
                          return<option value={project.id}>{project.name}</option>})}
                    </select>
                    </div>:<></>}
                        <div><button onClick={createRule}>Create Rule</button></div>
                    </div>
                </div>
            
        </div>
    )
}
