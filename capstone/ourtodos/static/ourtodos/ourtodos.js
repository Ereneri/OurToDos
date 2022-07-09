document.addEventListener('DOMContentLoaded', function() {
    console.log("howdy");
    var lists = document.getElementsByClassName('widget-content p-0');
    if (lists.length > 0) {
        fetch('/getPin')
        .then(res => res.json())
        .then(data => {
            if (data.error == "No Pinned list") {
                console.log(data);
            } else {
                var star = document.getElementById(`star-${data.id}`);
                star.innerHTML = `<img src="/static/pinStar.png" alt="Pinstar" class="star"/>`;
            }
        });
        console.log("Loaded pin");
    }
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// get csrftoken
const csrftoken = getCookie('csrftoken');

// loads the main page of a list
function loadlist(id, title) {
    console.log("GOT TO LOADLIST")
    var htmlVAR = `<h1>${title} <a href="/invite/${id}"><span style="font-size: 1.5rem">⚙</span></a> </h1><ul id="list-group" class="list-group list-group-flush">`;
    htmlVAR += `
    <li class="list-group-item">
            <div class="widget-content p-0">
                <div>
                    <form action="#" onsubmit="addtask(${id}); return false">
                        <input id="newtask" style="border: 0; outline: 0; background: transparent;border-bottom: 1px solid darkgrey; width: 100%;" class="form-control" placeholder="Add Task" autocomplete="off"></input>
                        <input type="submit" style="display: none"/>
                    </form>
                </div>
            </div>
    </li>`;
    fetch('/list/' + id)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        document.getElementById('list-wrapper').style.display = "block";
        if (data.error == 'No Tasks') {
            htmlVAR += `<h2 id="notasks" style="text-align: center; margin-top: 2rem">No Tasks...</h2>`;
        } else {
            console.log(document.getElementById("notasks"));
            for (let i = 0; i < data.length; i++) {
                // console.log(data[i].id, data[i].taskName, data[i].createdBy, data[i].iscomplete, data[i].completedBy);
                htmlVAR += addDiv(data[i].id, data[i].taskName, data[i].createdBy, data[i].iscomplete, data[i].completedBy);
            }
        }
        htmlVAR += "</ul>";
        document.getElementById('list-wrapper').innerHTML = htmlVAR;
    })
    console.log("FINISHED LOADLIST")
}

// adds task onto DB
function addtask(listid) {
    // get content from add task
    const input = document.getElementById('newtask');
    var taskName = input.value;
    console.log(listid)
    console.log("Input: " + taskName);

    if (document.getElementById("notasks") != null) {
        document.getElementById("notasks").remove();
    }

    fetch('/addtask', {
        method: 'POST',
        body: JSON.stringify({
            'parentList': listid,
            'taskName': taskName
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        document.getElementById('list-group').innerHTML += addDiv(data.id, taskName, data.createdBy, "false");
    })

    // reset box
    input.value = "";
}

// loads the list from the DB
function load(id) {
    console.log("GOT TO LOAD")
    document.getElementById('list-list').style.display = "none";
    fetch('/getTitle/' + id)
    .then(res => res.json())
    .then(data => {
        var title = data.title
        console.log(data);
        loadlist(id, title);
    })
}

// toggle for completing the task
function complete(id, boolean) {
    console.log(id + boolean);
    var user = JSON.parse(document.getElementById('requestuser').textContent);

    // make change on database
    fetch('/completetask/' + id, {
        method: 'PUT',
        body: JSON.stringify({
            iscomplete: boolean
        })
    })

    // edit how the button looks on users side
    if (boolean == 'true') {
        document.getElementById(`button-container-${id}`).innerHTML =
        `<input onclick="complete('${id}', 'false')" class="custom-control-input" id="button-${id}" type="checkbox" checked="true"><label class="custom-control-label" for="button-${id}">&nbsp;</label>`;
    } else {
        document.getElementById(`button-container-${id}`).innerHTML =
        `<input onclick="complete('${id}', 'true')" class="custom-control-input" id="button-${id}" type="checkbox"><label class="custom-control-label" for="button-${id}">&nbsp;</label>`;
    }

    // add or remove the "completed by x" div
    if (boolean == 'true') {
        document.getElementById(`right-${id}`).innerHTML = `<div id="complete-${id}" style="float:left; padding-right: 1rem">Completed by ${user}</div>` + document.getElementById(`right-${id}`).innerHTML;
        document.getElementById(`right-${id}`).children[1].innerHTML += `<div id="delete-${id}" onclick="delTask(${id})"  style="float:right">X</div>
        `;
        document.getElementById(`item-${id}`).setAttribute("class", "list-group-item completed");
        document.getElementById(`edit-${id}`).remove();
    } else {
        document.getElementById(`complete-${id}`).remove();
        document.getElementById(`delete-${id}`).remove();
        document.getElementById(`item-${id}`).setAttribute("class", "list-group-item");
        console.log(document.getElementById(`right-${id}`).children[0]);
        document.getElementById(`right-${id}`).children[0].innerHTML += `<div id="edit-${id}" onclick="editTask(${id})" style="float:right; display: block"><img src="/static/pencil.png" alt="star" class="pencil"/></div>`;
    }
}

// master function for adding the task elements onto the screen
function addDiv(id, taskName, createdBy, cBool, comBy) {
    // start var
    var div = "";

    // change div appear if true
    if (cBool == true) {
        div += `<li id="item-${id}" class="list-group-item completed">`;

    } else {
        div += `<li id="item-${id}" class="list-group-item ">`;
    }

    // add filler between
    div += `<div class="todo-indicator bg-warning"></div>
        <div class="widget-content p-0" id="task-${id}">
            <div class="widget-content-wrapper">
            <div class="widget-content-left mr-2">`;

    // change the complete function if complete or not
    if (cBool == true) {
        div += `<div id="button-container-${id}" class="custom-checkbox custom-control">
        <input onclick="complete('${id}', 'false')" class="custom-control-input" id="button-${id}" type="checkbox" checked="true"><label class="custom-control-label"
        for="button-${id}">&nbsp;</label></div>
        </div>`;

    } else {
        div += `<div id="button-container-${id}" class="custom-checkbox custom-control"><input onclick="complete('${id}', 'true')" class="custom-control-input" id="button-${id}" type="checkbox"><label class="custom-control-label"
        for="button-${id}">&nbsp;</label></div>
        </div>`;
    }

    // add the rest
    div += `<div id="left-${id}" class="widget-content-left">
                        <div id="taskItem-${id}" class="widget-task">${taskName}</div>
                        <div class="widget-subheading"><i>By: ${createdBy}</i></div>
                    </div>`

    if (cBool == true) {
        div += `<div id="right-${id}" class="widget-content-right">
            <div id="complete-${id}" style="float:left; padding-right: 1rem">Completed by ${comBy}</div>
                <div class="right-accessories">
                <div id="delete-${id}" onclick="delTask(${id})"  style="float:right">X</div>
                </div></div></div></div></li>`
    } else {
        div += `<div id="right-${id}" class="widget-content-right">
        <div class="right-accessories">
            <div id="save-${id}" onclick="saveTask(${id})" style="float:right; display: none">Save</div>
            <div id="edit-${id}" onclick="editTask(${id})" style="float:right; display: block"><img src="/static/pencil.png" alt="star" class="pencil"/></div>
        </div></div></div></div></li>`;
    }

    return div;
}

function pinTask(id) {
    fetch('/getPin')
    .then(res => res.json())
    .then(data => {
        console.log(data)
        if (data.error == "No Pinned list") {
            console.log("no pin");
            fetch('/pinlist', {
                method: 'POST',
                body: JSON.stringify({
                    'listid': id,
                })
            })
            var star = document.getElementById(`star-${id}`);
            star.innerHTML = `<img src="/static/pinStar.png" alt="star" class="star"/>`;
        } else {
            // reset all other stars with a loop?
            var star = document.getElementById(`star-${data.id}`);
            star.innerHTML = `<img src="/static/emptyStar.png" alt="star" class="star"/>`;
            if (data.id == id) {
                fetch('/delpin', {
                    method: 'POST',
                })
            } else {
                // sends new request
                fetch('/pinlist', {
                    method: 'POST',
                    body: JSON.stringify({
                        'listid': id,
                    })
                })
                var star = document.getElementById(`star-${id}`);
                star.innerHTML = `<img src="/static/pinStar.png" alt="star" class="star"/>`;
            }

        }
    });
}

function delList(id) {
    let text = 'Confirm Deletion of\n\nOnce deleted all tasks will be lost forever.';
    if (confirm(text) == true) {
        document.getElementById(`list-${id}`).remove();
        document.getElementById(`${id}-bothr`).remove();
        fetch('/delList', {
            method: 'POST',
            body: JSON.stringify({
                'listid': id,
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
    }
}

function delTask(id) {
    document.getElementById(`item-${id}`).remove();
    fetch('/delTask', {
        method: 'POST',
        body: JSON.stringify({
            'taskid': id,
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
}

function editTask(id) {
    // get div and text
    var input = document.getElementById(`taskItem-${id}`)
    console.log(input)
    var val = input.innerText;

    // change view
    document.getElementById(`taskItem-${id}`).remove();
    document.getElementById(`edit-${id}`).style.display = 'none';
    document.getElementById(`save-${id}`).style.display = 'block';

    var div = `<form style="width:auto" id="editForm-${id}" action="#" onsubmit="saveTask(${id}); return false">
    <input id="edittask-${id}" autofocus class="widget-task" style="border: 0; outline: 0; background: transparent; width: 100%; color: #52ab98; padding: 0;flex-basis: auto; text-decoration: underline;" autocomplete="off" size="${val.length+15}" value="${val}">
    <input type="submit" style="display: none">
    </form>`

    document.getElementById(`left-${id}`).innerHTML = div + document.getElementById(`left-${id}`).innerHTML;
}

function saveTask(id) {
    // get input and console debug info
    var input = document.getElementById(`edittask-${id}`).value;
    console.log(id)
    console.log("Input: " + input);

    // update DB
    fetch('/editTask', {
        method: 'PUT',
        body: JSON.stringify({
            'id': id,
            'input': input
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })

    // reset view
    document.getElementById(`edit-${id}`).style.display = 'block';
    document.getElementById(`save-${id}`).style.display = 'none';
    document.getElementById(`editForm-${id}`).remove()
    document.getElementById(`left-${id}`).innerHTML = `<div id="taskItem-${id}" class="widget-task">${input}</div>` + document.getElementById(`left-${id}`).innerHTML;
}