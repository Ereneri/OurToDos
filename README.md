# OurToDos v1.0.0

OurToDos is a collaborative project to help people organize their to-dos. Users can create several lists and add others to add and complete tasks. When a task is created it tells others who created the task below the task title. When a user completes that task it strikes out everything and tells others who completed it. Once a task is completed it can be deleted from the list by clicking the "X" on the right of the task. However, if a task is not completed, it can be edited by clicking on the "pen" icon on the right. Additionally, users can "pin" a task by clicking the star next to the list on either the "Home" page or the "All Lists" page. If a user already has a "pinned" task then the "Home" page with automatically open that list. A user can "unpin" a list but simply clicking on the yellow star on the "All Lists" page. I plan on added more features and releasing this build to get real world use.

## Home Page (index.html, views.index)

The home page, or index, is controlled by the backend view that tells the frontend to render either a list of all the to-do lists a user is subscribed to or to render the user's "pinned" list, if available. This is done by rendering the index.html and sending some variables to the jinja statements within the HTML.

## All List Page (alllist.html, views.all)

This page is very similar to the index but does not automatically load the "pinned list". This page allows users to access any list but scrolling through their subscribed lists and opening them. 

## Login/Register/Create List (login.html, register.html, createlist.html // views.login, views.register, views.createlist)

These pages are support pages to get the users started by registering and logging in, if needed, or creating a new list. Overall not too exciting, with some basic forms and using the default Django User model to decrease unnecessary complexity. 

## List Rendering (ourtodos.js)

All the lists are rendered by using a JavaScript function called addDiv which takes many parameters to render the tasks onto the user's screen. This is done by using a load function which is the first function to gather the basics of the list. Then loadlist is called, which fetches all the tasks from the list and calls the addDiv function using the data for that individual task to render whether it is completed or not, who created it, and its title. This took the bulk of my time as I needed to tweak and build supporting functions to edit, delete, and complete tasks. This included building functions for the fetch call to make changes to the backend database.

## File Structure 

* ourtodos is the main directory for the app.
* ourtodos/static contains the JavaScript, stylesheets, Icons, and Favicon.
* ourtodos/template contains all the HTML pages used in the web app.
* ourtodos/views.py contains all the views.
* ourtodos/urls.py contains all the URLS for the APIs and pages.
* ourtodos/models.py contains all the models created for this project.

## Install Directions

## 1. Download files

1. Fork the Repo using either github desktop or use "git clone" in the terminal to copy files

## 1. Download ZIP file

1. Click on "code" and download the code as a zip\
2. Once downloaded, unzip the file in a easy to find directory

## 2. Launch web app

1. Make sure you have Python installed (in terminal type "python3" or "python" to see if it is installed)
2. Install django via pip (in terminal type "python -m pip install Django"
3. cd into the project directory with the "manage.py" file
4. Finally run the terminal command "python manage.py runserver" in the folder with the manage.py file

# Database Models

The models took a long time to get right and work as intended. Below you can see a visual map of how these models interact with each other and their main functions. There are three main models needed for the basic functions of the web app: "List", "Task", and "Subscribed". The "List" model is the master list which contains the title of the list and the owner of the list. The "Task" model is used to store the Task for a "List", via ForeignKey, along with with the title, owner, and whether the task is completed and if so who completed the task. Additionally, the "Subscribed" model is used to subscribe users to a "List", the owner is automatically subscribed but other users can be added to the List by clicking on the gear icon next to the title. Lastly, there is also the "User" model prepackaged from the Django and the "Pin" model which is used to store a user's pinned list.

![OurToDos](https://user-images.githubusercontent.com/94649017/178326640-b947f29b-1b11-4192-92b8-11026bcba0dc.jpeg)
