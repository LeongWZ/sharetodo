from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("projects/<int:pk>/memberships/", views.ProjectMembershipList.as_view(), name="project-membership-list"),
    path("projects/<int:pk>/todos/", views.ProjectTodoList.as_view(), name="project-todo-list"),
    path("projects/<int:pk>/logs/", views.ProjectLogList.as_view(), name="project-log-list"),
    path("projects/<int:pk>/", views.ProjectDetail.as_view(), name="project-detail"),
    path("projects/", views.ProjectList.as_view(), name="project-list"),
    path("memberships/<int:pk>/", views.MembershipDetail.as_view(), name="membership-detail"),
    path("todos/<int:pk>/", views.TodoDetail.as_view(), name="todo-detail"),
]