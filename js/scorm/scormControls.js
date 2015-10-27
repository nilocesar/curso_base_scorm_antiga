/**
 * @author Luiz Felipe Magalhães Coelho
 */

var saveObj;


function scormControls(engineRef){
	

    var startDate = 0;
	
	
	
	//conexão com o Scorm
	this.connect = function(onConnect){
		
		if(engineRef.config.scorm){
			engineRef.SCOInitialize();
			startTimer();
			
			var completion_status = engineRef.SCOGetValue("cmi.completion_status");
		    
		    if(completion_status == "passed" || completion_status == "completed"){
		        //scorm.disconnect();      
		    } else {
		    	
		    
		        var suspend_data = engineRef.SCOGetValue("cmi.suspend_data");
                //console.log(suspend_data);
		        if(suspend_data == "" || suspend_data == "null" || suspend_data == undefined){
				  	loadJsonLocal('configs/save.js', function(json) {
				        saveObj = json;
				    });
				}else{
				    saveObj = jQuery.parseJSON(suspend_data);    
				}

		    }
    
		}else{
		    loadJsonLocal('configs/save.js', function(json) {
		        saveObj = json;
		    });
			
		}
		
		setTimeout(onConnect, 1000);
		
	};
	
	
	this.disconnect = function(){
	   engineRef.SCOFinish();
	};
	
	
	//Suspend data
	this.getSuspenData = function(){
	   return engineRef.SCOGetValue("cmi.suspend_data");	
	};
	
	this.setSuspenData = function(data){
	   engineRef.SCOSetValue("cmi.suspend_data", data);	
       engineRef.SCOCommit();
	};
	
	//Book Mark
	this.getBookMark = function(){
		return engineRef.SCOGetValue("cmi.core.lesson_location");
	};
	
	this.setBookMark = function(mark){
		engineRef.SCOSetValue("cmi.core.lesson_location", mark);
        engineRef.SCOCommit();
	};
	
	//Student Name
	this.getStudentName = function(){
		return engineRef.SCOGetValue("cmi.core.student_name", mark);
	};
	
	//Status do Treinamento	(passed, failed, completed, incomplete)
	this.getCompletionStatus = function(){
		return engineRef.SCOGetValue("cmi.core.lesson_status");
	};
	
	this.setCompletionStatus = function(status, raw){
		if(raw != undefined){
            var _this = this;
            _this.setRaw(raw);        
        }
        
        engineRef.SCOSetValue("cmi.core.lesson_status", status);
        engineRef.SCOCommit();               
	};
	
	//Score
	this.setMinScore = function(value){
	   engineRef.SCOSetValue("cmi.core.score.min", value);
       engineRef.SCOCommit();
	};
	
	this.setMaxScore = function(value){
       engineRef.SCOSetValue("cmi.core.score.max", value);
       engineRef.SCOCommit();
	};
	
	this.setRaw = function(value){
        console.log("Gravando Nota: " + value);
        var blnResult;
        var errorId;
        
	 
       engineRef.g_objAPI.LMSSetValue("cmi.core.score.max", engineRef.config.maxScore);
       engineRef.g_objAPI.LMSSetValue("cmi.core.score.min", engineRef.config.minScore);
       blnResult =  engineRef.g_objAPI.LMSSetValue("cmi.core.score.raw", parseFloat(value));
       engineRef.SCOCommit();
       
       console.log('Gravou Nota: ' + blnResult);
       
       errorId = engineRef.SCOGetLastError();
       console.log("CODIGO ERRO RAW: " + errorId);
       console.log("ERRO RAW: " + engineRef.SCOGetDiagnostic(errorId));
        
	};
	
	this.getRaw = function(value){
		console.log("Resgatando Nota: " + engineRef.SCOGetValue("cmi.core.score.raw"));
        return engineRef.SCOGetValue("cmi.core.score.raw");
	};

	//Salva as informações na plataforma Scorm. 
	this.save = function(){
	   //Adicionando o objeto Save no suspend_data como string.
	   engineRef.SCOSetValue("cmi.suspend_data", JSON.stringify(saveObj));
	   engineRef.SCOCommit();
	};
	
	
	//computando o tempo
	function startTimer()
	{
		startDate = new Date().getTime();			
	}
	
	function computeTime()
	{
		if ( startDate != 0 )
		{
		   var currentDate = new Date().getTime();
		   var elapsedSeconds = ( (currentDate - startDate) / 1000 );
		   var formattedTime = convertTotalSeconds( elapsedSeconds );
		}
		else
		{
		   formattedTime = "00:00:00.0";
		}
	
		engineRef.SCOSetValue('cmi.core.session_time', formattedTime);
	}
	
	
/*******************************************************************************
 ** this function will convert seconds into hours, minutes, and seconds in
 ** CMITimespan type format - HHHH:MM:SS.SS (Hours has a max of 4 digits &
 ** Min of 2 digits
 *******************************************************************************/
   function convertTotalSeconds(ts)
	 {
		var sec = (ts % 60);
	
		ts -= sec;
		var tmp = (ts % 3600);  //# of seconds in the total # of minutes
		ts -= tmp;              //# of seconds in the total # of hours
	
		// convert seconds to conform to CMITimespan type (e.g. SS.00)
		sec = Math.round(sec*100)/100;
	
		var strSec = new String(sec);
		var strWholeSec = strSec;
		var strFractionSec = "";
	
		if (strSec.indexOf(".") != -1)
		{
		   strWholeSec =  strSec.substring(0, strSec.indexOf("."));
		   strFractionSec = strSec.substring(strSec.indexOf(".")+1, strSec.length);
		}
	
		if (strWholeSec.length < 2)
		{
		   strWholeSec = "0" + strWholeSec;
		}
		strSec = strWholeSec;
	
		if (strFractionSec.length)
		{
		   strSec = strSec+ "." + strFractionSec;
		}
	
	
		if ((ts % 3600) != 0 )
		   var hour = 0;
		else var hour = (ts / 3600);
		if ( (tmp % 60) != 0 )
		   var min = 0;
		else var min = (tmp / 60);
	
		if ((new String(hour)).length < 2)
		   hour = "0"+hour;
		if ((new String(min)).length < 2)
		   min = "0"+min;
	
		var rtnVal = hour+":"+min+":"+strSec;
	
		return rtnVal;
	}	
	
/*******************************************************************************
 ** Interactions
 *******************************************************************************/
     /*
     interactionID:String, interactionType:String, userResp:Array, gabarito:Array 
     Retorna um inteiro
     */
   this.addInteraction = function(interactionID, interactionType, userResp, gabarito) {
			var interactionsCounter;
			var countInt = saveObj.countInteraction;
			saveObj.countInteraction = saveObj.countInteraction + 1;
			
		    engineRef.SCOSetValue("cmi.interactions." + countInt + ".id", interactionID);				
			engineRef.SCOSetValue("cmi.interactions." + countInt + ".type", interactionType);
				
				
				salvaResposta(userResp.join(","), gabarito.join(","), countInt);
				
				switch(interactionType) {
					
					case "choice":
						if (isCorrect(userResp, gabarito)) {
							interactionIsCorrect(countInt);
						}else {
							interactionIsWrong(countInt);
						}
					break;
					
				    case "sequencing":
						if (isCorrectSequencing(userResp, gabarito)) {
							interactionIsCorrect(countInt);
						}else {
							interactionIsWrong(countInt);
						}
					break;
					
				}				
			
			
			// alert(isCorrect(userResp, gabarito));
			
			 return isCorrect(userResp, gabarito);	
			
	};
		
		
		/////////////////////////////////////////////////
		
		function salvaResposta(userResp, gabarito, idCount) {
			engineRef.SCOSetValue("cmi.interactions." + idCount + ".student_response", userResp.toString());
			engineRef.SCOSetValue("cmi.interactions." + idCount + ".correct_responses.0.pattern", gabarito.toString());			
		}
		
		
		function interactionIsCorrect(idCount){			
			engineRef.SCOSetValue("cmi.interactions." + idCount + ".result", "correct");			
		}
		
		function interactionIsWrong(idCount){			
			engineRef.SCOSetValue("cmi.interactions." + idCount + ".result", "wrong");				
		}
		
		
		function isCorrect(userResp, gabarito){
			var isCorrectBl = true;
			
			if(gabarito.length == userResp.length){
				for (var i = 0; i < gabarito.length; i++) {
				  if(userResp.indexOf(gabarito[i]) == -1){
						isCorrectBl = false;
						//console.log(gabarito[i]);
				  }
				}
				
			}else{
				isCorrectBl = false;
			}
			
			return isCorrectBl;
		}
		
		function isCorrectSequencing(userResp, gabarito) {
			var isCorrectBl = true;
			
			if(gabarito.length == userResp.length){
				if (gabarito.join("|") === userResp.join("|") ) {
					isCorrectBl = true;
				}else {
					isCorrectBl = false;
				}
			}else{
				isCorrectBl = false;
			}
			
			return isCorrectBl;
			
		}	
	
	
}
