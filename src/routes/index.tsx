import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthGuard from "../features/auth/components/AuthGuard";
import LoginPage from "../features/auth/components/LoginPage";
import AppLayout from "../layouts/AppLayout";
import DashboardPage from "../features/dashboard/components/DashboardPage";
import SubjectPage from "../features/subject/components/SubjectPage";
import TopicPage from "../features/topic/components/TopicPage";
import ExamPage from "../features/exam/components/ExamPage";
import SlidesPage from "../features/slides/components/SlidesPage";
import ProfilePage from "../features/profile/components/ProfilePage";
import ReviewExamsPage from "../features/review-exams/components/ReviewExamsPage";
import ReviewExamPage from "../features/review-exams/components/ReviewExamPage";
import ExamHistoryPage from "../features/exam-history/components/ExamHistoryPage";
import ExamAttemptDetailPage from "../features/exam-history/components/ExamAttemptDetailPage";

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
          { path: "/profile", element: <ProfilePage /> },
          { path: "/review-exams", element: <ReviewExamsPage /> },
          { path: "/exam-history", element: <ExamHistoryPage /> },
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
        path: "/review-exams/:evaluationId/:examId",
        element: <ReviewExamPage />,
      },
      {
        path: "/exam-history/:subjectId/:topicId/:attemptId",
        element: <ExamAttemptDetailPage />,
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
