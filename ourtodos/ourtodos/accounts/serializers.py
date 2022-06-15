from rest_framework import serializers

from .models import Task, NewUser

class TaskSerializers(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ('id','name')
        read_only_fields = ('id','password','is_staff','is_superuser','email','name')