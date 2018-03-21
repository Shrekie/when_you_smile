var express = require('express');
var router = express.Router();

router.get('/app/me/', (req, res)=>{
	res.json(req.user);
});

module.exports = router;