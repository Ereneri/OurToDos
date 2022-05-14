from lzma import is_check_supported
from re import I
from django.db import models
from django.utils.translation import gettext_lazy
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

# Create your models here.
class UserManager(BaseUserManager):

    def create_user(self, name, password, email, **other_fields):

        if not email:
            raise ValueError(gettext_lazy('Users must provide an email address'))

        email = self.normalize_email(email)
        user = self.model(name=name, email=email, **other_fields)
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, name, password, email, **other_fields):

        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError(gettext_lazy('Superuser must have is_staff=True'))
        if other_fields.get('is_superuser') is not True:
            raise ValueError(gettext_lazy('Superuser must have is_superuser=True'))

        return self.create_user(name, password, email, **other_fields)

class NewUser(AbstractBaseUser, PermissionsMixin):

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150)
    password = models.CharField(max_length=100)
    email = models.EmailField(gettext_lazy('email address'), unique=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'password']

    def __str__(self):
        return self.email


