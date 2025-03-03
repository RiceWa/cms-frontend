import React from "react";
import "../styles/main.scss";

const PostCard = ({ post, onEdit, onDelete, token }) => {
    return (
      <div className="post-card">
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        
        {/* Show edit/delete buttons only if logged in */}
        {token && (
          <div className="actions">
            <button className="btn edit" onClick={() => onEdit(post)}>Edit</button>
            <button className="btn delete" onClick={() => onDelete(post._id)}>Delete</button>
          </div>
        )}
      </div>
    );
  };
  
  export default PostCard;  