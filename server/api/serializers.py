from rest_framework import serializers

from .models import Project, Todo, User, Membership, CheckableItem, Log


class MembershipSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())
    project = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Membership
        fields = ["id", "user", "project", "role"]
        create_only_fields = ["user", "project"]

    def to_internal_value(self, data):
        data = super().to_internal_value(data)
        if self.instance:
            # update
            for x in self.create_only_fields:
                data.pop(x)
        return data

class ProjectSerializer(serializers.ModelSerializer):
    memberships = MembershipSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ["id", "title", "created_at", "memberships"]

class CheckableItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = CheckableItem
        fields = ["id", "title", "is_checked"]

class TodoSerializer(serializers.ModelSerializer):
    checkable_items = CheckableItemSerializer(many=True, read_only=False)
    project = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Todo
        fields = ["id", "title", "description", "notes", "due_date", "updated_at", "priority", "is_done", "project", "checkable_items"]

    def create(self, validated_data):
        checkable_items_data = validated_data.pop("checkable_items")
        todo = Todo.objects.create(**validated_data)
        for checkable_item in checkable_items_data:
            CheckableItem.objects.create(todo=todo, **checkable_item)
        return todo
    
    def update(self, instance, validated_data):
        checkable_items_data = validated_data.pop("checkable_items", [])
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()

        existing_ids = [item["id"] for item in checkable_items_data if "id" in item]
        CheckableItem.objects.filter(todo=instance).exclude(id__in=existing_ids).delete()

        for checkable_item in checkable_items_data:
            if "id" in checkable_item:
                try:
                    item = CheckableItem.objects.get(id=checkable_item["id"])
                    item.title = checkable_item["title"]
                    item.is_checked = checkable_item["is_checked"]
                    item.save()
                except CheckableItem.DoesNotExist:
                    raise serializers.ValidationError(f"Checkable item with id {checkable_item['id']} does not exist.")
            else:
                CheckableItem.objects.create(todo=instance, **checkable_item)

        return instance
    
class LogSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    todo = serializers.PrimaryKeyRelatedField(queryset=Todo.objects.all())
    
    class Meta:
        model = Log
        fields = ["id", "user", "todo", "action", "timestamp", "description"]
