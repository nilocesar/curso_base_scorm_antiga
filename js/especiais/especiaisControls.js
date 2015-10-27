/**
 * @author Luiz Felipe Magalhães Coelho
 */

var btsMenuArr = [];
var arrMenuIds = [];

function especiaisControls(engineRef){
	
	this.init = function(){
		
	};		
}

function controleEstados($elem){
    var debug = false;
    var idImg = 0;
    var arrObjPages = config.paginas;
    var btStyle = config.btStyle;
    var pageslen = countIE(arrObjPages);
    //console.log("01: " + $elem);
    
    if($elem != -1){
        for (var i = 0; i < pageslen; i++) {
            if(arrObjPages[i].menu){
                var btnAtual = btsMenuArr[idImg];

                if($elem.data('idImg') != idImg){                  
                    btnAtual.css('background-color', btStyle.normalColor);  
                    if(debug) console.log(" zero " + btnAtual.data('idImg') + " <=> " + btStyle.normalColor + " <=> " + btnAtual.css('background-color'));                
                }else{
                    btnAtual.css('background-color', btStyle.activeColor);
                    if(debug)console.log(btnAtual.data('idImg') + " <=> " + btStyle.activeColor + " <=> " + btnAtual.css('background-color'));            
                }
                btnAtual.css('margin-top', '0px');             
                idImg++;
            }
        }
    }else{
         for (var j = 0; j < countIE(btsMenuArr); j++) {
               var btnAtual = btsMenuArr[j]; 
               btnAtual.css('background-color', btStyle.normalColor);  
               if(debug) console.log(" zero " + btnAtual.data('idImg') + " <=> " + btStyle.normalColor + " <=> " + btnAtual.css('background-color')); 
         }
        
    }
}

function createArrMenu(){
    //console.log("criando array");
    var arrObjPages = config.paginas;
    var pageslen = countIE(arrObjPages);
    var idAtual = 0;
    
    for (var i = 0; i < pageslen; i++) {
        if(arrObjPages[i].menu){
            arrMenuIds[i] = idAtual++;
        }else if(countIE(arrMenuIds) != 0){
            arrMenuIds[i] = arrMenuIds[countIE(arrMenuIds)-1];
        }else{
            arrMenuIds[i] = -1;
        }
    }
}

function hasClass(elem, className) {
      return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
  }

function toggleClass(elem, className) {
  var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
  if (hasClass(elem, className)) {
      while (newClass.indexOf(' ' + className + ' ') >= 0) {
          newClass = newClass.replace(' ' + className + ' ', ' ');
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, '');
  } else {
      elem.className += ' ' + className;
  }
}

function createMenu(){
    var debug = false;
	var arrObjPages = config.paginas;
    var btStyle = config.btStyle;
	var pageslen = countIE(arrObjPages);
	var idImg = 0;	
	//console.log('criando menu');
	
    $("#images").empty();
	//console.log("controle: " + navigationController.indice);
    
    
	for (var i = 0; i < pageslen; i++) {
		
		if(arrObjPages[i].menu){
            $("#contentMenu").append('<div class="menuBts"  id="' + arrObjPages[i].id + '"> </div>');

            btsMenuArr.push($('#'+ arrObjPages[i].id));
            var $elem = btsMenuArr[idImg];

            //$elem.css('width',btStyle.width);
            //$elem.css('height',btStyle.height);
            $elem.css('color',"#FFFFFF");
            $elem.css('text-align', 'center');
            $elem.css('display', 'table');
            $elem.css('cursor', 'hand');
            
            $elem.html("<p style=' display: table-cell; vertical-align: middle; cursor: pointer;'>" + arrObjPages[i].label + "</p>");
            $('#'+ arrObjPages[i].id).data('idImg', idImg);
            
            $elem.css('background-color', btStyle.normalColor);
            if(debug)console.log(" zero " + $elem.data('idImg') + " <=> " + btStyle.normalColor + " <=> " + $elem.css('background-color'));   
           

            $('#'+ arrObjPages[i].id).bind('click', function(event){
                //console.log(event);
                var $elem = $(this);
                var idTela = $elem.context.id;
                //controleEstados($elem);

                if(idTela != navigationController.indice){
                    navigationController.goTela(idTela);
                }
                var toggle = document.querySelector('#contentMenu');
                //console.log("LARGURA MENU " + $('#contentMenu').width());
                if($(window).width() < "910"){
                    toggleClass(toggle, 'contentMenu-mobile-open');
                }
            });

            $('#'+ arrObjPages[i].id).bind('touchend', function(event){
                //console.log(event);
                var $elem = $(this);
                var idTela = $elem.context.id;
                //controleEstados($elem);

                if(idTela != navigationController.indice){
                    navigationController.goTela(idTela);
                }
                var toggle = document.querySelector('#contentMenu');
                //console.log("LARGURA MENU " + $('#contentMenu').width());
                if($(window).width() < "910"){
                    toggleClass(toggle, 'contentMenu-mobile-open');
                }
            });
            idImg++;
            
		}
    };
    engineRef.onResize();
    initMenuMobile();
}

function initMenuMobile(){

  var mobile = document.createElement('div');
  mobile.className = 'contentMenu-mobile';
  document.querySelector('#fundoMenu').appendChild(mobile);

  var toggle = document.querySelector('#contentMenu');
  mobile.onclick = function () {
      toggleClass(toggle, 'contentMenu-mobile-open');
  };
  mobile.addEventListener("touchend", function () {
      toggleClass(toggle, 'contentMenu-mobile-open');
  }, false);
}

function countIE(data){
  //Pega comprimento de arrays no IE
  var length = 0;
  for(var prop in data){
    if(data.hasOwnProperty(prop))
        length++;
  }
  return length;
}