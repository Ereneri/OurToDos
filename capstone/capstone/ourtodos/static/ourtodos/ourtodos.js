document.addEventListener('DOMContentLoaded', function() {
    console.log("howdy");
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
        for (let i = 0; i < data.length; i++) {
                htmlVAR += addDiv(data[i].id, data[i].taskName, data[i].createdBy, data[i].iscomplete);
        }
        htmlVAR += "</ul>";
        document.getElementById('list-wrapper').innerHTML = htmlVAR;
    })
}

// adds task onto DB
function addtask(listid) {
    // get content from add task
    const input = document.getElementById('newtask');
    var taskName = input.value;
    console.log(listid)
    console.log("Input: " + taskName);

    fetch('/addtask', {
        method: 'POST',
        body: JSON.stringify({
            'parentList': listid,
            'taskName': taskName
        })
    })

    // fetchs data from DB to render onto users screen
    fetch('/list/' + listid)
    .then(res => res.json())
    .then(data => {
        var last = data.length-1;
        document.getElementById('list-group').innerHTML += addDiv(data[last].id, data[last].taskName, data[last].createdBy, "false");
    })

    // reset box
    input.value = "";
}

// loads the create list from the DB
function load(id, title) {
    document.getElementById('list-list').style.display = "none";
    loadlist(id, title);
}

// toggle for completing the task
function complete(id, boolean) {
    console.log(id + boolean);

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

    // edit the div
    if (boolean == "true") {
        document.getElementById(`item-${id}`).setAttribute("class", "list-group-item completed");
    }
    else {
        document.getElementById(`item-${id}`).setAttribute("class", "list-group-item");
    }
}

// master function for adding the task elements onto the screen
function addDiv(id, taskName, createdBy, cBool) {
    // start var
    var div = "";

    // change div appear if true
    if (cBool == "true") {
        div += `<li id="item-${id}" class="list-group-item completed">`;

    } else {
        div += `<li id="item-${id}" class="list-group-item ">`;
    }

    // add filler between
    div += `<div class="todo-indicator bg-warning"></div>
        <div class="widget-content p-0">
            <div class="widget-content-wrapper">
            <div class="widget-content-left mr-2">`;

    // change the complete function if complete or not
    if (cBool == "true") {
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
                    </div>

                    <div class="widget-content-right">
                        <div>
                            <div id="delete" style="float:right">✗</div>
                            <div id="edit" style="float:right; margin-right: 1rem; display: block">✏️</div>
                            <div id="save" style="float:right; margin-right: 1rem; display: none">Save</div>
                        </div>
                    </div>

                </div>
            </div>
        </li>`

    return div;
}

function pinTask(id) {

}