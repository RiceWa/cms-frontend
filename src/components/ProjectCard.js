const ProjectCard = ({ project, onEdit, onDelete, token }) => {
    return (
        <div className="post-card">
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer">View Project</a>}
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
