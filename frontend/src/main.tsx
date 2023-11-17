import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './Root.tsx'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Index from './pages/Index.tsx';
import { AuthProvider } from './components/AuthProvider.tsx';
import Article from './pages/Article.tsx';
import Login, { login_loader } from './pages/Login.tsx';

const router = createBrowserRouter([
    {
        // Provide the auth provider as the
        // top level component
        element: <AuthProvider />,
        children: [
            {
                path: "/",
                element: <Root />,
                children: [
                    {
                        index: true,
                        element: <Index />
                    },
                    {
                        path: ":id",
                        element: <Article />
                    },
                    {
                        path: "login",
                        element: <Login />,
                        loader: login_loader,
                    }
                ]
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);