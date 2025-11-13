/**
 * @author: S M Samiul Hasan
 * @file: AppRoutes.jsx
 * @description: This file defines the main application routes using react-router-dom.
 * All rights reserved by S M Samiul Hasan.
 */

import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/dashboard/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import CreateEvent from "../pages/dashboard/CreateEvent";
import UpcomingEvents from "../pages/dashboard/UpcomingEvents";
import EventDetails from "../pages/dashboard/EventDetails";
import JoinedEvents from "../pages/dashboard/JoinedEvents";
import ManageEvents from "../pages/dashboard/ManageEvents";
import Leaderboard from "../pages/dashboard/Leaderboard";
import NotFound from "../pages/common/NotFound";
import Map from "../pages/dashboard/Map";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../Routes/PublicRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        path: "/",
        element: (
            <Home />
        )
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        )
      },
      {
        path: "/register",
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        )
      },
      {
        path: "/create-event",
        element: (
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        )
      },
      {
        path: "/upcoming-events",
        element: (
          <ProtectedRoute>
            <UpcomingEvents />
          </ProtectedRoute>
        )
      },
      {
        path: "/event/:eventId",
        element: (
          <ProtectedRoute>
            <EventDetails />
          </ProtectedRoute>
        )
      },
      {
        path: "/joined-events",
        element: (
          <ProtectedRoute>
            <JoinedEvents />
          </ProtectedRoute>
        )
      },
      {
        path: "/manage-events",
        element: (
          <ProtectedRoute>
            <ManageEvents />
          </ProtectedRoute>
        )
      },
      {
        path: "/leaderboard",
        element: (
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        )
      },
      {
        path: "/map",
        element: (
          <ProtectedRoute>
            <Map />
          </ProtectedRoute>
        )
      }
    ]
  },
]);