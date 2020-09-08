var newPreset = [];
var tempArray = [];


startup();


function startup(){
    chrome.storage.sync.get({
        list:[]
    }, function(data) {
        tempArray = data.list;
        console.log(tempArray);
    })
    
    chrome.storage.sync.get({
        list:[]
    }, function(data) {
        addList(data.list);
    })
    document.getElementById("form").style.display = "none";
    document.getElementById("alert").style.display = "none";
}

plusButton();
doneButton();
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
        
        var para1 = document.createElement("div");          
        para1.className = "opendiv";
        para1.setAttribute('id', i + "div");
        document.getElementById("myDIV").appendChild(para1);
        para1obj = document.getElementById(i + "div");
        para1obj.addEventListener('mouseenter', function showEditAndDelete(){
            var num = parseInt(event.target.id);
            console.log(num);
            var obj = document.getElementById("edit" + num);
            var obj0 = document.getElementById("delete" + num);
            obj.style.display = "block";
            obj0.style.display = "block";
        });
        para1obj.addEventListener('mouseleave', function hideEditAndDelete(){
            var num = parseInt(event.target.id);
            console.log(num);
            var obj = document.getElementById("edit" + num);
            var obj0 = document.getElementById("delete" + num);
            obj.style.display = "none";
            obj0.style.display = "none";
        });
        
        var para = document.createElement("P");
        para.innerHTML = curArray[i][0];
        para.className = "papersheet";
        document.getElementById(i + "div").appendChild(para);
        para.setAttribute("id", i);
    
        var para0 = document.createElement("P");
        para0.className = "edit";
        para0.innerHTML = "(edit |";
        para0.setAttribute('id', "edit" + i);
        para0.style.display = "none";
        document.getElementById(i + "div").appendChild(para0);

        var para0obj = document.getElementById("edit" + i);
        para0obj.addEventListener('click', function editArray(){
            alert("yay");
        })

        var para2 = document.createElement("P");
        para2.className = "delete";
        para2.innerHTML = " delete)";
        para2.setAttribute('id', "delete" + i);

        para2.style.display = "none";
        document.getElementById(i + "div").appendChild(para2);

        var para2obj = document.getElementById("delete" + i);
        para2obj.addEventListener('click', function deleteArray(){
            alert("yay but less");
        })

        //Open the URLS
        var listenerid = document.getElementById(i);//.addEventListener('click', function openThing(){
        listenerid.addEventListener('click', function openThing(){
            pvtNum = parseInt(event.target.id);

            for(var a = 1; a < curArray[pvtNum].length; a++){
                chrome.tabs.create({
                    url: curArray[pvtNum][a]
                })
            }
        })
    }

}

//==================================================================================//
//                                                                                  //
//Adding Form                                                                       //
//                                                                                  //
//==================================================================================//

var x = 0;

function doneButton(){

    var buttonid1 = document.getElementById('done');
    buttonid1.addEventListener('click', function leave(){

        var name = document.getElementById("numb").value;
        
        console.log(name.length);

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
    })
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
                console.log(tabs);
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