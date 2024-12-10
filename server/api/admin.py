from django.contrib import admin
from .models import User, Membership, Project, Todo, CheckableItem, Log

# Register your models here.
admin.site.register(User)
admin.site.register(Membership)
admin.site.register(Project)
admin.site.register(Todo)
admin.site.register(CheckableItem)
admin.site.register(Log)