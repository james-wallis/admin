$(document).ready(function() {
  $('form').submit(function(e) {
        e.preventDefault();
  });

  $('#login-submit').click(function() {
    let formValues = {
      username: $('#login-username').val(),
      password: $('#login-password').val()
    };
    $.post('/api/v1/login', formValues, function(data, status, xhr) {
      console.log(data);
      console.log(xhr);
      if (data == 'correct') {
        window.location.href = '/';
      } else {
        if (data == 'only username correct') {
          $('#login-username').addClass('is-valid');
          $('#login-username').removeClass('is-invalid');
        } else {
          $('#login-username').addClass('is-invalid');
          $('#login-username').removeClass('is-valid');
        }
        $('#login-password').addClass('is-invalid');
      }
    });
  });
});
