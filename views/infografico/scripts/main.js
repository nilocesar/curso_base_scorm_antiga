$( document ).ready
(
 function()
 {
  // CSS INIT
     
     // ONLOAD
  $(window).load
  (
   function()
   { 
       callPage ("1.html");   
       
       
       
       
       
       $("body").scorm_start(); /// inicaliza o scorm

       setTimeout(function () {

            window.moveTo(0, 0);
            window.resizeTo(screen.width, screen.height);

            top.window.moveTo(0, 0);
            if (document.all) {
                top.window.resizeTo(screen.availWidth, screen.availHeight);
            } else if (document.layers || document.getElementById) {
                if (top.window.outerHeight < screen.availHeight || top.window.outerWidth < screen.availWidth) {
                    top.window.outerHeight = screen.availHeight;
                    top.window.outerWidth = screen.availWidth;
                }
            }

        }, 1000 * 0.2);
   }
  );
 }
);



function createBtn (){
    
    for(var i = 1; i<= 4; i++){
        
        $(".btn"+i).attr("indice",i);
        $(".btn"+i).on("click",function(){
            callPage ($(this).attr("indice")+".html");
            
            if($(this).attr("indice") == 4){
                $("body").scorm_complete();
            }
            
        });
    }
}



 $(window).unload(
    function () {
        $('body').scorm_quit();
    }
 );


function callPage (path){
  var contentPage;
    $.ajax(
      { 
        url: path,
        cache: true,
        success: function( _page )
        {
         contentPage = _page;
        },
        error:function() 
        { 
         //alert("error"); 
        },
        complete:function() 
        {
        //console.log(contentPage);
         $("#container").empty();
         $("#container").html(contentPage);
            createBtn();
        }});
}