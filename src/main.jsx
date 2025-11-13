import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/assets/styles/index.css'
import { router } from './Routes/AppRoutes'
import { RouterProvider } from "react-router/dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={router} />,
  </StrictMode>,
)
