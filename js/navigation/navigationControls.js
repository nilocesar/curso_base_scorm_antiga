/**
 * @author Luiz Felipe Magalhães Coelho
 */

function navigationControls(engineRef){
	this._pageNew;
	this.infoPageCurrent;
	this.pageCurrent;
	this.containersType = [];
	this.indice = 0;
    this.indiceAnterior = null;
	this.engineRef = engineRef;
	
    this.bgColor;
	this._url_link;
	this._url_type;
	this._pageAtualRef;
    this.countElementsAvanca = 0;
    this.countElementsVolta = 0;
    this.lastYPosition = 0;
    this.lastXPosition = 0;
	this.firstLoad = true;
    this.refresh = false;
};

	//--------------------------------------
	// INIT
	//--------------------------------------
	
navigationControls.prototype = {

    init: function() {	
        var _this = this;
        this.indice = this.engineRef.scormController.getBookMark();

        //popDialogo
        //if(this.indice == "" || this.indice == "null"){
            this.indice = 0;
            $('#popDialogo').css({"visibility":"hidden"});	
            _this.activePageEvent(); 
            _this.deepLinkInit();
        /*}else{
            $('#popDialogo').css({"visibility":"visible"});	
            var dialog = document.getElementById('window');

            $( "#sim" ).click(function() {               
                 $('#popDialogo').css({"visibility":"hidden"});	
                _this.pageCurrent = _this.engineRef.containers[_this.indice];
                _this.engineRef.viewLoadedAtual =  "conteudo" + _this.indice;
                _this.activePageEvent(); 
                _this.deepLinkInit();
            });
            $('#sim').bind('touchend', function(event){
                $('#popDialogo').css({"visibility":"hidden"});  
                _this.pageCurrent = _this.engineRef.containers[_this.indice];
                _this.engineRef.viewLoadedAtual =  "conteudo" + _this.indice;
                _this.activePageEvent(); 
                _this.deepLinkInit();
            });

            document.getElementById('nao').onclick = function() {
                $('#popDialogo').css({"visibility":"hidden"});	

                _this.indice = 0;
                _this.pageCurrent = _this.engineRef.containers[_this.indice];

                _this.activePageEvent(); 
                _this.deepLinkInit();
            };
            $('#nao').bind('touchend', function(event){
               $('#popDialogo').css({"visibility":"hidden"});   

                _this.indice = 0;
                _this.pageCurrent = _this.engineRef.containers[_this.indice];

                _this.activePageEvent(); 
                _this.deepLinkInit();
            });

        }*/

        //Controles de Navegação entre as telas
        $( "#avancaBt" ).click(function() {
          var ref = $('#contentGeral').data('ref');
          ref.avancar();                 
        });

        $( "#voltaBt" ).click(function() {
          var ref = $('#contentGeral').data('ref');
          ref.voltar();
        });		
        $( "#avancaBt" ).bind('touchend', function(event){
          var ref = $('#contentGeral').data('ref');
          ref.avancar();                 
        });

        $( "#voltaBt" ).bind('touchend', function(event){
          var ref = $('#contentGeral').data('ref');
          ref.voltar();
        }); 
    },


    activePageEvent: function(){
        this.engineRef.deepLinkController.chageHash(this.indice);
    },

    deepLinkInit: function(){
        this.infoPageCurrent = this.engineRef.deepLinkController.init();

        //Faz o chamado da primeira página.
        this.pageCurrent = this.engineRef.containers[this.indice];

        //Chama no carregamento a tela referenta ao src
        this.activeCurrentPage();
    },

    activeCurrentPage: function(){
        //Setando a pagina como visitada
        saveObj.visitedViews[this.indice] = 1;
        
        this._url_type = this.engineRef.arrViews[this.indice].type;
        this.bgColor =  this.engineRef.arrViews[this.indice].bgColor;
        this.bgImage =  this.engineRef.arrViews[this.indice].bgImage;

        this._url_link =  this.engineRef.arrViews[this.indice].src;
        this._pageAtualRef =  this.engineRef.arrViews[this.indice];
        $("#loading").show();	

        //Registrando BookMark
        this.engineRef.scormController.setBookMark(this.indice);

        $( "#loading" ).animate({
            opacity: 0.5
        }, 1000, "linear", function() {
          //Complete			  
        });

        $('#contentGeral').data('ref', this);

        var ref = $('#contentGeral').data('ref');
        ref.ajaxActive();

        this.showControles();

        var indiceRef = this.engineRef.arrMenuIds[this.indice];
        //this.engineRef.saveObj.indiceRef = this.engineRef.arrMenuIds.indexOf(this.indice);
        console.log('indice menu bt: ' + indiceRef);
        if(indiceRef != -1){
            console.log('indice menu bt: ' + btsMenuArr);
            var elemento = this.engineRef.btsMenuArr[indiceRef];
            this.engineRef.controleEstados(elemento);
            
        }else{
            this.engineRef.controleEstados(-1);
        }

        //Verificando se todas as páginas foram visitadas para realizar o auto completed
        if(this.courseCompleted() == true && this.engineRef.config.autoCompleted == true){
            this.engineRef.scormController.setCompletionStatus("completed");
        }
    },

    showControles: function(){
        var next = this.indice + 1;

        //if(this.engineRef.config.controles == true && window.orientation != 0){
            if(this.indice == countIE(this.engineRef.containers) - 1){
                $("#avancar").hide();
            }else if(this.engineRef.config.navegacaoLivre == false &&  this.engineRef.saveObj.visitedViews[this.indice + 1] == 1){
                $("#avancar").show();
            }else if(this.engineRef.config.navegacaoLivre){
                $("#avancar").show();
            }else{
                $("#avancar").hide();
            }

            //Voltar
            if(this.indice == 0){
                $("#voltar").hide();
            }else{
                $("#voltar").show();
            }
        //}
    },

    ajaxActive: function(){
        var ref = $('#contentGeral').data('ref');
        ref.newPage(this._pageNew);
        //ref.slidePage();
        ref.eventNavPageInit();
        
    },

    eventNavPageInit: function(){			
        this.activePageEvent();
    },

    removeLastView: function(){
            var ref = $('#contentGeral').data('ref');
            var searchEles = document.getElementById("contentGeral").children;

            for(var i = 0; i < countIE(searchEles); i++) {
                if(searchEles[i] != undefined && searchEles[i].id == ref.engineRef.viewLoadedAnterior) {                        
                    document.getElementById("contentGeral").removeChild(searchEles[i]);
                }
            }
    },

    newPage:function(_pageNew){
        $("#loading").show();				 
        var ref = $('#contentGeral').data('ref');
        
        
        
        loadJsonLocal(this._pageAtualRef.data, function(json) {
              objView = json;
              setTimeout(showView, 1000);			      
         });
        
        
       
        function showView(){

            if(ref.refresh){  
                console.log("refresh");
                ref.refresh = false; 
                ref.engineRef.viewLoadedAnterior =  ref.engineRef.viewLoadedAtual;                
                ref.engineRef.viewLoadedAtual =  "conteudo" + ref.indice; 

                $( ".inner" ).append('<div id=' + "conteudo" + ref.indice + ' style="width:100%; height:100%;  background-image: url(' + ref.bgImage +  '); background-repeat:no-repeat; background-position: center center;  background-color:' +  ref.bgColor  + '; position: absolute; left:' + 0 + 'px;"><object class="interactionClass" type="text/html" id="pageObj"  data=' + ref._url_link + ' > </object></div>');
                
               
                         
            }else{
                     switch(ref.engineRef.config.tipoAnimacao){
                            case "horizontal": 
                                        var newX;        

                                        if(ref.indice > ref.indiceAnterior || ref.firstLoad == true){
                                            if(ref.firstLoad == true) {
                                               newX = 0;
                                               ref.firstLoad = false;                              
                                            }else{
                                                newX = ref.lastXPosition + $(window).width();                                
                                            }

                                            ref.countElementsAvanca++;

                                            if(ref.countElementsVolta > 0){
                                                ref.countElementsVolta--;  
                                            }

                                        }else{

                                            newX = ref.lastXPosition - $(window).width();

                                            ref.countElementsVolta++;

                                            if(ref.countElementsAvanca > 0){
                                                ref.countElementsAvanca--;
                                            }                            

                                        }

                                        ref.engineRef.viewLoadedAnterior =  ref.engineRef.viewLoadedAtual;
                                        ref.engineRef.viewLoadedAtual =  "conteudo" + ref.indice; 

                                        $( ".inner" ).append('<div id=' + "conteudo" + ref.indice + ' style="width:100%; height:100%;  background-image: url(' + ref.bgImage +  '); background-repeat:no-repeat; background-position: center center;  background-color:' +  ref.bgColor  + '; position: absolute; left:' + newX + 'px;"><object class="interactionClass" type="text/html" id="pageObj"  data=' + ref._url_link + ' > </object></div>');


                                        ref.lastXPosition = newX;
                             break;

                             case "vertical":
                                        var newY;        

                                        if(ref.indice > ref.indiceAnterior || ref.firstLoad == true){
                                            if(ref.firstLoad == true) {
                                               newY = 0;
                                               ref.firstLoad = false;                              
                                            }else{
                                                newY = ref.lastYPosition + $(window).height();                                
                                            }

                                            ref.countElementsAvanca++;

                                            if(ref.countElementsVolta > 0){
                                                ref.countElementsVolta--;  
                                            }

                                        }else{

                                            newY = ref.lastYPosition - $(window).height();

                                            ref.countElementsVolta++;

                                            if(ref.countElementsAvanca > 0){
                                                ref.countElementsAvanca--;
                                            }                            

                                        }

                                        ref.engineRef.viewLoadedAnterior =  ref.engineRef.viewLoadedAtual;
                                        ref.engineRef.viewLoadedAtual =  "conteudo" + ref.indice; 

                                        $( ".inner" ).append('<div id=' + "conteudo" + ref.indice + ' style="width:100%; height:100%;  background-image: url(' + ref.bgImage +  '); background-repeat:no-repeat; background-position: center center;  background-color:' +  ref.bgColor  + '; position: absolute; top:' + newY + 'px;"><object class="interactionClass" type="text/html" id="pageObj"  data=' + ref._url_link + ' > </object></div>' );


                                        ref.lastYPosition = newY;               


                             break;

                             default:

                       }//End Case





                        switch(ref._url_type){
                             case "flashCanvas": 

                             break;

                             case "template":
                                ref.engineRef.onFlashCanvasInit();
                             break;

                             default:
                                ref.engineRef.onFlashCanvasInit();
                        }
            
            
            }
            
            
           
            

         }//End showView

          
        
        
    },

    slidePage:function(){
        var ref = $('#contentGeral').data('ref'); 
        var indice = ref.engineRef.navigationController.indice;
        var indiceAnterior = ref.engineRef.navigationController.indiceAnterior;
        
        switch(ref.engineRef.config.tipoAnimacao){
                case "horizontal": 
                    if(ref.engineRef.navigationController.indice > ref.engineRef.navigationController.indiceAnterior){    

                            if(ref.iniciando == true){
                                  ref.iniciando = false;
                            }else{
                                 //console.log('continuando....');
                                if(ref.engineRef.navigationController.indice != 0){

                                      $( "#contentGeral" ).animate({                            
                                        left: "-=" + Math.round($(window).width())                   
                                      }, 2000, function() {
                                        // Animation complete.
                                          var ref = $('#contentGeral').data('ref');                  
                                          ref.removeLastView();
                                          removeLoading();	                  
                                      });
                                 }
                            }
                        }


                        if(ref.engineRef.navigationController.indice < ref.engineRef.navigationController.indiceAnterior){
                              $( "#contentGeral" ).animate({                            
                                left: "+=" + Math.round($(window).width())                   
                              }, 2000, function() {
                                // Animation complete.
                                 var ref = $('#contentGeral').data('ref');
                                  ref.removeLastView();
                                  removeLoading();
                              });
                        }


                        if(ref.iniciando == true){        	 
                            ref.iniciando = false;
                        }

                        //console.log(this.navigationController.indiceAnterior);
                        if(ref.engineRef.navigationController.indiceAnterior == null){
                            removeLoading(); 
                              $( "#contentGeral" ).animate({                            
                                opacity: 1                  
                              }, 500, function() {
                                // Animation complete.

                              });
                        }else{
                            removeIco();   
                        }
                break;

                 case "vertical":
                
                    if(ref.iniciando == true || ref.engineRef.navigationController.indiceAnterior == null){
                        ref.iniciando = false;
                        removeLoading();
                        $("#contentGeral").animate({                            
                            opacity: 1             
                        }, 500, function() {
                            // Animation complete.
                        });
                    }else{
                        if(indice > indiceAnterior){
                            //console.log('continuando....');
                            if(ref.engineRef.navigationController.indice != 0){

                                  $( "#contentGeral" ).animate({                            
                                    top: "-=" + Math.round($(window).height())                   
                                  }, 2000, function() {
                                    // Animation complete.
                                      var ref = $('#contentGeral').data('ref');                  
                                      ref.removeLastView();
                                      removeLoading();	                  
                                  });
                             }
                        }

                        if(indice < indiceAnterior){
                              $( "#contentGeral" ).animate({                            
                                top: "+=" + Math.round($(window).height())                   
                              }, 2000, function() {
                                // Animation complete.
                                 var ref = $('#contentGeral').data('ref');
                                  ref.removeLastView();
                                  removeLoading();
                              });
                        }
                    }
                 break;

                 default:
        }
        ref.engineRef.onResize();
    },

    avancar:function(){
        if(this.indice != countIE(this.engineRef.containers)-1){								
            this.indiceAnterior = this.indice;               
            this.pageCurrent = this.engineRef.containers[this.indice++];
            this.activeCurrentPage();
        }
    },

    voltar:function(){
        if(this.indice != 0){
            this.indiceAnterior = this.indice;
            this.pageCurrent = this.engineRef.containers[this.indice--];	
            this.activeCurrentPage();
        }       
    },

    createMenu:function(){
        createMenu();
    },

    rever:function(){
        this.refresh = true;
        var ref = $('#contentGeral').data('ref');
        this.pageCurrent = this.engineRef.containers[this.indice];
        this.activeCurrentPage();	
    },

    gobyId:function(viewId){
        this.indiceAnterior = this.indice;
        this.indice = viewId;

        this.pageCurrent = this.engineRef.containers[this.indice];
        this.activeCurrentPage();
    },

    goTela:function(viewId){
        var newIndice = this.engineRef.containers.indexOf(viewId);
        if(newIndice != -1 && this.indice != newIndice){
            this.gobyId(newIndice);				
        }else if(this.indice == newIndice){
            this.rever();
        }
        else{
            console.log(viewId + "nao encontrado");
        }
    },

    destravaTela:function(){
        if(this.indice < countIE(saveObj.visitedViews)){
            $("#avancar").show();
        }	
    },

    courseCompleted:function(){
        var completedBl = true;
        for (var i=0; i <  countIE(saveObj.visitedViews); i++) {		        
           if(saveObj.visitedViews[i] != 1){
              completedBl = false;
           };
        }

        return completedBl;
    }

};
	

function countIE(data){
  //Pega comprimento de arrays no IE
  var length = 0;
  for(var prop in data){
    if(data.hasOwnProperty(prop))
        length++;
  }
  return length;
}