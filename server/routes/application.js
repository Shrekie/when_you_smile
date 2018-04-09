var express = require('express');

const fbUpload = require('facebook-api-video-upload');
const fs = require('fs');
let multer = require('multer');
const request = require('request-promise'); 
var waitUntil = require('wait-until');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
	  cb(null, Date.now() + '.webm')
	}
});

let upload = multer({
	storage:storage,
	limits: { 
		fieldNameSize: 255,
		fileSize: 10000000,
		files: 1,
		fields: 1
	}
}).single('file');

var router = express.Router();

router.get('/checkLogin', (req, res)=>{
	if(req.isAuthenticated())res.json({logged:true});
	else res.json({logged:false});
});

router.post('/sendVideo', (req, res)=>{
	if(req.isAuthenticated()){

		upload(req,res,function(err) {

		if(err) {
			console.log(err);
			return res.json({fileError: err});
		}

		try{
			req.file.path
		}catch(e){
			return res.json({fileError:'invalid path'});
		}

		stream = fs.createReadStream(req.file.path)
		stream.on('error', function(){ return res.json({fileError:'invalid path'}); });

		const args = {
			token: req.user.accessToken,
			id: req.user.profileID,
			stream: stream,
			title: "When You Smile",
			description: "Make your own at www.whenyousmile.tlindauer.com"
		};

		fbUpload(args).then((vres) => {
			console.log('res: ', vres);

			let shareLinkParts ={
				href: 'https://www.facebook.com/'+req.user.profileID+'/videos/'+vres.video_id+'/',
				app_id: process.env.clientID
			};

			let shareLink = 'https://www.facebook.com/dialog/share?'+
						    'app_id='+shareLinkParts.app_id+
							'&display=page'+
							'&href='+shareLinkParts.href;
			
			const options = {
				method: 'GET',
				uri: 'https://graph.facebook.com/v2.11/'+vres.video_id,
				qs: {
				  access_token:req.user.accessToken,
				  fields:'status'
				}
			};
			  
			waitUntil()
			.interval(5000)
			.times(10)
			.condition(function(cb) {
				request(options)
					.then(fbRes => {
					const parsedRes = JSON.parse(fbRes).status;
					cb(parsedRes.video_status == 'ready'?true:false);
				});
			})
			.done(function(result) {
				//if(result) timeout catch here
				res.json({shareLink});
			});

			fs.unlink(req.file.path, (err) => {
				if (err) throw err;
				console.log('unlinked');
			});

			}).catch((e) => {
				fs.unlink(req.file.path, (err) => {
					if (err) throw err;
					console.log('unlinked');
				});
				res.json({e});
			});
			
		});

	}
	else res.json({logged:false});
});

module.exports = router;