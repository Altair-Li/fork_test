'use strict';

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const RuleSchema = new mongoose.Schema({
	templates: {
		type: [String],
		required: true
	},
	poi: {
		type: String,
		required: true,
		minlength: 1
	},
	ruleType: {
		type: String,
		required: true,
		minlength: 1
	},
	phoneme: {
		type: String,
		required: true,
		minlength: 1
	},
	ruleTxt: {
		type: String,
		required: true,
		minlength: 1
	},
	gloss: {
		type: [String],
		required: true
	},
	SR: {
		type: [String],
		required: true
	},
	UR: {
		type: [String],
		required: true
	},
});

const PastResultSchema = new mongoose.Schema({
	score: {
		type: Number,
		required: true
	},
	answers: {
		type: [String],
		required: true
	},
	timeStamp: {
		type: String,
		required: true,
		trim: true,
		unique: true
	}
});

const QuestionSchema = new mongoose.Schema({
	rule: RuleSchema,
	size: {
		type: Number,
		required: true,
		default: 20
	},
	canUR: {
		type: Boolean,
		required: true
	},
	canPhoneme: {
		type: Boolean,
		required: true
	},
	maxCADT: {
		type: Number,
		required: true
	}
});

const QuizSchema = new mongoose.Schema({
	timeLim: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: 1
	},
	past_results: {
		type: [PastResultSchema],
		default: []
	},
	questions: {
		type: [QuestionSchema],
		default: []
	},
	isCompleted: {
		type: Boolean,
		default: false
	}
});

QuizSchema.statics.findByUsernamePassword = function (quizNameList) {
	const Quiz = this;

	Quiz.find({name: {$in: quizNameList}}).then(res => {
		return res;
	}).catch(err => {
		console.log(err);
		return [];
	});
};

const UserSchema = new mongoose.Schema({
	type: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	name: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	email: {
		type: String,
		required: true,
		minlength: 1,
		unique: true,
		trim: true
	},
	username: {
		type: String,
		required: true,
		minlength: 1,
		unique: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	groups: {
		type: [String],
		default: []
	},
	quizzes: {
		type: [QuizSchema],
		default: []
	}
});

UserSchema.pre('save', function (next) {
	const user = this;

	if (user.isModified('password')) {
		bcrypt.hash(user.password, 10).then(function (hash) {
			user.password = hash;
			next();
		});
	} else {
		next();
	}

});

UserSchema.statics.findByUsernamePassword = function(username, password) {
	const User = this;
	return User.findOne({username: username}).then(user => {
		if (!user) {
			return Promise.reject();
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, result) => {
				if (result) {
					resolve(user);
				} else {
					reject();
				}
			})
		})
  })
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};
