from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    
    def __str__(self):
        return self.username

class Project(models.Model):
    title = models.CharField(max_length=130)
    created_at = models.DateTimeField(auto_now_add=True)

class Membership(models.Model):

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "project"], name="unique_membership")
        ]

    class Role(models.TextChoices):
        ADMIN = "Admin"
        MEMBER = "Member"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="memberships")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="memberships")
    role = models.CharField(choices=Role.choices, default=Role.MEMBER, max_length=10)

class Todo(models.Model):

    class Priority(models.TextChoices):
        LOW = "Low"
        MEDIUM = "Medium"
        HIGH = "High"

    title = models.CharField(max_length=130)
    description = models.TextField(blank=True, max_length=300)
    notes = models.TextField(blank=True)
    due_date = models.DateField(null=True)
    updated_at = models.DateTimeField(auto_now=True)
    priority = models.CharField(choices=Priority.choices, default=Priority.MEDIUM, max_length=10)
    is_done = models.BooleanField(default=False)

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="todos")

class CheckableItem(models.Model):
    title = models.CharField(max_length=130)
    is_checked = models.BooleanField(default=False)
    todo = models.ForeignKey(Todo, on_delete=models.CASCADE, related_name="checkable_items")

class Log(models.Model):

    class Action(models.TextChoices):
        CREATE = "Create"
        UPDATE = "Update"
        DELETE = "Delete"

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    todo = models.ForeignKey(Todo, on_delete=models.SET_NULL, null=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="logs")

    action = models.CharField(choices=Action.choices, max_length=10)
    timestamp = models.DateTimeField()
    description = models.TextField(blank=True)

