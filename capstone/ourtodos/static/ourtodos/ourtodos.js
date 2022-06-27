document.addEventListener('DOMContentLoaded', function() {
    console.log("howdy");
    loadlist(1);
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

function loadlist(id) {
    fetch('/list/' + id)
    .then(res => res.json())
    .then(data => {
        var htmlVAR = ""
        var listDIV = document.querySelector("#list-wrapper");
        lastDIV.style.display = 'block';
        for (let i = 0; i < data.length; i++) {
            htmlVAR += `
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <div class="todo-indicator bg-warning"></div>
                            <div class="widget-content p-0">
                                <div class="widget-content-wrapper">
                                <div class="widget-content-left mr-2">

                                    <div class="custom-checkbox custom-control">
                                    <input class="custom-control-input"
                                        id="exampleCustomCheckbox12" type="checkbox"><label class="custom-control-label"
                                        for="exampleCustomCheckbox12">&nbsp;</label>
                                    </div>
                                </div>

                                <div class="widget-content-left">
                                    <div id="taskitem" class="widget-heading">${data[i].taskName}</div>
                                    <div class="widget-subheading"><i>${data[i].owner}</i></div>
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
    })
}

function addtask(listid) {
    // get content from add task
    var parentlist = listid;
    var taskName = "Howdy";

    fetch('/addtask/', {
        method: 'POST',
        credentials: 'same-origin',
        headers:{
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
            'X-CSRFToken': csrftoken,
    },
        //JavaScript object of data to POST
        body: JSON.stringify({
            'parentList': parentlist,
            'taskName': taskName
        })
    })
    .then(response => {
        return response.json() //Convert response to JSON
    })
    .then(data => {
    //Perform actions with the response data from the view
        console.log(data);
    })
}

function changeview(id) {
    document.querySelector("#list-list").style.display = 'none';
    loadlist(id);
}
