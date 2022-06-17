document.addEventListener('DOMContentLoaded', function() {
    var UserID = getID();

    function getID() {
        fetch('/getUser/')
        .then(response => response.json())
        .then(data => {
            UserID = data.id;
        });
    }
    console.log("dom loaded");

    // basic buttons for complete and uncomplete
    document.addEventListener('click', event => {
        // console.log("clicked");
        // console.log(event.target.className);
        // should make a call to the database and flip the boolean for the complete task 
        if (event.target.className === 'text-div') {
            console.log("toggle for task complete");
            // const todoId = event.target.id;
            // updateComplete(todoId);
        }
        // should find the task id and remove and it from the database
        if (event.target.className === 'task-delete') {
            console.log("button for task delete");
        }
        // should edit div to allow for input and make a request to edit the database info
        if (event.target.className === 'task-edit') {
            console.log("button for task edit");
        }
    });

    function updateComplete(todoId) {
        fetch('/task-detail/' + todoId)
        .then(res => {
            if (res.ok) {console.log("Get Success")}
            else {console.log("Get Failed")}
            return res
        })
        .then(data => {
            console.log(data);
            fetch(`/task-edit/${todoId}/`, {
                method: 'PUT',
                body: JSON.stringify(
                    { 
                        complete: !data['complete']
                    }
                )
            })
            .then(res => {
                if (res.ok) {console.log("Update Success")}
                else {console.log("Update Failed")}
                return res
            })
            console.log("edit made");
        })
    }

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

    const edits = document.querySelectorAll('.edit');
});
