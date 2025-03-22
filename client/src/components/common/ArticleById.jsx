import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { userAuthorContextobj } from '../../contexts/userAuthorContext';
import { FaEdit } from 'react-icons/fa';
import { MdDelete, MdRestore, MdReport } from 'react-icons/md';
import axios from 'axios';
import Lottie from 'lottie-react'
import { useAuth } from '@clerk/clerk-react';
import { FaSave } from "react-icons/fa";
import Welcome from '../../assets/Person.json'
import { motion } from 'framer-motion'

function ArticleById() {
  const { state } = useLocation();
  const { currentUser } = useContext(userAuthorContextobj);
  const [editArticleStatus, setEditArticleStatus] = useState(false);
  const { register, handleSubmit, setValue,reset } = useForm();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [currentArticle, setCurrentArticle] = useState(state);
  const [commentStatus, setCommentStatus] = useState('');
  const [commentReport, setCommentReport] = useState('');
  const BACKEND_URL= import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    if (editArticleStatus) {
      setValue('title', currentArticle.title);
      setValue('category', currentArticle.category);
      setValue('content', currentArticle.content);
    }
  }, [editArticleStatus, setValue, currentArticle]);

  function enabledEdit() {
    setEditArticleStatus(true);
  }

  async function onSave(modifiedArticle) {
    try {
      const token = await getToken();
      if (!token) {
        console.error('Authentication token missing');
        return;
      }

      const modifiedArticleAfterChanges = { ...currentArticle, ...modifiedArticle };
      modifiedArticleAfterChanges.dateOfModification = new Date().toLocaleDateString();

      const res = await axios.put(
        `${BACKEND_URL}/author-api/article/${modifiedArticleAfterChanges.articleId}`,
        modifiedArticleAfterChanges,
        {
          headers: {
            Authorization:` Bearer ${token}`,
          },
        }
      );

      if (res.data.message === 'article modified') {
        setEditArticleStatus(false);
        setCurrentArticle(res.data.payload);
        navigate(`/author-profile/articles/${modifiedArticleAfterChanges.articleId}`, { state: res.data.payload });
      }
    } catch (error) {
      console.error('Error saving article:', error);
    }
  }

  async function deleteArticle() {
    try {
      const token = await getToken();
      if (!token) {
        console.error('Authentication token missing');
        return;
      }

      const updatedArticle = { ...currentArticle, isArticleActive: false };

      const res = await axios.put(
        `${BACKEND_URL}/author-api/articles/${currentArticle.articleId}`,
        updatedArticle,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.message === 'article deleted or restored') {
        setCurrentArticle(res.data.payload);
      }
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  }

  async function restoreArticle() {
    try {
      const token = await getToken();
      if (!token) {
        console.error('Authentication token missing');
        return;
      }

      const updatedArticle = { ...currentArticle, isArticleActive: true };

      const res = await axios.put(
        `${BACKEND_URL}/author-api/articles/${currentArticle.articleId}`,
        updatedArticle,
        {
          headers: {
            Authorization:` Bearer ${token}`,
          },
        }
      );

      if (res.data.message === 'article deleted or restored') {
        setCurrentArticle(res.data.payload);
      }
    } catch (error) {
      console.error('Error restoring article:', error);
    }
  }
  async function addComment(commentObj){
    //add name of user to commentObj
    commentObj.nameOfUser=currentUser.firstName;
    console.log(commentObj)
    //http put request to modify the article by adding the comment
    let res=await axios.put(`${BACKEND_URL}/user-api/comment/${currentArticle.articleId}`,commentObj)
    if(res.data.message==="comment added"){
     setCommentStatus(res.data.message)
     setCurrentArticle(res.data.payload)
     reset()
    }
 }
 async function deleteComment(commentId){
   try {
     const token = await getToken();
     if (!token) {
       console.error('Authentication token missing');
       return;
     }
   const res=await axios.delete(`${BACKEND_URL}/user-api/comment/${currentArticle.articleId}/${commentId}`,{
     headers:{
       Authorization:`Bearer ${token}`
     },
   });
   if(res.data.message==='comment deleted'){
     setCurrentArticle((prevArticle) => ({
       ...prevArticle,
       comments: prevArticle.comments.filter((comment) => comment._id !== commentId),
     }));
   }
 }catch(error){
   console.error("Error deleting comment:", error.response?.data || error.message);
 }
}

  return (
    <div className="container text-white articlesd"
      style={{
        background: 'radial-gradient(circle, rgba(0,43,91,0.8) 30%, #000000 90%)',
        padding: '20px',
        borderRadius: '10px',
      }}>
      
      {!editArticleStatus ? (
        <>
          <div className="container w-100 d-flex mt-3">
            <div className="d-flex justify-content-between author-block w-100 mt-3"
            style={{ background: 'rgba(0, 20, 50, 0.7)', border: '1px solid #004e92' }}>
              <div className="mb-4 w-100 rounded-2 justify-content-between align-items-center">
                <p className="display-5 me-3 text-light ctitle">{currentArticle.title}</p>
                <span>
                  <small className="text-white me-5 creation">Created on: {currentArticle.dateOfCreation}</small>
                  <small className="text-white me-5 modification">Modified on: {currentArticle.dateOfModification}</small>
                </span>
              </div>
              <div className="text-center align-items-center mt-4 me-5 cprofile">
                <img src={currentArticle.authorData.profileImageUrl} width="60px" className="rounded-circle" alt="" />
                <p className="text-light">{currentArticle.authorData.nameOfAuthor}</p>
              </div>
              {currentUser.role === 'author' && (
  <div className="d-flex me-3 mt-5">
    {/* Edit Button */}
    <button
      className="me-2 btn cedit"
      onClick={enabledEdit}
      style={{
        background: "linear-gradient(45deg, #3e2a47, #b08d57)", // Bronze and black gradient
        color: "#fff", // White text for contrast
      }}
    >
      <FaEdit className="text-warning" />
    </button>

    {/* Delete or Restore Button */}
    {currentArticle.isArticleActive ? (
      <button
        className="btn cedit"
        onClick={deleteArticle}
        style={{
          background: "linear-gradient(45deg, #3e2a47, #b08d57)", // Bronze and black gradient
          color: "#fff", // White text for contrast
        }}
      >
        <MdDelete className="text-danger fs-4" />
      </button>
    ) : (
      <button
        className="me-2 btn cedit"
        onClick={restoreArticle}
        style={{
          background: "linear-gradient(45deg, #3e2a47, #b08d57)", // Bronze and black gradient
          color: "#fff", // White text for contrast
        }}
      >
        <MdRestore className="text-info fs-4" />
      </button>
    )}
  </div>
)}

            </div>
          </div>

          <p className="lead mt-3 article-content text-light" style={{ whiteSpace: 'pre-line' }}>
            {currentArticle.content}
          </p>

          <div className="comments my-4">
            {currentArticle.comments.length === 0 ? (
              <p className="display-5 text-light">No Comments Yet</p>
            ) : (
              currentArticle.comments.map((commentObj) => (
                <div key={commentObj._id} className="d-flex">
                 <img
  src={commentObj.profileImageUrl || "https://w1.pngwing.com/pngs/314/924/png-transparent-person-logo-symbol-man-black-black-and-white-silhouette.png"}
  alt="User Profile"
  className="rounded-circle me-3 ccomment"
  width="40"
  height="40"
/>

                  <p className="user-name text-light me-3">{commentObj?.nameOfUser}  </p>
                  <p className="comment text-light">{commentObj?.comment}</p>
                  {currentUser.firstName === commentObj.nameOfUser && (
                    <button className="btn btn-sm btn-danger ms-auto mb-3" onClick={() => deleteComment(commentObj._id)}>
                      <MdDelete />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <h1 className="text-warning">{commentStatus}</h1>
          {currentUser.role === 'user' && (
            <form onSubmit={handleSubmit(addComment)}>
              <input type="text" {...register("comment")} className="form-control mb-4" />
              <button className="btn btn-primary">Add a comment</button>
            </form>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit(onSave)}>
          <div className="mb-4">
            <label htmlFor="title" className="form-label text-light">Title</label>
            <input type="text" className="form-control" id="title" {...register('title')} />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="form-label text-light">Select a category</label>
            <select {...register('category')} id="category" className="form-select">
              <option value="" disabled>--categories--</option>
              <option value="All">All</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Business">Business</option>
              <option value="Travel">Travel</option>
              <option value="Education">Education</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="form-label text-light">Content</label>
            <textarea {...register('content')} className="form-control" id="content" rows="10"></textarea>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-success"> <FaSave /> Save</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ArticleById;