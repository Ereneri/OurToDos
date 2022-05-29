from django.http import HttpResponse,HttpResponseRedirect
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.views.generic.list import ListView
from django.views.generic.edit import CreateView
from django.urls import reverse
from django import forms
from .models import Task
from django.contrib import messages
from django.http import JsonResponse

from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import TaskSerializers

# Create your views here.

## Create List of Tasks Page

class TaskList(ListView):
    model = Task
    context_object_name = "tasks"

class CreateTask(CreateView):
    model = Task
    field = ['task', 'user', 'complete', 'completedBy']

class taskForm(forms.ModelForm):
    task = forms.CharField(max_length=255)

###############################################################################

def index(request):
    return render(request, 'index.html')

def createNewTask(request, list_id):
    list = Task.objects.get(id=task_id)
    
    if request.method == 'POST':
        form = taskForm(request.POST)
        task = form.data['task']
        todo = Task(list = list, user= request.user, task=task)
        todo.save()

        messages.add_message(request, messages.INFO, 'Task Created')

        return redirect('list', list_id = list_id)

def completeTask(request, task_id):
    task = Task.objects.get(id=task_id)

    if task.complete == True:
        task.complete = False
        task.completedBy = None
    else:
        task.complete = True
        task.completedBy = request.user
    task.save()

    return HttpResponseRedirect(reverse("index"))

def removeTask(request, task_id):
    task = Task.objects.get(id=task_id)
    task.delete()

    return HttpResponseRedirect(reverse("index"))

###############################################################################

@api_view(['GET'])
def apiOverview(request):

    api_urls = {
        'List':'/task-list/',
        'Create Task':'/task-create/',
        'Complete Task':'/task-complete/<str:pk>/',
        'Remove Task':'/task-remove/<str:pk>/',
        'Edit Task':'/task-edit/<str:pk>/',
    }

    return Response(api_urls)

@api_view(['GET'])
def taskList(request):
    tasks = Task.objects.all()
    serializer = TaskSerializers(tasks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def taskDetail(request, pk):
    tasks = Task.objects.get(id=pk)
    serializer = TaskSerializers(tasks, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def taskCreate(request):
    serializer = TaskSerializers(data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
def taskEdit(request, pk):
    task = Task.objects.get(id=pk)
    serializer = TaskSerializers(instance=task, data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
def taskDelete(request, pk):
    task = Task.objects.get(id=pk)
    task.delete()
    return Response("Deleted Successfully")





