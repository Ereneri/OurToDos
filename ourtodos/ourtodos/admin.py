from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

from .forms import createUserForm, changeUserForm

class createUserAdmin(UserAdmin):
    add_form = createUserForm
    form = changeUserForm
    model = User
    list_display = ['username', 'email']

admin.site.register(User, createUserAdmin)

