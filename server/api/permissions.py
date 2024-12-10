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

