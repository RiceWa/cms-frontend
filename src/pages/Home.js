import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.scss";
import API_BASE_URL from "../config";

const Home = () => {
    const [latestPost, setLatestPost] = useState(null);
    const [latestProject, setLatestProject] = useState(null);

    useEffect(() => {
        // Fetch latest blog post
        fetch(`${API_BASE_URL}/api/posts`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) setLatestPost(data[0]);
            });

        // Fetch latest project
        fetch(`${API_BASE_URL}/api/projects`)
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
                <h1>Welcome to Where I Store My Coding Updates</h1>
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
                <h2> About Me</h2>
                <p>Hey, my name is James, a developer trying out many languages.</p> 
                <p>Currently exploring Kotlin and refining my skills in Python, Web Development, and German.</p>
            </section>
        </div>
    );
};

export default Home;
