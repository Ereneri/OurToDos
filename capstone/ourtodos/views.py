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
            pinnedlist = Pin.objects.get(user=user).pinnedlist.id
            list = List.objects.get(id=pinnedlist)
            return render(request, "ourtodos/index.html", {
                "list": pinnedlist,
                "title": list
            })
        else:
            subscribedlists = Subscribed.objects.filter(subscribed=user)
            targetlists = []
            for item in subscribedlists:
                targetlists.append(List.objects.get(id=item.masterlist.id))
            return render(request, "ourtodos/index.html", {
                "lists": targetlists
            })

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))

# sends a list of all the list
def all(request):

    # Authenticated users view their inbox
    if request.user.is_authenticated:
        user = request.user
        subscribedlists = Subscribed.objects.filter(subscribed=user)
        targetlists = []
        for item in subscribedlists:
            targetlists.append(List.objects.get(id=item.masterlist.id))
        return render(request, "ourtodos/alllist.html", {
            "lists": targetlists
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
            list = List.objects.create(title=title, owner=user)
            Subscribed.objects.create(masterlist=list, subscribed=user)
            return HttpResponseRedirect(reverse("alllist"))
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
        if (items.count() == 0):
            return JsonResponse({'error':'No Tasks'}, safe=False)
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

        task = Task.objects.create(parentList=plist, taskName=data.get("taskName", ""), createdBy=user, completedBy=user)

        return JsonResponse(task.serialize(), status=200, safe=False)
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

        return JsonResponse({"Success": "task updated"}, status=200, safe=False)
    else:
        return JsonResponse({"error": "PUT request required."}, status=400)

@csrf_exempt
@login_required
def pin(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if Pin.objects.filter(user=request.user).exists():

            Pin.objects.filter(user=request.user).delete()
            listtopin = List.objects.get(id=data.get("listid", ""))
            Pin.objects.create(user=request.user, pinnedlist=listtopin)

        else:
            target = List.objects.get(id=data.get("listid", ""))
            Pin.objects.create(user=request.user, pinnedlist=target)

        return JsonResponse({"Success": "pin updated"}, status=200, safe=False)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)

@login_required
def getPin(request):
    if request.method == 'GET':
        if Pin.objects.filter(user=request.user).exists():
            pinned = Pin.objects.get(user=request.user)
            listtopin = List.objects.get(id=pinned.pinnedlist.id)
            return JsonResponse(listtopin.serialize(), safe=False)
        else:
            return JsonResponse({"error": "No Pinned list"}, safe=False)
    else:
        return JsonResponse({"error": "GET request required."}, status=400)

@csrf_exempt
@login_required
def deleteList(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        target = data.get('listid')
        if List.objects.filter(id=target).exists():
            # get target list
            list = List.objects.get(id=target)

            # remove all tasks linked to that list
            if Task.objects.filter(parentList=list).exists():
                Task.objects.filter(parentList=list).delete()

            # finally delete list and return success
            List.objects.get(id=target).delete()
            return JsonResponse({"Success": "List deleted"}, status=200, safe=False)
        else:
            return JsonResponse({"error": "List doesn't exists"}, status=400)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)

@login_required
def getTitle(request, listid):
    if request.method == 'GET':
        title = List.objects.get(id=listid).serialize()['title']
        return JsonResponse({"title": title}, status=200, safe=False)
    else:
        return JsonResponse({"error": "GET request required."}, status=400)

@csrf_exempt
@login_required
def delTask(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        target = data.get('taskid')
        if Task.objects.filter(id=target).exists():
            Task.objects.filter(id=target).delete()
            return JsonResponse({"Success": "Task deleted"}, status=200, safe=False)
        else:
            return JsonResponse({"error": "List doesn't exists"}, status=400)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)













