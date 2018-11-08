//html body onload="Load()" tag
function Load(){
 
 $.ajax({
      url: "/api/products",
      method: "GET"
    }).done(function(msg) {
    
      console.log(msg);
      //DO MAIN GET
      var i=0;
      for(i=0; i<msg.length; i++){
        var userName= msg[i].user_name;
        var taskName= msg[i].task;
        var complete= msg[i].complete;
        
        if(taskName===""){return false;} 
        if(userName===""){return false;}
        var taskHTML = '<li><span class="done">%</span>'
            taskHTML += '<span class="edit">+</span>'
            taskHTML += '<span class="delete">x</span>'
            taskHTML += '<span class="task"></span></li>'
        var $newTask = $(taskHTML);
        $newTask.find('.task').text(taskName+"    "+userName+"    ");
        
        if(complete){
          var $completeTask = $(taskHTML);
          $completeTask.find('.task').text(taskName+"    "+userName+"    "+"*"+"    ");
          $('#completed-list').prepend($completeTask);}
        else{$('#todo-list').prepend($newTask);}
      }
      
      
    }).fail(function(data, status){
    alert(status);
    }); 
 
}



 
 //main
 $(document).ready(function(e) {
   console.log('Hello');
  

 }); // end ready
 
 
 
 


