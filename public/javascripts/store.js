
 
 //main
 $(document).ready(function(e) {
   console.log('Hello');

   var x= document.getElementsByClassName("add-to-cart");
  
   $('#dialog1').dialog({ modal : true, autoOpen : false });
    
    $("#opener").click(function() {
      $("#dialog1").dialog('open');
    });

  

 }); // end ready
 
 
 
 


