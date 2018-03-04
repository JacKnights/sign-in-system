$(document).ready(function() {
	$("#signin").click(function() {
		/*event.preventDefault();*/
		if (!validator.usernameIsValid() || !validator.passwordIsValid()) {
			return false;
		}
	});
	$("#signup").click(function() {
		window.location.href = "../regist";
	});
	$("input[type='text'], input[type='password']").blur(inputWatcher);
});

function inputWatcher() {
	if (validator.fieldIsValid(this.id, $(this).val())) {
		$(this).parent().find('.status').text(validator.form[this.id].correctMessage);
		$(this).parent().find('.status').css("color", "green");
	} else {
		$(this).parent().find('.status').text(validator.form[this.id].errorMessage);
		$(this).parent().find('.status').css("color", "red");
	}
}