from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass

# Create List
class List(models.Model):
    """List is created by a user to invite others"""
    title = models.CharField(max_length=120, default="Untitled List")
    subscribed = models.ForeignKey(User, on_delete=models.CASCADE, related_name="subscribed")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owner")

    # serialize for API
    def serialize(self):
        return {
            "id" : self.id,
            "title" : self.title,
            "subscribed" : self.subscribed.id,
            "owner" : self.owner.username
        }

# Items on List
class Task(models.Model):
    parentList = models.ForeignKey(List, on_delete=models.CASCADE, related_name="parentList")
    taskName = models.CharField(max_length=120)
    createdBy = models.ForeignKey(User, on_delete=models.CASCADE, related_name="createdBy")
    iscomplete = models.BooleanField(default=False)
    completedBy = models.ForeignKey(User, on_delete=models.CASCADE, related_name="completedBy")

    # when called return the name of the task
    def __str__(self):
        return self.taskName

    # return the task items by if they are complete or not
    class Meta:
        ordering = ['iscomplete']

    # serialize for API
    def serialize(self):
        return {
            "id" : self.id,
            "parentlist" : self.parentList.id,
            "taskName" : self.taskName,
            "createdBy" : self.createdBy.username,
            "iscomplete" : self.iscomplete,
            "completedBy" : self.completedBy.username
        }

# allows the user to have a pinned list
class Pin(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
    pinnedlist = models.ForeignKey(List, on_delete=models.CASCADE, related_name="list")

    def serialize(self):
        return {
            "list" : self.pinnedlist.id
        }
