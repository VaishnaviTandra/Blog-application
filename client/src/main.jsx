import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'
import RootLayot from './components/RootLayot.jsx'
import Home from './components/common/Home.jsx'
import Signin from './components/common/signin.jsx'
import Signup from './components/common/signup.jsx'
import Userprofile from './components/user/userprofile.jsx'
import Aricles from './components/common/Aricles.jsx'
import ArticleById from './components/common/ArticleById.jsx'
import Authorprofile from './components/author/authorprofile.jsx'
import Postarticle from './components/author/Postarticle.jsx'
import UserAuthorContext from './contexts/userAuthorContext.jsx'
import AdminProfile from './components/admin/adminprofile.jsx'
// import Authors from './components/admin/authors.jsx'
import Users from './components/admin/users.jsx'
const browserRouterObj=createBrowserRouter([
  {
    path:"",
    element:<RootLayot/>,
    children:[{
      path:"",
      element:<Home/>
    },{
      path:"signin",
      element:<Signin/>
    },{
      path:"signup",
      element:<Signup/>
    },{
      path:"user-profile/:email",
      element:<Userprofile/>,
      children:[
        {
          path:"articles",
          element:<Aricles/>
        },{
          path:":articleId",
          element:<ArticleById/>
        },{
          path:"",
          element:<Navigate to="articles"/>
        }
      ]
    },{
      path:"author-profile/:email",
      element:<Authorprofile/>,
      children:[
        {
          path:"articles",
          element:<Aricles/>
        },{
          path:":articleId",
          element:<ArticleById/>
        },{
          path:"",
          element:<Navigate to="articles"/>
        },{
          path:"article",
          element:<Postarticle/>
        }
      ]
    },{
      path:"admin-profile/:email",
      element:<AdminProfile/>,
      children:[
        {
          path:"users",
          element:<Users/>
        }
      ]
    }]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserAuthorContext>
    <RouterProvider router={browserRouterObj}/>
    {/* <App /> */}
    </UserAuthorContext>
  </StrictMode>,
)
