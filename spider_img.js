var cheerio= require('cheerio');
var request=require('request');
var fs=require('fs');
var cp=require('child_process');
var url=require('url');
var http=require('http');
var async=require('async'); 

var weburl='http://www.tt.com/html/article/index12172.html';
var DOWNLOAD_DIR='/home/wang/pic/';
var aa=new Array();

function getDatas(){
	async.parallel({
		one:function(cb){
	for(var i=70;i<80;i++){
		weburl='http://www.tt.com/html/article/index121'+i+'.html'
	request(weburl,function(error,res,body){
		if(!error && res.statusCode == 200){
			var $=cheerio.load(body);
			var j=0;
			
			$('div.n_bd img').filter(function(i,e){
				if($(this).attr('src')){
					console.log($(this).attr('src'));
					aa.push($(this).attr('src'));
					//downloadPic($(this).attr('src'));	
					//dPic($(this).attr('src'));
				//	cb($(this).attr('src'));
				}
			});
		}
		else{
			console.log(error);
		}
	});
	}
}},function(err,results){
	if(err){
		console.log(err);
	}else{
		downloadPic(results.one);
	}
});
}



function dPic(file_url){
	var filename=url.parse(file_url).pathname.split('/').pop();
	var file=fs.createWriteStream(DOWNLOAD_DIR+filename);
	http.get(file_url,function(res){
		res.on('data',function(data){
			file.write(data);
		});
		res.on('end',function(data){
			file.end();
		});
		res.on('error',function(e){
			if(e){
				console.log('Errored:'+e);
				file.end();
			}else{
				console.log('Finish');
			}
		});
	});

}	
		

function downloadPic(file_url){
	var filename=url.parse(file_url).pathname.split('/').pop();
	var file=fs.createWriteStream(DOWNLOAD_DIR+filename);
	var curl=cp.spawn('curl',[file_url]);
	curl.stdout.on('data',function(data){
		file.write(data);
	});
	curl.stdout.on('end',function(data){
		file.end();
		console.log(filename+'download to'+DOWNLOAD_DIR);
	});


	curl.on('error',function(e){
		if(e){
			console.log('Error:'+e);
		}else{
			console.log('errors');
		}
	});

	curl.on('exit',function(code){
		if(code!=0){
			console.log('Filed:'+code);
		}
	});
}

getDatas();
