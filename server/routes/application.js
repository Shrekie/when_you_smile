var express = require('express');

const fbUpload = require('facebook-api-video-upload');
const fs = require('fs');
let multer = require('multer');
const secrets = require('./../config/secrets.js');
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
let upload = multer({storage:storage});

var router = express.Router();

router.get('/checkLogin', (req, res)=>{
	if(req.isAuthenticated())res.json({logged:true});
	else res.json({logged:false});
});

router.post('/sendVideo', upload.fields([{name: 'file', maxCount: 1}]), (req, res)=>{
	if(req.isAuthenticated()){
		//TODO: More file checking.
		console.log( req.body );
		console.log( req.files);
		console.log( req.files.file[0]);
		
		const args = {
			token: req.user.accessToken, // with the permission to upload
			id: req.user.profileID, //The id represent {page_id || user_id || event_id || group_id}
			stream: fs.createReadStream(req.files.file[0].path), //path to the video,
			title: "You So Precious When You",
			description: "Make your own <3 https://localhost:3000/ <3"
		};
		
		fbUpload(args).then((vres) => {
			console.log('res: ', vres);

			let shareLinkParts ={
				href: 'https://www.facebook.com/'+req.user.profileID+'/videos/'+vres.video_id+'/',
				redirect_uri: 'https://localhost:3000/',
				app_id: secrets.clientID
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

			fs.unlink(req.files.file[0].path, (err) => {
				if (err) throw err;
				console.log('Deletut');
			});

			//res:  { success: true, video_id: '1838312909759132' }
		}).catch((e) => {
			console.error(e);
		});
		
	}
	else res.json({logged:false});
});

module.exports = router;