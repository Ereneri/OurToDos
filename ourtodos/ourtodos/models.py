from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class User(AbstractUser):
    pass
    def __str__(self):
        return self.username

class Todo(models.Model):
    id = models.AutoField(primary_key=True)
    task = models.CharField(max_length = 50, blank = False, null = False)
    completed = models.BooleanField(default = False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE)
    def __str__(self):
        return "{}".format(self.task)

