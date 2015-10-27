//--------------------------------------
// VARIAVEIS
//--------------------------------------

//REFERENCIA DA WINDOWN MAIN PARA AS CLASSES
var engineRef = this;
//CONTROLLERS
var scormController;
var navigationController;
var layoutController;
var especiaisController;
var deepLinkController;

//Object data da view atual
var objView;

/**Esta variável contém todas as informações de configurações do arquivo config.js dentro de view:*/
var config;
var flashCanvasLib;
var lastViewHeight = 0;
var lastViewTop = 0;

//Array contendo as informações das views em forma de objeto.
var arrViews = [];
var containers = [];


//Controles de navegacao
var viewLoadedAtual = null;
var viewAnterior = null;
var indiceAnterior = null;
var iniciando = true;


//Lendo o objeto de produtos para fazer a pesquisa
var produtosObj;
var produtosSearchObj;

loadJsonLocal('data/produtos.js', function(json){
    produtosObj = json;    
});


//--------------------------------------
// READY
//--------------------------------------
$(document).ready
(
	function()
	{	
		$(window).load
		(
			function()
			{
				loadJsonLocal('configs/config.js', function(json){
					config = json;
					onDocumentReady(); 
				});
              	loadSpecialsControls();
			}
		);						
	}
);


$(window).unload
(
	function()
	{
		//SALVANDO OS DADOS NO LMS AO FECHAR A JANELA.
		scormController.save();
        scormController.disconnect();
	}
);

function loadJsonLocal(json, callback){    
  var debug = false;
  getScript(json, function(){
    if(debug)console.log(data);
    callback(data);
  });
}// end fn

function getScript(url, callback) {
   var script = document.createElement('script');
   script.charset = "UTF-8";
   script.type = 'text/javascript';
   script.src = url;

   //script.onreadystatechange = callback;
   script.onload = callback;

   document.getElementsByTagName('head')[0].appendChild(script);
}

//Para arquivos offLine
function receiveMessage(event){
    var arrReceive = event.data.split("|");
    
    console.log(event.data);
    console.log(arrReceive);
    //var parametro = event.data.split("|")[1];
    if(arrReceive[0] == "function"){
      //navigationController.goTela(arrReceive[2]);
      eval(arrReceive[1])
    }else if(arrReceive[0] == "hideNavegacao"){
        //parent.postMessage("hideNavegacao" , "*");
        $("#avancar").hide();
        $("#voltar").hide();
        $("#fundoMenu").hide();
        window.dispatchEvent(new Event('resize'));
    }else if(arrReceive[0] == "showNavegacao"){
        //parent.postMessage("showNavegacao" , "*");
        $("#avancar").show();
        $("#voltar").show();
        $("#fundoMenu").show();
        window.dispatchEvent(new Event('resize'));
    }else if(arrReceive[0] == "showPopUp"){
      console.log(arrReceive[1]);
      addPop('object', 'views/'+arrReceive[1] + '/index.html');
    }else{
      var data = arrReceive.shift();
      return window[data].apply(this,arrReceive);
    }
    //console.log(data);
}


function search(evt){
    if(event.keyCode == 13) {
        //console.log(searchInObject(evt.value));
        produtosSearchObj = searchInObject(evt.value);
        navigationController.goTela("produtos");
        console.log(produtosSearchObj);
    }
}



function searchInObject(word){    
    var newObj = {"escopo": {},"categorias":[]};    
    newObj.escopo = produtosObj.escopo;
    
    for(var i=0; i < produtosObj.categorias.length; i++){
         var catAtual = produtosObj.categorias[i];
         newObj.categorias[i] = {"idCategoria":catAtual.idCategoria, "prods_keyWords":[]};
                         
         for(var j=0; j < catAtual.prods_keyWords.length; j++){
             if(searchWordInArray(word, catAtual.prods_keyWords[j])){                 
                 newObj.categorias[i].prods_keyWords.push(catAtual.prods_keyWords[j]);                 
             }else{
                 //CASO NÃO EXISTA A PALAVRA PESQUISADA GRAVA UM ARRAY VAZIO
                 newObj.categorias[i].prods_keyWords.push(null); 
             }
         }
    }
    
    return newObj;
}


function searchWordInArray(word, arr){
    for(var i=0; i < arr.length; i++){
        var newArr = arr[i].split(" ");
              
        if(removerAcentos(trim(arr[i])) == removerAcentos(trim(word))){
           return true;
        }else{
            for(var j=0; j < newArr.length; j++){
                if(removerAcentos(newArr[j]) === removerAcentos(word)){                
                    return true;
                }
            }
        }
    }
    
    return false;
}

function trim(str) {
    return str.replace(/^\s+|\s+$/g,"");
}

function removerAcentos( newStringComAcento ) {
  var string = newStringComAcento;
	var mapaAcentosHex 	= {
		a : /[\xE0-\xE6]/g,
		e : /[\xE8-\xEB]/g,
		i : /[\xEC-\xEF]/g,
		o : /[\xF2-\xF6]/g,
		u : /[\xF9-\xFC]/g,
		c : /\xE7/g,
		n : /\xF1/g
	};
 
	for ( var letra in mapaAcentosHex ) {
		var expressaoRegular = mapaAcentosHex[letra];
		string = string.replace( expressaoRegular, letra );
	}
 
	return string.toLowerCase();
}



function getFlashCanvasLib(){
	return flashCanvasLib;
}

function onDocumentReady(){
	/*$(document).bind(
	      'touchmove',
          function(e) {
            e.preventDefault();
           }
	 );*/
    //Capturando evento offline
    addEventListener("message", receiveMessage, false);
	 
	// MAPEANDO AS VIEWS PARA DEEPLINK
	mapeiaViews();
	
	//INSTANCIANDO E INICIANDO AS CLASSES DE CONTROLE
	scormController = new scormControls(engineRef);
	
	deepLinkController = new deepLink(containers, engineRef);
	navigationController = new navigationControls(engineRef);
	layoutController = new layoutControls(engineRef);
	especiaisController = new especiaisControls(engineRef);
	
	//Inicia coneção com scorm
	scormController.connect(init);  
    
	  //Verificando atualização
	 /* window.applicationCache.addEventListener('checking',logEvent,false);
	  window.applicationCache.addEventListener('noupdate',logEvent,false);
	  window.applicationCache.addEventListener('downloading',logEvent,false);
	  window.applicationCache.addEventListener('cached',logEvent,false);
	  window.applicationCache.addEventListener('updateready',logEvent,false);
	  window.applicationCache.addEventListener('obsolete',logEvent,false);
	  window.applicationCache.addEventListener('error',logEvent,false);*/  
}

function logEvent(event) {
  //console.log(event.type);
}

function init(){
	//console.log(saveObj);
	createArrMenu();
    createMenu();
    
    Array.prototype.random = function (length) {
       return this[Math.floor((Math.random()*length))];
 	};
 	
    //Criando o array de para fazer o controle das páginas já visitadas
	if(countIE(saveObj.visitedViews) == 0){
		var pageslen = countIE(config.paginas);
		for (var i=0; i < pageslen; i++) {		        
	       saveObj.visitedViews.push(0);
        }
	 }
    
	//Inicia ajustes do layou
	layoutController.init();
	
    //Inicia telas especiais
	especiaisController.init();
    
	//Inicia ajustes de navegação
	navigationController.init();	
   
}

function randomArray(arrayToRandom, length){
	return arrayToRandom.random(length);
}


function mapeiaViews(){
	var arrObjPages = config.paginas;
	var pageslen = countIE(arrObjPages);
	for (var i=0; i <  pageslen; i++) {
		   arrViews.push(arrObjPages[i]);
       	   containers.push(arrObjPages[i].id);	     
    }  
}


//ADICIONAR NO PRIMEIRO FRAME DO FLASH CANVAS PARA IDENTIFICAR QUE A PÁGINA FOI CARREGADA
function onFlashCanvasInit(lib, canvasDoc){
   flashCanvasLib = lib;   
   this.navigationController.slidePage();
}

function removeIco(){
    $( ".loadingImage" ).animate({
        opacity: 0
            }, 500, "linear", function() {
              //Complete             
             $( "#loading" ).animate({
        opacity: 0
            }, 200, "linear", function() { 
         });
     });
}

function removeLoading(){
    $( "#loading" ).animate({
        opacity: 0
        }, 300, "linear", function() {
          //Complete
              $("#loading").hide();	
              $(".loadingImage").css('opacity', 1);
     });
}

//TRATAMENTO PARA O CONSOLE.LOG NÃO RETORNAR ERRO NO IE9 PARA BAIXO
function loadSpecialsControls(){
    // Avoid 'console' errors in browsers that lack a console.
    (function() {
        var method;
        var noop = function () {};
        var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];
        var length = countIE(methods);
        var console = (window.console = window.console || {});

        while (length--) {
            method = methods[length];

            // Only stub undefined methods.
            if (!console[method]) {
                console[method] = noop;
            }
        }
    }()); 
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