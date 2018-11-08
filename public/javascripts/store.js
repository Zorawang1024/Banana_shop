
 //main
 $(document).ready(function(e) {
  
    
    $("#opener").click(function() {
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
 
 
 
 


