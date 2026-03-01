import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthGuard from "../features/auth/components/AuthGuard";
import LoginPage from "../features/auth/components/LoginPage";
import AppLayout from "../layouts/AppLayout";
import DashboardPage from "../features/dashboard/components/DashboardPage";
import SubjectPage from "../features/subject/components/SubjectPage";
import TopicPage from "../features/topic/components/TopicPage";
import ExamPage from "../features/exam/components/ExamPage";
import SlidesPage from "../features/slides/components/SlidesPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/subject/:subjectId", element: <SubjectPage /> },
          {
            path: "/subject/:subjectId/topic/:topicId/lesson",
            element: <TopicPage />,
          },
        ],
      },
      {
        path: "/subject/:subjectId/topic/:topicId/exam",
        element: <ExamPage />,
      },
      {
        path: "/subject/:subjectId/topic/:topicId/slides",
        element: <SlidesPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
