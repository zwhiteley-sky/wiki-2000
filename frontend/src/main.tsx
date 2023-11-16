import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './Root.tsx'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Index, { index_loader } from './pages/Index.tsx';
import { AuthProvider } from './components/AuthProvider.tsx';

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
                        element: <Index />,
                        loader: index_loader
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