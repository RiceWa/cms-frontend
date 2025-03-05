import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import ProjectCard from "../components/ProjectCard";

const Projects = ({ token }) => {
    const [projects, setProjects] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [message, setMessage] = useState("");
    const [editingProject, setEditingProject] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/projects`);
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) {
            setMessage("Title and description are required.");
            return;
        }

        try {
            if (editingProject) {
                await axios.put(`${API_BASE_URL}/api/projects/${editingProject}`, { title, description, link }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage("Project updated successfully!");
            } else {
                await axios.post(`${API_BASE_URL}/api/projects`, { title, description, link }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage("Project created successfully!");
            }
            setTitle("");
            setDescription("");
            setLink("");
            setEditingProject(null);
            fetchProjects();
        } catch (error) {
            setMessage("Error saving project.");
        }
    };

    const handleEdit = (project) => {
        setTitle(project.title);
        setDescription(project.description);
        setLink(project.link);
        setEditingProject(project._id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/projects/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    return (
        <div className="container">
            <h1>Projects</h1>
            {message && <p>{message}</p>}

            {projects.map(project => (
                <ProjectCard key={project._id} project={project} onEdit={handleEdit} onDelete={handleDelete} token={token} />
            ))}

            {token && (
                <form onSubmit={handleSubmit}>
                    <h2>{editingProject ? "Edit Project" : "Create a New Project"}</h2>
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                    <input type="url" placeholder="Project Link (optional)" value={link} onChange={(e) => setLink(e.target.value)} />
                    <button type="submit">{editingProject ? "Update Project" : "Create Project"}</button>
                    {editingProject && <button onClick={() => setEditingProject(null)}>Cancel</button>}
                </form>
            )}
        </div>
    );
};

export default Projects;
