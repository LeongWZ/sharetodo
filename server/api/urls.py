from django.urls import path

from . import views

urlpatterns = [
    path("projects/<int:pk>/memberships/", views.ProjectDetailMembershipList.as_view()),
    path("projects/<int:pk>/todos/", views.ProjectDetailTodoList.as_view()),
    path("projects/<int:pk>/logs/", views.ProjectDetailLogList.as_view()),
    path("projects/<int:pk>/", views.ProjectDetail.as_view()),
    path("projects/", views.ProjectList.as_view()),
    path("memberships/<int:pk>/", views.MembershipDetail.as_view()),
    path("todos/<int:pk>/", views.TodoDetail.as_view()),
]