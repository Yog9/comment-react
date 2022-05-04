import React, { useEffect, useState } from "react";
import { getComments } from "../api";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { v4 as uuidv4 } from 'uuid';

const Comments = ({ currentUserId }) => {
  const [backendComments, setBackendComments] = useState([]);
  const rootComments = backendComments.filter((backendComment) => {
    return backendComment.parentId === null;
  });

  const getReplies = (commentId) => {
    return backendComments
      .filter((backendComment) => backendComment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() //asc
      );
  };

  const addComment = (text, parentId) => {
    const newComment = {
      id: uuidv4(),
      body: text,
      parentId: null,
      userId: "1",
      username: "John",
      createdAt: new Date().toISOString(), // convert date to gmt
    };
    console.log(newComment, "newComment");
    setBackendComments([newComment, ...backendComments]);
    console.log(backendComments, "backendComments");
  };

  const deleteComment = (commentId) => {
    const updatedBackendComments = backendComments.filter(
      (backendComment) => backendComment.id !== commentId
    );
    setBackendComments(updatedBackendComments)
  };

  useEffect(() => {
    setBackendComments(getComments);
  }, []);

  return (
    <div className="comments">
      <h3 className="comments-title">Comments</h3>
      <div className="comment-form-title">Write Comment</div>
      <CommentForm handleSubmit={addComment} submitLabel="Write" />
      <div className="comments-container">
        {rootComments.map((rootComment) => {
          return (
            <Comment
              key={rootComment.id}
              comment={rootComment}
              replies={getReplies(rootComment.id)}
              currentUserId={currentUserId}
              deleteComment={deleteComment}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Comments;
