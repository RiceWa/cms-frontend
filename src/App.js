import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import PostCard from "./components/PostCard";
import Login from "./components/Login"; 
import Home from "./pages/Home";
import Projects from "./pages/Projects";

const App = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState(""); // ✅ New state for category
    const [tags, setTags] = useState(""); // ✅ New state for tags (comma-separated)
    const [message, setMessage] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token") || ""); 
    const [editingPost, setEditingPost] = useState(null); 

    useEffect(() => {
        fetchPosts();
    }, []);

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

    // Handle post creation/editing
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) {
            setMessage("Title and content are required.");
            return;
        }

        try {
            const postData = {
                title,
                content,
                category,
                tags: tags.split(",").map(tag => tag.trim()) // ✅ Convert tags string to an array
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
            setContent("");
            setCategory(""); // ✅ Reset category
            setTags(""); // ✅ Reset tags
            fetchPosts();
        } catch (error) {
            setMessage("Error saving post. Are you logged in?");
        }
    };

    const handleEdit = (post) => {
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category || ""); // ✅ Prefill category
        setTags(post.tags ? post.tags.join(", ") : ""); // ✅ Convert array to string for editing
        setEditingPost(post._id);
    };

    const handleDelete = async (postId) => {
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
                    <Route path="/projects" element={<Projects token={token} />} />
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/posts" element={
                        <>
                            {posts.length > 0 ? (
                                posts.map(post => (
                                    <PostCard key={post._id} post={post} onEdit={handleEdit} onDelete={handleDelete} token={token} />
                                ))
                            ) : (
                                <p>No posts available.</p>
                            )}

                            {/* Show post creation form only if logged in */}
                            {token && (
                                <form onSubmit={handleSubmit}>
                                    <h2>{editingPost ? "Edit Post" : "Create a New Post"}</h2>
                                    <input 
                                        type="text" 
                                        placeholder="Title" 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)} 
                                        required 
                                    />
                                    <br />
                                    <textarea 
                                        placeholder="Content" 
                                        value={content} 
                                        onChange={(e) => setContent(e.target.value)} 
                                        required
                                    ></textarea>
                                    <br />
                                    <input 
                                        type="text" 
                                        placeholder="Category" 
                                        value={category} 
                                        onChange={(e) => setCategory(e.target.value)} 
                                    />
                                    <br />
                                    <input 
                                        type="text" 
                                        placeholder="Tags (comma-separated)" 
                                        value={tags} 
                                        onChange={(e) => setTags(e.target.value)} 
                                    />
                                    <br />
                                    <button type="submit">{editingPost ? "Update Post" : "Create Post"}</button>
                                    {editingPost && <button onClick={() => setEditingPost(null)}>Cancel</button>}
                                </form>
                            )}
                        </>
                    } />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
