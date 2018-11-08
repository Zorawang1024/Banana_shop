
 //main
 $(document).ready(function(e) {
  
    $( "#dialog1" ).dialog({
      autoOpen: false
    });
    
    $("#opener").click(function() {

      
      $("#dialog1").dialog('open');


      $.ajax({
        url: "/api/products",
        method: "GET"
      }).done(function(msg) {
      
        console.log(msg);
        
        
      }).fail(function(data, status){
      alert(status);
      }); 



    });
    
  });
   // end ready
 
 
 
 


