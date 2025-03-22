import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import Lottie from 'lottie-react';
import loadingAnim from '../../assets/Loading.json'; // Ensure the file exists in assets

function Articles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const [categories] = useState(["All", "Technology", "Health", "Business", "Travel", "Education"]);
  const [selectCat, setSelectCat] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const BACKEND_URL= import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { getToken } = useAuth();

  // Fetch articles
  async function getArticles() {
    setIsLoading(true); // Start loading

    const token = await getToken();
    console.log("Selected Category:", selectCat);

    try {
      let res = await axios.get(`${BACKEND_URL}/author-api/articles/${selectCat}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(res.data);
      if (res.data.message === 'articles') {
        setArticles(res.data.payload);
        setError('');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch articles. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  // Navigate to specific article
  function gotoArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj });
  }

  useEffect(() => {
    getArticles();
  }, [selectCat]);

  return (
    <div className='container'>
      <div>
        {error && <p className='display-4 text-center mt-5 text-danger'>{error}</p>}

        <div className="mb-4 mt-0 d-flex ">
          <label className="form-label text-white text-end me-3 lead fs-5  ">Filter by Category:</label>
          <select 
            className="form-select  w-50" 
            value={selectCat} 
            onChange={(e) => setSelectCat(e.target.value)}
          >
            {categories.map((cat, index) => (
              <option key={index}  value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="d-flex flex-column justify-content-center align-items-center text-center mt-5">
            <Lottie 
              animationData={loadingAnim} 
              loop={true} 
              className="border border-light rounded-2" 
              style={{ width: "200px", height: "200px" }} 
            />
            <p className="text-secondary fs-4 mt-3">Loading Articles...</p>
          </div>
        ) : (
          <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 mb-3'>
            {articles.map((articleObj) => (
              <div className='col mb-3' key={articleObj.articleId}>
                <div className='card h-100 '>
                  <div className='card-body'>
                    <div className='author-details text-end'>
                      <img src={articleObj.authorData.profileImageUrl} width='40px' className='rounded-circle' alt=""/>
                      <p>
                        <small className='text-secondary'>{articleObj.authorData.nameOfAuthor}</small>
                      </p>
                    </div>
                    <h5 className='card-title'>{articleObj.title}</h5>
                    <p className='card-text'>{articleObj.content.substring(0, 80) + "...."}</p>
                    <button className='custom-btn btn-4' onClick={() => gotoArticleById(articleObj)}>Read More...</button>
                  </div>
                  <div className='card-text'>
                    <small className='text-body-secondary'>Last updated on {articleObj.dateOfModification}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Articles;
