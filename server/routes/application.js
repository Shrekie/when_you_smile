var express = require('express');

const fbUpload = require('facebook-api-video-upload');
const fs = require('fs');
let multer = require('multer');
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

		console.log( req.body );
		console.log( req.files);
		console.log( req.files.file[0]);
		res.sendStatus(200);
		
		
		const args = {
			token: req.user.accessToken, // with the permission to upload
			id: req.user.profileID, //The id represent {page_id || user_id || event_id || group_id}
			stream: fs.createReadStream(req.files.file[0].path), //path to the video,
			title: "test",
			description: "testlol"
		};
		
		fbUpload(args).then((res) => {
			console.log('res: ', res);
			fs.unlink(req.files.file[0].path, (err) => {
				if (err) throw err;
				console.log('Deletut');
			});
			//res:  { success: true, video_id: '1838312909759132' }
		}).catch((e) => {
			console.error(e);
		});
		
		res.json(req.data);
	}
	else res.json({logged:false});
});

module.exports = router;