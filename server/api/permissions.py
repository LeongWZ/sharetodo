from rest_framework import permissions

from .models import Membership, Project

class IsProjectAdminOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, project: Project):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return project.memberships.filter(user=request.user, role=Membership.Role.ADMIN).exists()


class HasProjectMembership(permissions.BasePermission):

    def has_object_permission(self, request, view, project: Project):
        return project.memberships.filter(user=request.user).exists()


class IsAdminOrIsOwnMembership(permissions.BasePermission):
    """
    Custom permission to only allow admins to access all CRUD operations,
    and members to only access delete for their own membership.
    """

    def has_object_permission(self, request, view, membership: Membership):
        project: Project = membership.project

        if project.memberships.filter(user=request.user, role=Membership.Role.ADMIN).exists():
            return True

        if request.method == "DELETE" and membership.user == request.user:
            return True

        return False