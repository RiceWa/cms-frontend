import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.scss";

const Home = () => {
    const [latestPost, setLatestPost] = useState(null);
    const [latestProject, setLatestProject] = useState(null);

    useEffect(() => {
        // Fetch latest blog post
        fetch("http://localhost:5000/api/posts")
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) setLatestPost(data[data.length - 1]);
            });

        // Fetch latest project
        fetch("http://localhost:5000/api/projects")
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) setLatestProject(data[0]); // Get the newest project
            })
            .catch(error => console.error("Error fetching latest project:", error));
    }, []);

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero">
                <h1>Welcome to My Digital Playground 🚀</h1>
                <p>A collection of my thoughts, code, and progress.</p>
            </section>

            {/* Live Content Feeds */}
            <section className="content-feed">
                <div className="latest-update">
                    <h2>📜 Latest Blog Post</h2>
                    {latestPost ? (
                        <div className="card">
                            <h3>{latestPost.title}</h3>
                            <p>{latestPost.content.substring(0, 100)}...</p>
                            <Link to="/posts">Read More</Link>
                        </div>
                    ) : (
                        <p>No posts yet.</p>
                    )}
                </div>

                <div className="latest-project">
                    <h2>🚧 Current Project</h2>
                    {latestProject ? (
                        <div className="card">
                            <h3>{latestProject.title}</h3>
                            <p>{latestProject.description.substring(0, 100)}...</p>
                            {latestProject.link && (
                                <a href={latestProject.link} target="_blank" rel="noopener noreferrer">
                                    View Project
                                </a>
                            )}
                        </div>
                    ) : (
                        <p>No projects yet.</p>
                    )}
                </div>
            </section>

            {/* About Me */}
            <section className="about">
                <h2>👨‍💻 About Me</h2>
                <p>Hey, my name is James, a developer trying out many languages.</p> 
                <p>Currently exploring mobile development and refining my skills in Python and web development.</p>
            </section>
        </div>
    );
};

export default Home;
