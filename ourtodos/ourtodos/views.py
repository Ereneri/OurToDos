from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django import forms
from django.contrib import messages

def index(request):
    return render(request, "ourtodos/index.html")

# creates a new user
def register(request):
    # Needs user's email, username, and password
    # The password needs to be hashed and salted into SQL db
    pass;

# logins in user
def login(request):
    # calls username and hashes and salts and checks against SQL db
    pass

# Creates new task with user session data
def createTodo():
    pass

