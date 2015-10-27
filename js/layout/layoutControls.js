/**
 * @author Luiz Felipe Magalhães Coelho
 */

var resizeTimeout;
var statusConexao;

//MENU
var menuOpen;

function layoutControls(engineRef){
	
	this.init = function(){
		resizeTimeout = false;
		menuOpen = false;
		trataDispositivos();    
         
		
		$(window).on('resize', function(){
		      onResize();		      
		});	
		
		//Escondendo Menu
		//$( "#contentMenu" ).css("left", -$( "#contentMenu" ).width()); 
		
		//Remove POP
		$('#closePop').bind('click', function(event){
			removePop();	 
		});
		$('#closePop').bind('touchend', function(event){
			removePop();	 
		});
		
		if(!config.controles){
			$(".rightControls").css("visibility", "hidden");
			$(".leftControls").css("visibility", "hidden");
		}
	};		
}

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {

        var ratio = [maxWidth / srcWidth, maxHeight / srcHeight ];
        ratio = Math.min(ratio[0], ratio[1]);

        return { width:srcWidth*ratio, height:srcHeight*ratio };
}
var realMenuW = 0;
function onResize(){	
	//console.log('resize');
    if($('#contentMenu').outerWidth() > 600){
    	realMenuW = $('#contentMenu').outerWidth();
	}
    $('#fundoMenu').css('margin-left', "0px");

	leftMargin = Math.round($(window).width()/2 - $('#contentGeral').outerWidth()/2)+"px";
	topMargin = Math.round($(window).height()/2 - $('#contentGeral').outerHeight()/2) - $('.footer').height()  +"px";
	
	leftMarginPop = Math.round($(window).width()/2 - $('#popContainer').outerWidth()/2)+"px";
	topMarginPop = Math.round($(window).height()/2 - $('#popContainer').outerHeight()/2) - $('.footer').height()  +"px";
    
    leftMarginFundoMenu = Math.round($(window).width()/2 - $('#fundoMenu').outerWidth()/2)+"px";
    leftMarginMenu = Math.round($(fundoMenu).width()/2 - realMenuW/2)+"px";
    
    //console.log(realMenuW + " | " + leftMarginMenu + " | " + $(fundoMenu).width() + " | " + $('#contentMenu').outerWidth());
	$('#popContainer').css('margin-top', topMarginPop);
	$('#popContainer').css('margin-left', leftMarginPop);
	
	$('#fundoMenu').css('margin-left', leftMarginFundoMenu);
	$('#contentMenu').css('margin-left', leftMarginMenu);
		
    
    if(navigationController._pageAtualRef != undefined){
    	var fh = 650;
        var fw = 1024;

        var newFh = $(window).height();
        var newFw = $(window).width() - 10;

        var ratio = calculateAspectRatioFit(fw,fh, newFw, newFh);

        switch(navigationController._pageAtualRef.type){

            case "flashCanvas":

            if(getFlashCanvasLib() != undefined){
                //var fh = getFlashCanvasLib().properties.height/2;
                //var fw = getFlashCanvasLib().properties.width/2;

                var fw = ratio.width/2;
                var fh = ratio.height/2;
                /*$('.interactionClass').css('width',  ratio.width);
                $('.interactionClass').css('height',  ratio.height);

                $('.interactionClass').css('top', Math.round($(window).height()/2 - fh) +"px");	
                $('.interactionClass').css('left', Math.round($(window).width()/2 - fw ) +"px");

                $(".interactionClass").contents().find("canvas").css('width',  ratio.width);
                $(".interactionClass").contents().find("canvas").css('height',  ratio.height);*/


                //Menu
                //$('#contentMenu').css('top', Math.round($(window).height()/2) - Math.round($('#contentMenu').height()/2) +"px");	

           }
            break;

            case "template":
                var fw = ratio.width/2;
                var fh = ratio.height/2;
                /*$('.interactionClass').css('width',  ratio.width);
                $('.interactionClass').css('height',  ratio.height);

                $('.interactionClass').css('top', Math.round($(window).height()/2 - fh) +"px");	
                $('.interactionClass').css('left', Math.round($(window).width()/2 - fw) +"px");

               	$(".interactionClass").contents().find("html").css('width',  ratio.width);
                $(".interactionClass").contents().find("html").css('height',  ratio.height);*/

            break;

            default:
                /*if(menuOpen){
                    $( "#contentMenu" ).css("width", menuConfig.menuWidth);			
                    $( "#conteinerGeral" ).css("left", $("#contentMenu").width());
                    $( "#conteinerGeral" ).css("width", $(window).width() - $("#contentMenu").width());					
                    $('#contentGeral').css('top', topMargin);
                }else{
                    $('#contentGeral').css('top', topMargin);	
                    $('#contentGeral').css('left', leftMargin);
                }*/
        }
    }
		 		
}


function getWindowSize(coord){
	if(coord == "x"){
		return $(window).width();
	}else{
		return $(window).height();
	}
}

//--------------------------------------
// OPEN FULL SCREEN
//--------------------------------------

function FullScreen() {
	
	var i = document.getElementById("conteinerScreen");
 
 
	  if(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement){
		//Caso estiver em fullScreen
		if(document.exitFullscreen) {
		    document.exitFullscreen ();
		} else  if  (document.webkitExitFullscreen) {
		    document.webkitExitFullscreen ();
		} else  if  (document.mozCancelFullScreen) {
		    document.mozCancelFullScreen ();
		} else  if  (document.msExitFullscreen) {
		    document.msExitFullscreen ();
		}
		
		
	  }else{ 
		// go full-screen
		if (i.requestFullscreen) {
		    i.requestFullscreen();
		} else if (i.webkitRequestFullscreen) {
		    i.webkitRequestFullscreen();
		} else if (i.mozRequestFullScreen) {
		    i.mozRequestFullScreen();
		} else if (i.msRequestFullscreen) {
		    i.msRequestFullscreen();
		}
	 }
    
}


//--------------------------------------
// TRATAMENTO DE DISPOSITIVOS
//--------------------------------------

function trataDispositivos(){
	
	//BLOQUEIA TOUCH SCROLL
	document.ontouchmove = function(e){ 
	    e.preventDefault(); 
	};
	
	//BLOQUEIA BOUNCE SCROLL
	$(document).bind(
      'touchmove',
          function(e) {
            e.preventDefault();
	      }
	);
	

	// jQuery no-double-tap-zoom plugin
   // Triple-licensed: Public Domain, MIT and WTFPL license - share and enjoy!
	(function($) {
	  var IS_IOS = /iphone|ipad/i.test(navigator.userAgent);
	  $.fn.nodoubletapzoom = function() {
	    if (IS_IOS)
	      $(this).bind('touchstart', function preventZoom(e) {
	        var t2 = e.timeStamp
	          , t1 = $(this).data('lastTouch') || t2
	          , dt = t2 - t1
	          , fingers = e.originalEvent.touches.length;
	        $(this).data('lastTouch', t2);
	        if (!dt || dt > 500 || fingers > 1) return; // not double-tap
	 
	        e.preventDefault(); // double tap - prevent the zoom
	        // also synthesize click events we just swallowed up
	        $(this).trigger('click').trigger('click');
	      });
	  };
	})(jQuery);
	
	//CONTROLA ORIENTAÇÃO MOBILE
	/*$(window).on("orientationchange",function(){
	  if(window.orientation == 0 || window.orientation == 180) // Portrait
	  {
	  	$("#avancar").hide();
	  	$("#voltar").hide();
	    $("#orientatonId").show();
	  }
	  else if(window.orientation == 90 || window.orientation == -90) // Landscape
	  {
	    $("#orientatonId").hide();
	    navigationController.showControles();
	  }
	});	*/
    $(window).on("orientationchange",function(){
       onResize(); 
    });
};



//--------------------------------------
// ALIMENTA HUD
//--------------------------------------
function changePontuation(){
	/*scoreAmarela.attr({	       
       'text':saveObj.scoreAmarela.toString()
  	});
  	
  	scoreVerde.attr({
	   'text':saveObj.scoreVerde.toString()
  	});
  	  	
  	scoreAzul.attr({	  
	   'text':saveObj.scoreAzul.toString()
  	});*/
  	
}


//--------------------------------------
// ABERTURA DO MENU
//--------------------------------------
function menuControll(){
		
	/*if(!menuOpen){	
		
		$( "#contentMenu" ).css("width", menuConfig.menuWidth);	
		$( "#contentMenu" ).css("left", -$("#contentMenu").width());
		$( "#contentMenu" ).css("opacity", 1); 
		//$( "#contentMenu" ).css("zoom", 1); 
		
		
		$( "#contentMenu").animate({
		    left: "0"		    		    
		  }, 1100, function() {
		    // Animation complete.
		});
		
		
		$( "#conteinerGeral" ).animate({
	    left: $("#contentMenu").width(),
	    width:$( "#conteinerGeral" ).width() - $("#contentMenu").width()
		}, 1100, function() {
			//Complete	
						  
		});		
		
		menuOpen = true;
		
	}else{
		
		$( "#contentMenu" ).animate({
		    left: - $("#contentMenu").width()		        
		  }, 1100, function() {
		    // Animation complete.
		});

		$( "#conteinerGeral" ).animate({
	    left: $("#contentMenu").width(),
	    width:"100%",
	    left: "0" 	
		}, 1100, function() {
		  //Complete			 
			  
		});
		
		menuOpen = false;					
	}*/
}

function addPop (type, conteudo) {
    $( "#popup" ).css("visibility", "visible");
    $(".rightControls").css("visibility", "hidden");
	$(".leftControls").css("visibility", "hidden");
    $( "#popup" ).animate({
	    opacity: 1		        
	  }, 1100, function() {
	    // Animation complete.
	});
	
	if(type == "object"){		
		$( "#popContainer" ).append('<object type="text/html" style="width:100%; height:100%; overflow: hidden" data=' + conteudo + ' > </object>' );				 
	 }else{	 	
	    $("#popContainer").append(conteudo);
	 }
}

function removePop(){  
	$(".rightControls").css("visibility", "visible");
	$(".leftControls").css("visibility", "visible");
    $( "#popup" ).animate({
	    opacity: 0	        
	  }, 1100, function() {
	    // Animation complete.
	    $('#closePop').show();
	    $( "#popup" ).css("visibility", "hidden");
	    $( "#popContainer" ).empty();
	});
}