var usernameRegExp = /^[a-zA-Z][\da-zA-Z_]{5,17}$/;
var studentIDRegExp = /^[1-9]\d{7}$/;
var phoneRegExp =  /^[1-9]\d{10}$/;
var emailRegExp = /^[\da-zA-Z_\-]+@(([\da-zA-Z_\-])+\.)+[a-zA-Z]{2,4}$/;
var passwordRegExp = /^[\da-zA-Z_\-]{6,12}$/;

var validator = {
	form: {
		username: {
			status: false,
			errorMessage: "用户名格式有误，请输入6~18位英文字母、数字或下划线，必须以英文字母开头",
			correctMessage: "用户名格式正确"
		},
		studentID: {
			status: false,
			errorMessage: "学号格式有误，请输入8位数字，不能以0开头",
			correctMessage: "学号格式正确"
		},
		phone: {
			status: false,
			errorMessage: "电话格式有误，请输入11位数字，不能以0开头",
			correctMessage: "电话格式正确"
		},
		email: {
			status: false,
			errorMessage: "邮箱格式有误，请输入有效邮箱地址",
			correctMessage: "邮箱格式正确"
		},
		password: {
			status: false,
			errorMessage: "密码格式有误，请输入6~12位数字、大小写字母、中划线、下划线",
			correctMessage: "密码格式正确"
		},
		confirmPassword: {
			status: false,
			errorMessage: "与之前输入密码不一致",
			correctMessage: "与之前输入密码一致"
		}
	},

	existence: {
		username: {
			errorMessage: "用户名已被注册",
			correctMessage: "用户名可用"
		},
		studentID: {
			errorMessage: "学号已被注册",
			correctMessage: "学号可用"
		},
		phone: {
			errorMessage: "电话已被注册",
			correctMessage: "电话可用"
		},
		email: {
			errorMessage: "邮箱已被注册",
			correctMessage: "邮箱可用"
		}
	},

	usernameIsValid: function(username) {
		return this.form.username.status = usernameRegExp.test(username);
	},

	studentIDIsValid: function (studentID) {
		return this.form.studentID.status = studentIDRegExp.test(studentID);
	},

	phoneIsValid: function(phone) {
		return this.form.phone.status = phoneRegExp.test(phone);
	},

	emailIsValid: function(email) {
		return this.form.email.status = emailRegExp.test(email);
	},

	passwordIsValid: function(password) {
		return this.form.password.status = passwordRegExp.test(password);
	},

	passwordIsConfirmed: function(password, confirmPassword) {
		return this.form.confirmPassword.status = (confirmPassword == password);
	},

	fieldIsValid: function(fieldname, value) {
		return this[fieldname + "IsValid"](value);
	},

	formIsValid: function() {
		return this.form.username.status
			&& this.form.studentID.status
			&& this.form.phone.status
			&& this.form.email.status
			&& this.form.password.status
			&& this.form.confirmPassword.status;
	},

	getErrorMessage: function(fieldname) {
		return this.form[fieldname].errorMessage;
	},

	attrValueIsUnique: function(registry, user, attr) {
		for (var key in registry) {
			if (registry.hasOwnProperty(key) && registry[key][attr] == user[attr]) {
				return false;
			}
		}
		return true;
	}
};

if (typeof module == "object") {
	module.exports = validator
}