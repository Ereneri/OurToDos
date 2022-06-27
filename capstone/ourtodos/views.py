from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
import json
from django.core import serializers

from .models import *

# Create your views here.
def index(request):

    # Authenticated users view their inbox
    if request.user.is_authenticated:
        user = request.user
        if Pin.objects.filter(user=user).exists():
            pinnedlist = Pin.objects.get(user=user)
            list = Task.objects.filter(parentList=pinnedlist)
            return render(request, "ourtodos/index.html", {
                "list": list,
            })
        else:
            lists = List.objects.filter(subscribed=user)
            return render(request, "ourtodos/index.html", {
                "lists": lists
            })

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "ourtodos/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "ourtodos/login.html")

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "ourtodos/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "ourtodos/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "ourtodos/register.html")


def logout_view(request):
    logout(request)
    return render(request, "ourtodos/login.html", {
        "message": "Logged out"
    })

@login_required
def createlist(request):
    if request.method == "POST":
        user = request.user
        title = request.POST["listname"]

        # create new List object
        if title is not None:
            list = List.objects.create(title=title, subscribed=user, owner=user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "ourtodos/createlist.html", {
                "message": "Invalid list name."
            })
    else:
        return render(request, "ourtodos/createlist.html")

@login_required
def list(request, listid):
    # Query for requested email
    try:
        list = List.objects.get(id=listid)
    except List.DoesNotExist:
        return JsonResponse({"error": "List not found."}, status=404)

    # Return list contents
    if request.method == "GET":
        items = Task.objects.filter(parentList=list)
        items = items.all()
        return JsonResponse([item.serialize() for item in items], safe=False)

    # task must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)

@login_required
def addtask(request):
    data = json.load(request)['post_data'] #Get data from POST request
    user = request.user

    Task.objects.create(parentList=data.parentList, taskName=data.taskName, createdBy=user)
    return JsonResponse({"Success"}, status=204)





