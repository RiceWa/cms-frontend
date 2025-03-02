import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token") || ""); // Load stored token
    const [editingPost, setEditingPost] = useState(null); // Track the post being edited

    // Fetch posts when the page loads
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

    // Handle user login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { username, password });
            localStorage.setItem("token", response.data.token); // Store token in local storage
            setToken(response.data.token);
            setMessage("Login successful!");
        } catch (error) {
            setMessage("Invalid login credentials.");
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token
        setToken(""); // Clear token in state
        setMessage("Logged out.");
    };

    // Handle post creation (Requires token)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) {
            setMessage("Title and content are required.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/posts", { title, content }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTitle("");
            setContent("");
            setMessage("Post created successfully!");
            fetchPosts();
        } catch (error) {
            setMessage("Error creating post. Are you logged in?");
        }
    };

    // Handle post deletion (Requires token)
    const handleDelete = async (postId) => {
        try {
            await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Post deleted successfully!");
            fetchPosts(); // Refresh post list
        } catch (error) {
            setMessage("Error deleting post.");
        }
    };

    // Handle editing (Prefills form with post content)
    const handleEdit = (post) => {
        setTitle(post.title);
        setContent(post.content);
        setEditingPost(post._id); // Track which post is being edited
    };

    // Handle updating a post
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!title || !content) {
            setMessage("Title and content are required.");
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/posts/${editingPost}`, { title, content }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTitle("");
            setContent("");
            setEditingPost(null); // Reset edit mode
            setMessage("Post updated successfully!");
            fetchPosts(); // Refresh post list
        } catch (error) {
            setMessage("Error updating post.");
        }
    };

    return (
        <div>
            <h1>My CMS Website</h1>
            {message && <p>{message}</p>}

            {/* Login Form */}
            {!token ? (
                <form onSubmit={handleLogin}>
                    <h2>Login</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit">Login</button>
                </form>
            ) : (
                <div>
                    <p>✅ Logged in as {username}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}

            {/* Display Posts */}
            {posts.length > 0 ? (
                posts.map(post => (
                    <div key={post._id} style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>

                        {/* Show Edit & Delete buttons if user is logged in */}
                        {token && (
                            <>
                                <button onClick={() => handleEdit(post)}>Edit</button>
                                <button onClick={() => handleDelete(post._id)}>Delete</button>
                            </>
                        )}
                    </div>
                ))
            ) : (
                <p>No posts available.</p>
            )}

            {/* Post Creation / Edit Form (Only if logged in) */}
            {token && (
                <form onSubmit={editingPost ? handleUpdate : handleSubmit}>
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
                    <button type="submit">{editingPost ? "Update Post" : "Create Post"}</button>
                    {editingPost && <button onClick={() => setEditingPost(null)}>Cancel</button>}
                </form>
            )}
        </div>
    );
};

export default App;
