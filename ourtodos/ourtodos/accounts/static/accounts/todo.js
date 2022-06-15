document.addEventListener('DOMContentLoaded', function() {
    console.log("dom loaded");

    // basic buttons for complete and uncomplete
    document.addEventListener('click', event => {
        if (event.target.className === 'complete') {
            const todoId = event.target.parentNode.id;
            console.log("parentnode " + todoId);
            const todo = document.getElementById(todoId);
            console.log("getelementbyID " + todo);
        }
    });

    function updateComplete(todoId) {
        const todo = document.getElementById(todoId);
        fetch('/task-edit/' + todoId, {
            method: 'PUT',
            body: JSON.stringify({ complete : !todo.complete }),
          })
          console.log("edit made");
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
