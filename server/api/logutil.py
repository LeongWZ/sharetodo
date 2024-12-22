from django.http import HttpRequest
from .models import User, Todo, Log, Project
from datetime import datetime

class LogUtil:

    @staticmethod
    def __log_helper(user: User, todo: Todo, project: Project, action: Log.Action, description: str = ""):
        return Log.objects.create(
            user=user,
            todo=todo, 
            project=project,
            timestamp=todo.updated_at if todo else datetime.now(),
            action=action,
            description=description
        )
    
    @staticmethod
    def log_create_action(request: HttpRequest, todo: Todo):
        return LogUtil.__log_helper(request.user, todo, todo.project, Log.Action.CREATE, str(request.data))
    
    @staticmethod
    def log_update_action(request: HttpRequest, todo: Todo):
        return LogUtil.__log_helper(request.user, todo, todo.project, Log.Action.UPDATE, str(request.data))
    
    @staticmethod
    def log_delete_action(request: HttpRequest, id: int, project: Project):
        return LogUtil.__log_helper(request.user, None, project, Log.Action.DELETE, f"Deleted todo with id {id}")