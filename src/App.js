import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/posts")
            .then(response => {
                console.log("API Response:", response.data);  // Debugging
                setPosts(response.data);
            })
            .catch(error => console.error("Error fetching posts:", error));
    }, []);

    return (
        <div>
            <h1>My CMS Posts</h1>
            {posts.length > 0 ? (
                posts.map(post => (
                    <div key={post._id}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                    </div>
                ))
            ) : (
                <p>No posts available.</p>
            )}
        </div>
    );
};

export default App;
