import React from "react";
import "../styles/main.scss";

const ProjectCard = ({ project, onEdit, onDelete, token }) => {
    return (
        <div className="post-card">
            <h2>{project.title}</h2>
            <p>{project.description}</p>

            {/* ✅ Display category if available */}
            {project.category && (
                <p><strong>Category:</strong> {project.category}</p>
            )}

            {/* ✅ Display tags if available */}
            {project.tags && project.tags.length > 0 && (
                <p><strong>Tags:</strong> {project.tags.join(", ")}</p>
            )}

            {/* ✅ Display link if available */}
            {project.link && (
                <p>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                        View Project
                    </a>
                </p>
            )}

            {/* Show edit/delete buttons only if logged in */}
            {token && (
                <div className="actions">
                    <button className="edit" onClick={() => onEdit(project)}>Edit</button>
                    <button className="delete" onClick={() => onDelete(project._id)}>Delete</button>
                </div>
            )}
        </div>
    );
};

export default ProjectCard;
