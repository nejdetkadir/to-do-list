var todoController = (function() {
    
    var Todo = function(id, description) {
        this.id = id;
        this.description = description;
        this.time = new Date().getFullYear() + '/' + new Date().getMonth() + '/' + new Date().getDay();
    };

    var data = {
        allItems: []
    };

    return {
        addItem: function(desc) {
            var newItem, ID;
            
            // Create new ID
            if (data.allItems.length > 0) {
                ID = data.allItems[data.allItems.length-1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item
            newItem = new Todo(ID, desc);
            
            // Push it into our data structure
            data.allItems.push(newItem);

            // Return the new element
            return newItem;
        },

        deleteItem: function(id) {
            var ids, index;
            ids = data.allItems.map(function(curr) {
                return curr.id;
            });
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems.splice(index, 1);
            } 
        },
        
        testing: function() {
            console.log(data);
        }
    };
    
})();

var UIController = (function() {

    var DOMStrings = {
        inputField: '.action_input',
        todoList: '.willList',
        addBut: '.add-button',
        container: '.main',
        delBut: 'deleteButton'
    };

    return {

        getInput: function() {
            return document.querySelector(DOMStrings.inputField).value;            
        },

        addListItem: function(obj) {
            var html, newHtml, element;

            element = DOMStrings.todoList;
            html = '<div class="item" id="will-%id%"><div class="right floated content"><button class="ui inverted red button deleteButton"><i class="trash alternate icon"></i></button></div><div class="content"><div class="header todo">%description% (%time%)</div></div></div>';

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%time%', obj.time);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearField: function() {
            var field;
            field = document.querySelector(DOMStrings.inputField);
            field.value = "";
            field.focus();
        },

        getDOMStrings: function() {
            return DOMStrings;
        }
    };

})();

var controller = (function(todoCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.addBut).addEventListener('click', ctrlAddItem);
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID;
        
        if (event.path[0].parentNode.classList[4] === UICtrl.getDOMStrings.delBut) {
            itemID = event.target.parentNode.parentNode.id;
        } else if (event.path[0].classList[4] === UICtrl.getDOMStrings.delBut) {
            itemID = event.target.parentNode.parentNode.parentNode.id;
        }

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item from the data structure
            todoCtrl.deleteItem(ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
        }
    };

    var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();

        if (input !== "") {
            // 2. Add the item to the to do controller
            newItem = todoCtrl.addItem(input);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem);
            
            // 4. Clear the fields
            UICtrl.clearField();
        }        
    };

    return {
        init: function() {
            console.log('Application has started.');
            setupEventListeners();
        }
    };
    
})(todoController, UIController);

controller.init();