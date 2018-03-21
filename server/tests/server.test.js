/*

Deprecated test, need to find a new method.

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {User} = require('./../models/user');

const users = [{
	_id: new ObjectID(),
}, {
	_id: new ObjectID(),
}
];

beforeEach((done)=>{
	User.remove({}).then(()=> {
		return User.insertMany(users);
	}).then(()=>done());
});

describe('Get /Users', () =>{

	it('All users', (done) =>{
		request(app)
		.get('/users')
		.expect(200)
		.expect((res) =>{
			expect(res.body.users.length).toBe(2);
		})
		.end(done);
	});

});
*/