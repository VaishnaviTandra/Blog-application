import React from 'react'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import { useContext ,useState} from 'react'
import { userAuthorContextobj } from '../../contexts/userAuthorContext'
import { useNavigate } from 'react-router-dom'
import { IoIosAddCircle } from "react-icons/io";
function Postarticle() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const {currentUser}=useContext(userAuthorContextobj)
  const navigate=useNavigate()
  const [error,setError]=useState('');
  async function postArticle(articleObj){
    setError('')
   console.log(articleObj)
   //make http post reques to create new article in backend
   //we cannot do it in this because we should create articleObj according to article Schema
  //  await axios.post('',articleObj)
  //create articleObj as per schema
  const authorData={
    nameOfAuthor:currentUser.firstName,
    email:currentUser.email,
    profileImageUrl:currentUser.profileImageUrl
  }
  articleObj.authorData=authorData;
  //article id
  articleObj.articleId=Date.now();
  //add title,category,content to articleObj-already has

  //add date of creation and date of modification
  let currentdate=new Date();
  articleObj.dateOfCreation=currentdate.getDate()+"-"+currentdate.getMonth()+"-"+currentdate.getFullYear()+" "+currentdate.toLocaleTimeString("en-US",{hour12:true})
  articleObj.dateOfModification=currentdate.getDate()+"-"+currentdate.getMonth()+"-"+currentdate.getFullYear()+" "+currentdate.toLocaleTimeString("en-US",{hour12:true})
  //add comments array
articleObj.comments=[];
articleObj.isArticleActive=true;
console.log(articleObj)
//make http post request to create new article in backend
let res=await axios.post('http://localhost:3000/author-api/article',articleObj)
if(res.status===201){
//navigate to articles component
navigate(`/author-profile/${currentUser.email}/articles`)
}else{
  setError(error.message)
}
  }
  return (
    <div className="container ">
    <div className="row justify-content-center mt-5">
      <div className="col-lg-8 col-md-8 col-sm-10">
        <div className="card shadow">
          <div className="card-title text-center border-bottom">
            <h2 className="p-3 " style={{ color: "goldenrod" }}>
              Write an Article
            </h2>
          </div>
          <div className="card-body bg-light">
            {/* {err.length!==0&&<p className='text-danger fs-5'>{err}</p>} */}
            <form onSubmit={handleSubmit(postArticle)}>
              <div className="mb-4">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  {...register("title")}
                />
                {/* title validation err msg */}

              </div>

              <div className="mb-4">
                <label htmlFor="category" className="form-label">
                  Select a category
                </label>
                <select
                  {...register("category")}
                  id="category"
                  className="form-select"
                  defaultValue=""
                >
                  <option value="" disabled>--categories--</option>
                  <option value="All">All</option>
                  <option value="Technology">Technology</option>
                  <option value="Health">Health</option>
                  {/* <option value="programming">Programming</option> */}
                  <option value="Business">Business</option>
                  <option value="Travel">Travel</option>
                  <option value="Education">Education</option>
                </select>
                {/* title validation err msg */}

              </div>
              <div className="mb-4">
                <label htmlFor="content" className="form-label">
                  Content
                </label>
                <textarea
                  {...register("content")}
                  className="form-control"
                  id="content"
                  rows="10"
                ></textarea>
                {/* title validation err msg */}

              </div>

              <div className="text-end">
                <button type="submit" className="add-article-btn">
                <IoIosAddCircle /> Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Postarticle