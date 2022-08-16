const submitButton = document.getElementById('input-submit');
const todoInput = document.getElementById('input-todo');
const list = document.getElementById('list')
const deleteButtonsClass = document.querySelectorAll('.list-item-del-button')
const groupName = document.getElementById('input-group-name')
const groupColor = document.getElementById('input-group-color')
const addGroupButton = document.getElementById('add-group-button')
const groupSelectDropdown = document.getElementById('group-select')
const dueDateInput = document.getElementById('due-date-input')
var currentGroupLoaded = 'ALL TASKS'
var coll = document.getElementsByClassName("collapsible-content");


// get a new date (locale machine date time)
var date = new Date();
// get the date as a string
var n = date.toDateString();
// get the time as a string
var time = date.toLocaleTimeString();
document.getElementById('title').innerHTML = n 



loadTodosFromLocalStorage()

submitButton.addEventListener("click", e => {
    if (todoInput.value != '') {
        createNewTodo(todoInput.value)
        
    }
})

for (var i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }

document.addEventListener("click", e => {
    
    if (e.target.className == 'list-item-del-button') {
        deleteTodo(e.target)

    }


    else if (e.target.className == 'group-on-display' | e.target.tagName.toLowerCase() == 'p') {
        
        var x = e.target.innerHTML
        if (e.target.className == 'group-on-display') x = e.target.childNodes[0].innerHTML


        if (e.target.innerHTML != currentGroupLoaded | e.target.childNodes[0].innerHTML != currentGroupLoaded) {


            if (e.target.innerHTML == 'ALL TASKS' || e.target.childNodes[0].innerHTML == 'ALL TASKS') {
                //delete current tasks being displated
                child = list.lastElementChild
                while (child) {
                list.removeChild(child);
                child = list.lastElementChild;
                }


                //load all tasks
                for (var g = 0;  g <= localStorage.length -1 ; g++) {
                    var tasksToLoadArray = Array.from(JSON.parse(localStorage.getItem(localStorage.key(g)))['todos'])
                    var tasksToLoadColor = JSON.parse(localStorage.getItem(localStorage.key(g)))['color']

                    tasksToLoadArray.forEach(task => {
                        var newTodoContainer = document.createElement('div')
                        var newTodo = document.createElement('div')
                        var deleteButton = document.createElement('button')
                        var dueDateText = document.createElement('p')
        
                        newTodoContainer.className = 'list-item'
                        var gc = tasksToLoadColor
                        newTodoContainer.style.backgroundColor = gc
                        newTodo.className = 'list-item-content'
                        deleteButton.className = 'list-item-del-button'
                    
                        
        
                        newTodo.innerHTML = task
                        deleteButton.innerHTML = 'X'
        
                        if (gc == 'white'); newTodo.style.color = 'black'
        
                        list.appendChild(newTodoContainer)
                        newTodoContainer.appendChild(newTodo)
                        newTodoContainer.appendChild(dueDateText)
                        newTodoContainer.appendChild(deleteButton)
        
                    
                        
                    
                    })
                   
                }

                currentGroupLoaded = 'ALL TASKS'

            }

            else {

            


            if (typeof x === 'undefined') x = 'ALL TASKS'
    
            

            var tasksToLoadArray = Array.from(JSON.parse(localStorage.getItem('group_'+x))['todos'])
            var tasksToLoadColor = JSON.parse(localStorage.getItem('group_'+x))['color']
            
            //delete all the other todos from our list but NOT from ls
            child = list.lastElementChild
            while (child) {
            list.removeChild(child);
            child = list.lastElementChild;
            }

            //load our todos that we want to display
            tasksToLoadArray.forEach(task => {
                var newTodoContainer = document.createElement('div')
                var newTodo = document.createElement('div')
                var deleteButton = document.createElement('button')
                var dueDateText = document.createElement('p')

                newTodoContainer.className = 'list-item'
                var gc = tasksToLoadColor
                newTodoContainer.style.backgroundColor = gc
                newTodo.className = 'list-item-content'
                deleteButton.className = 'list-item-del-button'
            
                

                newTodo.innerHTML = task
                deleteButton.innerHTML = 'X'

                if (gc == 'white'); newTodo.style.color = 'black'

                list.appendChild(newTodoContainer)
                newTodoContainer.appendChild(newTodo)
                newTodoContainer.appendChild(dueDateText)
                newTodoContainer.appendChild(deleteButton)

            
                
            })
            currentGroupLoaded = x
        }


            //set our currently loaded group

        }


    
    
    
    
    }

    else if (e.target.className == 'group-delete-button') {
        var groupWeWantToDelete = e.target.previousSibling.innerHTML
   
        //delete from select list
        Array.from(groupSelectDropdown.children).forEach(groupOption => {
            var groupName = groupOption.innerHTML
            if (groupName == groupWeWantToDelete){
                groupOption.parentNode.removeChild(groupOption)


            }})





        function GroupIsEmpty(groupName) {
            var todosInGroup = Array.from(JSON.parse(localStorage.getItem('group_'+groupName))['todos'])
            
            if (todosInGroup.length == 0) return true
            else return false

        }

        function deleteGroup(groupName) {
            var ArraytodosInTargetGroup = Array.from(JSON.parse(localStorage.getItem('group_'+groupName))['todos'])
            
            //just remove the ones currently present in the list
            var currentListChildren = Array.from(list.childNodes)
            for (var c = 0; c<= currentListChildren.length -1; c++) {
                var text = currentListChildren[c].firstChild.innerHTML
                
                if (ArraytodosInTargetGroup.includes(text)) {
                    currentListChildren[c].remove()
                }



            }


            //remove from local storage
            localStorage.removeItem('group_'+groupName)
            //delete all content inside
            e.target.parentNode.remove()
            e.target.parentNode.innerHTML = ""
            //delete group element itself

            




        }

        


        // if the group is empty delete group
        if (GroupIsEmpty(groupWeWantToDelete)) {
            deleteGroup(groupWeWantToDelete)



        }


        // if not empty prompt a modal, if the modal confirms the delete, then delete the group 
        else {
            openModal()
            deleteGroup(groupWeWantToDelete)


        }

    }

})

addGroupButton.addEventListener("click", e => {
    if (groupName.value != "") {

    var newGroupOption = document.createElement('option')
    newGroupOption.innerHTML = groupName.value
    groupSelectDropdown.appendChild(newGroupOption)

    var groupData = {
        "color": groupColor.value,
        "todos": []


    }

    localStorage.setItem('group_' + groupName.value, JSON.stringify(groupData))

    function addGroupDisplay() {
    
        var groupElement = document.createElement('div')
        groupElement.className = 'group-on-display'
        groupElement.style.backgroundColor = groupColor.value

        var groupDeleteButton = document.createElement('button')
        groupDeleteButton.className = 'group-delete-button'
        groupDeleteButton.innerHTML = 'X'

        var groupNameTextElement = document.createElement('p')
        groupNameTextElement.innerHTML = groupName.value

        

        var groupElementContainer = document.getElementById('group-display')
        groupElementContainer.appendChild(groupElement)
        groupElement.appendChild(groupNameTextElement)
        groupElement.appendChild(groupDeleteButton)
        

    }
    addGroupDisplay()

    groupName.value = ''
}
})


// document.addEventListener('keydown', e => {
//     //FOR DEBUGGINH
//     if (e.key == 'l') {

//         console.log(localStorage)
//     }
//     else if (e.key == 'Enter') {
//         submitButton.click()

//     }

//     else if (e.key == 'c' && e.metaKey == true) {
//         localStorage.clear()
//     }
  

// })


function loadTodosFromLocalStorage(){
    

    //create general group
    function defaultGroup() {
    var groupData = {
        'color': '#ffffff',
        'todos': []
    }

    function generalExists(){
        if (localStorage.getItem('group_ALL TASKS') != null) return true
        else return false


    }

    if (generalExists()) return
    else localStorage.setItem('group_ALL TASKS', JSON.stringify(groupData))
    }


    defaultGroup()


    for (var group = 0; group <= localStorage.length -1; group++) {
        
        // if the key is a group
        if (localStorage.key(group).toString().substring(0,5) == 'group') {
            var groupValue = JSON.parse(localStorage.getItem(localStorage.key(group)))
            var colorOfGroup = groupValue['color']
            var todosArray = groupValue['todos']
           

            Array.from(todosArray).forEach(todoString => {
                var newTodoContainer = document.createElement('div')
                var newTodo = document.createElement('div')
                var deleteButton = document.createElement('button')

                newTodoContainer.className = 'list-item'
                newTodoContainer.style.backgroundColor = colorOfGroup
                newTodo.className = 'list-item-content'
                deleteButton.className = 'list-item-del-button'

                newTodo.innerHTML = todoString
                deleteButton.innerHTML = 'X'

                if (colorOfGroup == '#ffffff'); newTodo.style.color = 'black'


                list.appendChild(newTodoContainer)
                newTodoContainer.appendChild(newTodo)
                newTodoContainer.appendChild(deleteButton)



            })




        }



    }

    // load all the groups for selection
    for (var i = 0; i<= localStorage.length - 1; i++) {

        if (localStorage.key(i).toString().substring(0,5) == 'group' && localStorage.key(i).toString() != 'group_ALL TASKS') {
            function addDropDowns(){
            var newGroupOption = document.createElement('option')
            newGroupOption.innerHTML = localStorage.key(i).toString().split('_')[1]
            groupSelectDropdown.appendChild(newGroupOption)
            }
            function addGroupsDisplays(){
                var newGroupDisplay = document.createElement('div')
                var groupDisplayTextElement =document.createElement('p')
                groupDisplayTextElement.innerHTML  = localStorage.key(i).toString().split('_')[1]

                newGroupDisplay.style.backgroundColor = JSON.parse(localStorage.getItem(localStorage.key(i)))['color']
                newGroupDisplay.className = 'group-on-display'
                var display = document.getElementById('group-display')
                display.appendChild(newGroupDisplay)
                newGroupDisplay.appendChild(groupDisplayTextElement)

                var groupDeleteButton = document.createElement('button')
                groupDeleteButton.className = 'group-delete-button'
                groupDeleteButton.innerHTML = 'X'
                newGroupDisplay.appendChild(groupDeleteButton)
        


            }
            addDropDowns()
            addGroupsDisplays()


        }


    }

}




function createNewTodo(todoText) {
    var newTodoContainer = document.createElement('div')
    var newTodo = document.createElement('div')
    var deleteButton = document.createElement('button')
    var dueDateText = document.createElement('p')
    var collabsableContent = document.createElement('div')

    newTodoContainer.className = 'list-item'
    var gc = JSON.parse(localStorage.getItem('group_'+groupSelectDropdown.value))['color']
    newTodoContainer.style.backgroundColor = gc
    newTodo.className = 'list-item-content'
    deleteButton.className = 'list-item-del-button'
    collabsableContent.className = 'collabsible-content'
   
    

    newTodo.innerHTML = todoText

    dueDateText.innerHTML = dueDateInput.value
    deleteButton.innerHTML = 'X'

    if (gc == 'white'); newTodo.style.color = 'black'

    list.appendChild(newTodoContainer)
    newTodoContainer.appendChild(newTodo)
    newTodoContainer.appendChild(dueDateText)
    newTodoContainer.appendChild(deleteButton)
    


    todoInput.value = ''

    function appendToLocalStorage() {
        const deleteButtonsClass = document.querySelectorAll('.list-item-del-button')
        var numOfTodosStored = deleteButtonsClass.length
        var selectedGroup = $('#group-select').val()

        
        var groupValue = JSON.parse(localStorage.getItem('group_' + selectedGroup))
        groupValue['todos'].push(todoText)
        
        var newData = {
            'color': groupValue['color'],
            'todos': groupValue['todos']
        }

        localStorage.setItem('group_'+selectedGroup, JSON.stringify(newData))
        
    


    }
    appendToLocalStorage()



}

function deleteTodo(target) {
    const siblingNode = target.previousElementSibling
    const parent = target.parentNode

    siblingNode.parentNode.removeChild(siblingNode)
    target.parentNode.removeChild(target)
    parent.parentNode.removeChild(parent)

    function removeFromLocalStorage() {
        for(var group = 0; group <= localStorage.length-1; group ++) {
            var data = JSON.parse(localStorage.getItem(localStorage.key(group)))
            var todoArray = Array.from(data['todos'])

            todoArray.forEach(todo => {
                if (siblingNode.innerHTML == todo) {
                    todoArray = todoArray.filter(function(value, index, arr){
                        return value != todo
                    })
                    


                }


            })

            var newData = {
                'color': data['color'],
                'todos': todoArray
            }

            localStorage.setItem(localStorage.key(group), JSON.stringify(newData))
            



        }


    }
    removeFromLocalStorage()

}

