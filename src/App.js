import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import PostCard from "./components/PostCard";
import ProjectCard from "./components/ProjectCard"; // ✅ Import ProjectCard
import Login from "./components/Login"; 
import Home from "./pages/Home";

const App = () => {
    const [projects, setProjects] = useState([]);
    const [posts, setPosts] = useState([]); // ✅ Add posts state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [message, setMessage] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token") || ""); 
    const [editingProject, setEditingProject] = useState(null);
    const [editingPost, setEditingPost] = useState(null); // ✅ Add post editing state

    useEffect(() => {
        fetchProjects();
        fetchPosts(); // ✅ Fetch posts as well
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/projects");
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/posts");
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken("");
    };

    // Handle project creation/editing
    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) {
            setMessage("Title and description are required.");
            return;
        }

        try {
            const projectData = {
                title,
                description,
                link,
                category,
                tags: tags.split(",").map(tag => tag.trim())
            };

            if (editingProject) {
                await axios.put(`http://localhost:5000/api/projects/${editingProject}`, projectData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEditingProject(null);
                setMessage("Project updated successfully!");
            } else {
                await axios.post("http://localhost:5000/api/projects", projectData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage("Project created successfully!");
            }

            setTitle("");
            setDescription("");
            setLink("");
            setCategory("");
            setTags("");
            fetchProjects();
        } catch (error) {
            setMessage("Error saving project. Are you logged in?");
        }
    };

    const handleProjectEdit = (project) => {
        setTitle(project.title);
        setDescription(project.description);
        setLink(project.link || "");
        setCategory(project.category || "");
        setTags(project.tags ? project.tags.join(", ") : "");
        setEditingProject(project._id);
    };

    const handleProjectDelete = async (projectId) => {
        try {
            await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Project deleted successfully!");
            fetchProjects();
        } catch (error) {
            setMessage("Error deleting project.");
        }
    };

    // Handle post creation/editing
    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) {
            setMessage("Title and content are required.");
            return;
        }

            // ✅ Debugging: Log what is being sent
    console.log("📌 Submitting Post:");
    console.log("Title:", title);
    console.log("Content:", description);
    console.log("Category:", category || "Uncategorized");
    console.log("Tags:", tags.split(",").map(tag => tag.trim()));
    console.log("Token being sent:", token);

        try {
            const postData = {
                title,
                content: description,
                category: category || "Uncategorized",
                tags: tags.split(",").map(tag => tag.trim())
            };

            if (editingPost) {
                await axios.put(`http://localhost:5000/api/posts/${editingPost}`, postData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEditingPost(null);
                setMessage("Post updated successfully!");
            } else {
                await axios.post("http://localhost:5000/api/posts", postData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage("Post created successfully!");
            }

            setTitle("");
            setDescription("");
            setCategory("");
            setTags("");
            fetchPosts();
        } catch (error) {
            setMessage("Error saving post. Are you logged in?");
        }
    };

    const handlePostEdit = (post) => {
        setTitle(post.title);
        setDescription(post.content);
        setCategory(post.category || "");
        setTags(post.tags ? post.tags.join(", ") : "");
        setEditingPost(post._id);
    };

    const handlePostDelete = async (postId) => {
        try {
            await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Post deleted successfully!");
            fetchPosts();
        } catch (error) {
            setMessage("Error deleting post.");
        }
    };

    return (
        <Router>
            <Navbar token={token} onLogout={handleLogout} />
            <div className="container">
                {message && <p>{message}</p>}
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/projects" element={
                        <>
                            {projects.length > 0 ? (
                                projects.map(project => (
                                    <ProjectCard key={project._id} project={project} onEdit={handleProjectEdit} onDelete={handleProjectDelete} token={token} />
                                ))
                            ) : (
                                <p>No projects available.</p>
                            )}

                            {token && (
                                <form onSubmit={handleProjectSubmit}>
                                    <h2>{editingProject ? "Edit Project" : "Create a New Project"}</h2>
                                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    <br />
                                    <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                                    <br />
                                    <input type="text" placeholder="Project Link (optional)" value={link} onChange={(e) => setLink(e.target.value)} />
                                    <br />
                                    <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
                                    <br />
                                    <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
                                    <br />
                                    <button type="submit">{editingProject ? "Update Project" : "Create Project"}</button>
                                </form>
                            )}
                        </>
                    } />

                    {/* ✅ Add the /posts route */}
                    <Route path="/posts" element={
                        <>
                            {posts.length > 0 ? (
                                posts.map(post => (
                                    <PostCard key={post._id} post={post} onEdit={handlePostEdit} onDelete={handlePostDelete} token={token} />
                                ))
                            ) : (
                                <p>No posts available.</p>
                            )}

                            {token && (
                                <form onSubmit={handlePostSubmit}>
                                    <h2>{editingPost ? "Edit Post" : "Create a New Post"}</h2>
                                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    <br />
                                    <textarea placeholder="Content" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                                    <br />
                                    <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
                                    <br />
                                    <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
                                    <br />
                                    <button type="submit">{editingPost ? "Update Post" : "Create Post"}</button>
                                </form>
                            )}
                        </>
                    } />
                    <Route path="/login" element={<Login setToken={setToken} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
