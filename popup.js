var newPreset = [];
var tempArray = [];


startup();


function startup(){
    chrome.storage.sync.get({
        list:[]
    }, function(data) {
        tempArray = data.list;
    })
    
    chrome.storage.sync.get({
        list:[]
    }, function(data) {
        addList(data.list);
    })
    document.getElementById("form").style.display = "none";
    document.getElementById("alert").style.display = "none";

    addEventListener('keydown', function(e){
        if (e.keyCode == 13){
            doneButton();
            event.preventDefault();
        }
    })
}

plusButton();
var buttonid1 = document.getElementById('done');
buttonid1.addEventListener('click', function leave(){
    doneButton();
})

addURLFunction();
addCurrentTabs();
addCancelButton();

//==================================================================================//
//                                                                                  //
//Adding/Editing List and Storage                                                   //
//                                                                                  //
//==================================================================================//

function plusButton(){

    var buttonid = document.getElementById('addPreset');
    buttonid.addEventListener('click', function createSet(){

        document.getElementById("main").style.display = "none";
        document.getElementById("form").style.display = "block";

        document.getElementById("numb").value = "";

    })
}

function addToStorage(){
    
    //get current array
    chrome.storage.sync.get({
        list:[] //put defaultvalues if any
    },
    function(data) {
        update(data.list); //storing the storage value in a variable and passing to update function
});

function update(array)
   {
    array.push(newPreset);
    //then call the set to update with modified value
    chrome.storage.sync.set({
        list:array
    });
    }
}
//Runs until reaches end of bigArray
function addList(curArray){

    var container = document.getElementById("myDIV");
    container.innerHTML = ' ';

    for (i in curArray){

        //Create div with Name, Edit, and Delete visuals
        {
        var para1 = document.createElement("div");          
        para1.className = "opendiv";
        para1.setAttribute('id', i + "div");
        document.getElementById("myDIV").appendChild(para1);
        para1obj = document.getElementById(i + "div");
        para1obj.addEventListener('mouseenter', function showEditAndDelete(){
            var num = parseInt(event.target.id);
            var obj = document.getElementById(num + "edit");
            var obj0 = document.getElementById(num + "delete");
            obj.style.display = "block";
            obj0.style.display = "block";
        });
        para1obj.addEventListener('mouseleave', function hideEditAndDelete(){
            var num = parseInt(event.target.id);
            var obj = document.getElementById(num + "edit");
            var obj0 = document.getElementById(num + "delete");
            obj.style.display = "none";
            obj0.style.display = "none";
        });
        }

        //Create Name and append to div
        {
        var para = document.createElement("P");
        para.innerHTML = curArray[i][0];
        para.className = "papersheet";
        document.getElementById(i + "div").appendChild(para);
        para.setAttribute("id", i);
        }
        
        //Create Edit and append to div
        {
        var para0 = document.createElement("P");
        para0.className = "edit";
        para0.innerHTML = "(edit |";
        para0.setAttribute('id', i + "edit");
        para0.style.display = "none";
        document.getElementById(i + "div").appendChild(para0);

        var para0obj = document.getElementById(i + "edit");
        para0obj.addEventListener('click', function editArray(){
            
            document.getElementById("main").style.display = "none";
            document.getElementById("form").style.display = "block";
            
            var selectedArray = ["selectedArrayName", "url1", "url2", "url3"];

            document.getElementById("numb").value = selectedArray[0];
            
            for (var i = 0; i < selectedArray.length - 1; i++){
                
                console.log(i);
                var field = document.createElement("input");
                field.setAttribute("id", i);
                field.setAttribute("placeholder", "Add URL: (https://...");
                field.className = "urls";
                document.getElementById("container").appendChild(field);


                console.log(selectedArray[i]);
                document.getElementById(i).value = selectedArray[i];
            }

            //array.splice(position in big Array, 1, new array)
            populate();
        })
        }

        //Create Delete and append to div
        {
        var para2 = document.createElement("P");
        para2.className = "delete";
        para2.innerHTML = " delete)";
        para2.setAttribute('id', i + "delete");
        para2.style.display = "none";
        document.getElementById(i + "div").appendChild(para2);

        var para2obj = document.getElementById(i + "delete");
        para2obj.addEventListener('click', function deleteArray(){
            var num = parseInt(event.target.id);
            tempArray.splice(num, 1);

            console.log(tempArray);

            addList(tempArray);
            run(num);
        })
        }

        //Open the URLS on click
        {
        var listenerid = document.getElementById(i);//.addEventListener('click', function openThing(){
        listenerid.addEventListener('click', function openThing(){
            pvtNum = parseInt(event.target.id);

            for(var a = 1; a < curArray[pvtNum].length; a++){
                chrome.tabs.create({
                    url: curArray[pvtNum][a]
                })
            }
        })
    }}
}

function populate(){

}

function run(num2){
    
    //get current array
    chrome.storage.sync.get({
        list:[] //put defaultvalues if any
    },
    function(data) {
        var array = data.list
        array.splice(num2, 1);
        console.log(array);
        //then call the set to update with modified value
        chrome.storage.sync.set({
            list:array
        });
    });
}
//==================================================================================//
//                                                                                  //
//Adding Form                                                                       //
//                                                                                  //
//==================================================================================//

var x = 0;

function doneButton(){

        var name = document.getElementById("numb").value;

        if (name.length == 0){
            //alert("too short. Origin: doneButton");
            document.getElementById("alert").style.display = "block";
            document.getElementById("alert").innerHTML = "&#9888 Write a Name! &#9888";
            return;
        }
        if(name.length > 18) {
            //alert("too long. Origin: doneButton");
            document.getElementById("alert").style.display = "block";
            document.getElementById("alert").innerHTML = "&#9888 Name is too long! &#9888";
            return;
        }
        if(name.length != 0, name.length < 18){

            document.getElementById("alert").style.display = "none";
            document.getElementById("main").style.display = "block";
            document.getElementById("form").style.display = "none";
            newPreset = [name];
        
            var divs = document.getElementsByClassName('urls');

            for (var i = 0; i < divs.length; i++){
                //console.log("done");
                newPreset.push(divs[i].value);
            }

            //Wrap up Form
            tempArray.push(newPreset);
            addList(tempArray);
            addToStorage();
        }
}

function addCurrentTabs(){

    var buttonid2 = document.getElementById('addCurrent');
    buttonid2.addEventListener('click', function add(){
        
        var name1 = document.getElementById("numb").value;

        if (name1.length == 0){
            //alert("too short. Origin: addCurrentTabs");
            document.getElementById("alert").style.display = "block";
            document.getElementById("alert").innerHTML = "&#9888 Write a Name! &#9888";
            return;
        }
        if(name1.length > 18) {
            //alert("too long. Origin: addCurrentTabs");
            document.getElementById("alert").style.display = "block";
            document.getElementById("alert").innerHTML = "&#9888 Name is too long! &#9888";
            return;
        }
        if(name.length != 0, name.length < 18){
            
            document.getElementById("alert").style.display = "none";
            newPreset = [name1];
            chrome.tabs.query({currentWindow : true}, function(tabs){
                for(var i = 0; i < tabs.length; i++){
                    //get tab URL
                    var curTab = tabs[i];
                    var URL = curTab.url;
                
                    newPreset.push(URL);
                }
            })

            tempArray.push(newPreset);
            addList(tempArray);
            addToStorage();

            document.getElementById("main").style.display = "block";
            document.getElementById("form").style.display = "none";
        }
    })
}

function addURLFunction(){
    var divID = document.getElementById('dropbox');
    divID.addEventListener('click', function adding(){
        var obj = document.createElement("input");
        x = x + 1;
        obj.setAttribute("id", x);
        obj.setAttribute("placeholder", "Add URL: (https://...)");
        obj.className = "urls";
        document.getElementById("container").appendChild(obj);

        //alert("will add later lol");
    })
}

function addCancelButton(){
    var cancelid = document.getElementById("cancel");
    cancelid.addEventListener('click', function cancel(){

        document.getElementById("main").style.display = "block";
        document.getElementById("form").style.display = "none";

    })
}