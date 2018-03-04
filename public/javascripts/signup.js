$(document).ready(function() {
	$("#signup").click(function() {
		if (!validator.formIsValid()) {
			return false;
		}
	});
	$("#reset").click(function() {
		$(".status").html("");
		return false;
	});
	$("input[type='text'], input[type='password']").blur(inputWatcher);
});

function inputWatcher() {
	if (this.id == "confirmPassword") {
		if (validator.passwordIsConfirmed($(this).val(), $("#password").val())) {
			$(this).parent().find('.status').text(validator.form[this.id].correctMessage);
			$(this).parent().find('.status').css("color", "green");
		} else {
			$(this).parent().find('.status').text(validator.form[this.id].errorMessage);
			$(this).parent().find('.status').css("color", "red");
		}
		return;
	}
	if (validator.fieldIsValid(this.id, $(this).val())) {
		$(this).parent().find('.status').text(validator.form[this.id].correctMessage);
		$(this).parent().find('.status').css("color", "green");
	} else {
		$(this).parent().find('.status').text(validator.form[this.id].errorMessage);
		$(this).parent().find('.status').css("color", "red");
	}
}