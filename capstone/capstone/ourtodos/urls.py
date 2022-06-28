from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("register", views.register, name="register"),
    path("logout", views.logout_view, name="logout"),
    path("createlist", views.createlist, name="createlist"),
    path("list/<int:listid>", views.list, name="list"),
    path("addtask", views.addtask, name="addtask"),
    path("completetask/<int:taskid>", views.complete, name="completetask"),
    path("pinlist/<int:listid>", views.pinlist, name="pinlist"),
    path("alllist", views.all, name="alllist"),
]