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
                star.innerHTML = "⭐";
            }
        });
        console.log("Loaded pin");
    }
});

const user = JSON.parse(document.getElementById('user').textContent);

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
    var htmlVAR = `<h1>${title}</h1><ul id="list-group" class="list-group list-group-flush">`;
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
        document.getElementById(`right-${id}`).children[0].innerHTML += `<div id="complete-${id}" style="float:left; padding-right: 1rem">Completed by ${user}</div>`
    } else {
        document.getElementById(`complete-${id}`).remove();
    }

    // edit the div
    if (boolean == "true") {
        document.getElementById(`item-${id}`).setAttribute("class", "list-group-item completed");
    }
    else {
        document.getElementById(`item-${id}`).setAttribute("class", "list-group-item");
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
    div += `<div class="widget-content-left">
                        <div id="taskitem" class="widget-heading">${taskName}</div>
                        <div class="widget-subheading"><i>By: ${createdBy}</i></div>
                    </div>`

    if (cBool == true) {
        div += `<div id="right-${id}" class="widget-content-right">
                <div>
                    <div id="complete-${id}" style="float:left; padding-right: 1rem">Completed by ${comBy}</div>
                    <div id="delete" onclick="delTask('${id}')"  style="float:right">✗</div>
                    <div id="edit" style="float:right; margin-right: 1rem; display: block">✏️</div>
                    <div id="save" style="float:right; margin-right: 1rem; display: none">Save</div>
                </div></div></div></div></li>`
    } else {
        div += `<div id="right-${id}" class="widget-content-right">
        <div>
            <div id="delete" onclick="delTask('${id}')" style="float:right">✗</div>
            <div id="edit" style="float:right; margin-right: 1rem; display: block">✏️</div>
            <div id="save" style="float:right; margin-right: 1rem; display: none">Save</div>
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
            star.innerHTML = "⭐";
        } else {
            // reset all other stars with a loop?
            var star = document.getElementById(`star-${data.id}`);
            star.innerHTML = "☆";

            // sends new request
            fetch('/pinlist', {
                method: 'POST',
                body: JSON.stringify({
                    'listid': id,
                })
            })
            var star = document.getElementById(`star-${id}`);
            star.innerHTML = "⭐";
        }
    });
}

function delList(id, title) {
    let text = `Confirm Deletion of "${title}"\nOnce deleted all tasks will be lost forever.`;
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