var onFinishFn;
var engine = window.parent.engineRef;
var videoFinish = false;
var videoReady = false;
var containerVideo = lib.container_video.prototype.nominalBounds;
engine.objEngineRef = this;

$("#carregando").css("visibility", "hidden");
$("#videoPlayer").css("visibility", "hidden");
//playVideo(engine.objView.videoID, openPopEscolha, engine.objView.timer);
//console.log(engine.objView);

function playVideo(id , onFinish, timer){
	this.onFinishFn = onFinish;
	//videoFinish = false;
	var posX = containerVideo.x + "px";
	var posY = containerVideo.y + "px";
	
	$("#carregando").css("visibility", "visible")
	$("#carregando").css("top", posY);
	$("#carregando").css("left", posX);
	$("#carregando").css("width", containerVideo.width);
	$("#carregando").css("height", containerVideo.height);
	
	$("#videoPlayer").css("top", posY);
	$("#videoPlayer").css("left", posX);
	$("#videoPlayer").empty();
	$("#videoPlayer").append('<iframe id="player1"'+ 'src="https://player.vimeo.com/video/' + id +'?autoplay=1 api=1&amp;player_id=player1" width="'+ containerVideo.width +'" height="' + containerVideo.height +'" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>');
	
	$(function () {
		
		var player = $('iframe');
        var url = window.location.protocol + "https://player.vimeo.com/video/" + id;
        var status = $('.status');

        // Listen for messages from the player
        if (window.addEventListener) {
            window.addEventListener('message', onMessageReceived, false);
        } else {
            window.attachEvent('onmessage', onMessageReceived, false);
        }

        // Handle messages received from the player
        function onMessageReceived(e) {
                            
            var data = JSON.parse(e.data);

            switch (data.event) {
            case 'ready':
                onReady();
                
                if(!videoReady){
                	$("#carregando").css("visibility", "hidden");
                	$("#videoPlayer").css("visibility", "show");
                	videoReady = true;
                }
                
                break;

            case 'playProgress':
                onPlayProgress(data.data);	                    
                
                break;

            case 'pause':
                onPause();
                break;

            case 'finish':	                   
                   if(timer == 0){
                   		onFinishVideo();
                   }      
                    break;
                }
            }

            // Call the API when a button is pressed
        $('button').on('click', function () {
            post($(this).text().toLowerCase());
        });

        // Helper function for sending a message to the player
        function post(action, value) {
            var data = {
                method: action
            };

            if (value) {
                data.value = value;
            }

            var message = JSON.stringify(data);
            player[0].contentWindow.postMessage(data, url);
        }

        function onReady() {
            post('addEventListener', 'pause');
            post('addEventListener', 'finish');
            post('addEventListener', 'playProgress');
        }

        function onPause() {
            
        }

        function onPlayProgress(data) {
           //console.log(data.seconds + 's played');
           if(Math.round(data.seconds) >= timer && videoFinish == false && timer != 0){
           	  onFinishVideo();
           	  videoFinish = true;
           }
           
        }
    });
	
		
   //////////////////////////////////////////////////
}

function onPause() {
   
}

function onFinishVideo() {
    //console.log("fim do vídeo");
    //onFinishFn();        
}

function openPopEscolha(){      
   if(engine.objView.questoesSrc != ""){
   	 engine.addPop("object", engine.objView.questoesSrc);
   }else if(engine.objView.pulaTela != ""){
   	 engine.goTela(engine.objView.pulaTela);
   }else{
   	 ativaProximo();
   }            
}

function ativaProximo(){        	
	//engine.navigationController.destravaTela();
	console.log('ativa proximo');
	engine.navigationController.avancar();
}

function vazio(){
	
}

function liberaMenu(){
	      	
}