"""ourtodos URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from .views import apiOverview, taskList, taskDetail, taskCreate, taskEdit, taskDelete, TaskList, index, getUser

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', apiOverview, name='apiOverview'),
    path('task-list/', taskList, name='task-list'),
    path('task-detail/<str:pk>/', taskDetail, name='task-detail'),
    path('task-create/', taskCreate, name='task-create'),
    path('task-edit/<str:pk>?/', taskEdit, name='task-edit'),
    path('task-delete/<str:pk>?/', taskDelete, name='task-delete'),
    path('getUser/', getUser, name='getUser'),

    path('', index, name='index'),
]
