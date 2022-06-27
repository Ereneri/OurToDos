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

function loadlist(id, title) {
    fetch('/list/' + id)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        document.getElementById('list-wrapper').style.display = "block";
        var htmlVAR = `<h1>${title}</h1><ul class="list-group list-group-flush">`;
        htmlVAR += `
        <li class="list-group-item">
                <div class="widget-content p-0">
                    <div>
                        <form action="#" onsubmit="addtask(${data[0].parentlist}); return false">
                            <input id="newtask" style="border: 0; outline: 0; background: transparent;border-bottom: 1px solid darkgrey; width: 100%;" class="form-control" placeholder="Add Task"></input>
                            <input type="submit" style="display: none"/>
                        </form>
                    </div>
                </div>
        </li>`;
        for (let i = 0; i < data.length; i++) {
            if (data[i].iscomplete == 'true') {
                htmlVAR += `
                <li class="list-group-item completed">
                    <div class="todo-indicator bg-warning"></div>
                        <div class="widget-content p-0">
                            <div class="widget-content-wrapper">
                            <div class="widget-content-left mr-2">

                                <div id="button-container-${data[i].id}" class="custom-checkbox custom-control">
                                <input onclick="complete('${data[i].id}', 'false')" class="custom-control-input" id="button-${data[i].id}" type="checkbox" checked="true"><label class="custom-control-label"
                                    for="button-${data[i].id}">&nbsp;</label>
                                </div>
                            </div>

                            <div class="widget-content-left">
                                <div id="taskitem" class="widget-heading">${data[i].taskName}</div>
                                <div class="widget-subheading"><i>By: ${data[i].createdBy}</i></div>
                            </div>

                            <div class="widget-content-right">
                                <div>
                                    <div id="delete" style="float:right">✗</div>
                                    <div id="edit" style="float:right; margin-right: 1rem">Edit</div>
                                    <div id="save" style="float:right; margin-right: 1rem">Save</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </li>`;
            }
            else {
                htmlVAR += `
                        <li class="list-group-item">
                            <div class="todo-indicator bg-warning"></div>
                                <div class="widget-content p-0">
                                    <div class="widget-content-wrapper">
                                    <div class="widget-content-left mr-2">

                                        <div id="button-container-${data[i].id}" class="custom-checkbox custom-control">
                                        <input onclick="complete('${data[i].id}', 'true')" class="custom-control-input" id="button-${data[i].id}" type="checkbox"><label class="custom-control-label"
                                            for="button-${data[i].id}">&nbsp;</label>
                                        </div>
                                    </div>

                                    <div class="widget-content-left">
                                        <div id="taskitem" class="widget-heading">${data[i].taskName}</div>
                                        <div class="widget-subheading"><i>By: ${data[i].createdBy}</i></div>
                                    </div>

                                    <div class="widget-content-right">
                                        <div>
                                            <div id="delete" style="float:right">✗</div>
                                            <div id="edit" style="float:right; margin-right: 1rem">Edit</div>
                                            <div id="save" style="float:right; margin-right: 1rem">Save</div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </li>`;
            }
        }
        htmlVAR += "</ul>";
        document.getElementById('list-wrapper').innerHTML = htmlVAR;
    })
}



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
      .then(response => response.json())
      .then(result => {
          // Print result
          console.log(result);
      });

    // reset box
    input.value = "";
}

function load(id, title) {
    document.getElementById('list-list').style.display = "none";
    loadlist(id, title);
}

function complete(id, boolean) {
    console.log(id + boolean);
    if (boolean == 'true') {
        document.getElementById(`button-container-${id}`).innerHTML =
        `<input onclick="complete('${id}', 'false')" class="custom-control-input" id="button-${id}" type="checkbox" checked="true"><label class="custom-control-label" for="button-${id}">&nbsp;</label>`;
    } else {
        document.getElementById(`button-container-${id}`).innerHTML =
        `<input onclick="complete('${id}', 'true')" class="custom-control-input" id="button-${id}" type="checkbox"><label class="custom-control-label" for="button-${id}">&nbsp;</label>`;

    }
}
