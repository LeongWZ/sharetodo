from django.http import Http404, HttpRequest
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from .models import Membership, Project, Todo, User
from .serializers import LogSerializer, MembershipSerializer, ProjectSerializer, TodoSerializer
from .permissions import HasProjectMembership, IsProjectAdminOrReadOnly
from .logutil import LogUtil

class ProjectList(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # For drf-spectacular to generate schema
    serializer_class = ProjectSerializer
    
    @extend_schema(responses={200: ProjectSerializer(many=True)})
    def get(self, request: HttpRequest):
        """
        Handles GET requests to retrieve projects associated with the authenticated user.

        This method filters projects based on the memberships of the user making the request,
        serializes the project data, and returns it in the response.
        """
        user: User = request.user
        projects = Project.objects.filter(memberships__user=user)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    
    def post(self, request: HttpRequest):
        """
        Handle POST request to create a new project.

        This method validates the incoming data using the ProjectSerializer. If the data is valid,
        it saves the new project and creates a Membership for the authenticated user with the role of ADMIN.
        If the data is not valid, it returns a 400 Bad Request response with the validation errors.
        """
        serializer = ProjectSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        Membership.objects.create(user=request.user, project=serializer.instance, role=Membership.Role.ADMIN)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProjectDetail(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, HasProjectMembership, IsProjectAdminOrReadOnly]
    
    # For drf-spectacular to generate schema
    serializer_class = ProjectSerializer

    def get_object(self, pk: int):
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            raise Http404
        
        # raises 403 if user does not have permission
        self.check_object_permissions(self.request, project)

        return project
        
    def get(self, request: HttpRequest, pk: int):
        project = self.get_object(pk)
        
        serializer = ProjectSerializer(project)
        return Response(serializer.data)
    
    def put(self, request: HttpRequest, pk: int):
        project = self.get_object(pk)
        serializer = ProjectSerializer(project, data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        return Response(serializer.data)
    
    def delete(self, request: HttpRequest, pk: int):
        project = self.get_object(pk)
        
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProjectMembershipList(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, HasProjectMembership, IsProjectAdminOrReadOnly]
    
    # For drf-spectacular to generate schema
    serializer_class = MembershipSerializer

    def get_object(self, pk: int):
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            raise Http404
        
        # raises 403 if user does not have permission
        self.check_object_permissions(self.request, project)
        
        return project
    
    @extend_schema(responses={200: MembershipSerializer(many=True)})
    def get(self, request: HttpRequest, pk: int):
        project = self.get_object(pk)
        memberships = Membership.objects.filter(project=project)
        serializer = MembershipSerializer(memberships, many=True)
        
        return Response(serializer.data)
    
    def post(self, request: HttpRequest, pk: int):
        project = self.get_object(pk)
        serializer = MembershipSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save(project=project)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MembershipDetail(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, HasProjectMembership, IsProjectAdminOrReadOnly]
    
    # For drf-spectacular to generate schema
    serializer_class = MembershipSerializer

    def get_object(self, pk: int):
        try:
            membership = Membership.objects.get(pk=pk)
        except Membership.DoesNotExist:
            raise Http404
        
        project = membership.project
        self.check_object_permissions(self.request, project)

        return membership
    
    def put(self, request: HttpRequest, pk: int):
        membership = self.get_object(pk)
        serializer = MembershipSerializer(membership, data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        return Response(serializer.data)
    
    def delete(self, request: HttpRequest, pk: int):
        membership = self.get_object(pk)
        membership.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProjectTodoList(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, HasProjectMembership]
    
    # For drf-spectacular to generate schema
    serializer_class = TodoSerializer

    def get_object(self, pk: int):
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            raise Http404
        
        self.check_object_permissions(self.request, project)

        return project
    
    @extend_schema(responses={200: TodoSerializer(many=True)})
    def get(self, request: HttpRequest, pk: int):
        project = self.get_object(pk)
        todos = project.todos.all()
        serializer = TodoSerializer(todos, many=True)
        return Response(serializer.data)
    
    def post(self, request: HttpRequest, pk: int):
        project = self.get_object(pk)
        serializer = TodoSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save(project=project)

        LogUtil.log_create_action(request, serializer.instance)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TodoDetail(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, HasProjectMembership]
    
    # For drf-spectacular to generate schema
    serializer_class = TodoSerializer

    def get_object(self, pk: int):
        try:
            todo = Todo.objects.get(pk=pk)
        except Todo.DoesNotExist:
            raise Http404
        
        self.check_object_permissions(self.request, todo.project)
        return todo
    
    def get(self, request: HttpRequest, pk: int):
        todo = self.get_object(pk)
        serializer = TodoSerializer(todo)
        return Response(serializer.data)
    
    def put(self, request: HttpRequest, pk: int):
        todo = self.get_object(pk)
        serializer = TodoSerializer(todo, data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()

        LogUtil.log_update_action(request, serializer.instance)

        return Response(serializer.data)
    
    def delete(self, request: HttpRequest, pk: int):
        todo = self.get_object(pk)
        todo.delete()
        LogUtil.log_delete_action(request, pk)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProjectLogList(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, HasProjectMembership]
    
    # For drf-spectacular to generate schema
    serializer_class = LogSerializer

    def get_object(self, pk: int):
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            raise Http404
        
        self.check_object_permissions(self.request, project)

        return project
    
    @extend_schema(responses={200: LogSerializer(many=True)})
    def get(self, request: HttpRequest, pk: int):
        project = self.get_object(pk)
        logs = project.logs.all()
        serializer = LogSerializer(logs, many=True)
        return Response(serializer.data)
