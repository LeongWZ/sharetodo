from django.http import HttpRequest
from .models import User, Todo, Log

class LogUtil:

    @staticmethod
    def __log_helper(user: User, todo: Todo, action: Log.Action, description: str = ""):
        return Log.objects.create(
            user=user,
            todo=todo, 
            project=todo.project,
            timestamp=todo.updated_at,
            action=action,
            description=description
        )
    
    @staticmethod
    def log_create_action(request: HttpRequest, todo: Todo):
        return LogUtil.__log_helper(request.user, todo, Log.Action.CREATE, str(request.data))
    
    @staticmethod
    def log_update_action(request: HttpRequest, todo: Todo):
        return LogUtil.__log_helper(request.user, todo, Log.Action.UPDATE, str(request.data))
    
    @staticmethod
    def log_delete_action(request: HttpRequest, id: int):
        return LogUtil.__log_helper(request.user, None, Log.Action.DELETE, f"Deleted todo with id {id}")