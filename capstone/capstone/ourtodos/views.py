from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
import json
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt

from .models import *

# Create your views here.
def index(request):

    # Authenticated users view their inbox
    if request.user.is_authenticated:
        user = request.user
        if Pin.objects.filter(user=user).exists():
            pinnedlist = Pin.objects.get(user=user).id
            list = List.objects.get(id=pinnedlist)
            return render(request, "ourtodos/index.html", {
                "list": pinnedlist,
                "title": list
            })
        else:
            lists = List.objects.filter(subscribed=user)
            return render(request, "ourtodos/index.html", {
                "lists": lists
            })

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))

# sends a list of all the list
def all(request):

    # Authenticated users view their inbox
    if request.user.is_authenticated:
        user = request.user
        lists = List.objects.filter(subscribed=user)
        return render(request, "ourtodos/alllist.html", {
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

@csrf_exempt
@login_required
def addtask(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        user = request.user
        parentlistID = data.get("parentList")
        plist = List.objects.get(id=parentlistID)

        Task.objects.create(parentList=plist, taskName=data.get("taskName", ""), createdBy=user, completedBy=user)

        return JsonResponse({"Success": "task added"}, status=204, safe=False)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)

@csrf_exempt
@login_required
def complete(request, taskid):
    if request.method == "PUT":
        # get task from DB
        task = Task.objects.get(id=taskid)
        data = json.loads(request.body)


        # take string into boolean
        completeBOOL = ""
        if (data.get("iscomplete", "") == "false"):
            completeBOOL = False
        else:
            completeBOOL = True

        # load and update task with new info
        task.iscomplete = completeBOOL
        task.completedBy = request.user
        task.save()

        return JsonResponse({"Success": "task updated"}, status=204, safe=False)
    else:
        return JsonResponse({"error": "PUT request required."}, status=400)

@csrf_exempt
@login_required
def pinlist(request, listid):
    if request.method == 'POST':
        if Pin.objects.filter(user=request.user).exists():
            Pin.objects.filter(user=request.user).delete()
            listtopin = List.objects.get(id=listid)
            Pin.objects.create(user=request.user, pinnedlist=listtopin)
        else:
            Pin.objects.create(user=request.user, pinnedlist=list)
        return JsonResponse({"Success": "pin updated"}, status=204, safe=False)

    if request.method == 'GET':
        if Pin.objects.filter(user=request.user).exists():
            listtopin = List.objects.get(id=listid)
            return JsonResponse(listtopin.serialize(), safe=False)
        else:
            return JsonResponse({"error": "No Pinned list"}, safe=False)
    else:
        return JsonResponse({"error": "POST or GET request required."}, status=400)






