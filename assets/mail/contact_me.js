$(function() {

  $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function($form, event, errors) {
      // additional error messages or events
    },
    submitSuccess: function($form, event) {
      event.preventDefault(); // prevent default submit behaviour
      // get values from FORM
      var name = $("input#name").val();
      var email = $("input#email").val();
      var phone = $("input#phone").val();
      var message = $("textarea#message").val();
      var firstName = name; // For Success/Failure Message
      // Check for white space in name for Success/Fail message
      if (firstName.indexOf(' ') >= 0) {
        firstName = name.split(' ').slice(0, -1).join(' ');
      }
      $this = $("#sendMessageButton");
      $this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages
      /**/
      fetch("https://renepauls-mailer.glitch.me/sendMail", {
        crossDomain: true,
        method: "POST",
        body: JSON.stringify({
          reply: name,
          subject: "Personal Page Contact Form",
          content: name+" schreibt:\n"+message+"\n\nAls Kontaktdaten wurden Telefonnummer: "+phone+" und Email: "+email+" angegeben."
        }),
        headers: { "Content-Type": "application/json" }
      })
      .then(res => res.json())
      .then(response => {
        if(!response.ok) {
          throw new Error("Server responded with: " + response.status);
        }
        console.log(response.msg);
      })
      .catch(error => {
        console.error("Failed sending message. Error: "+error)
        // Fail message
        $('#success').html("<div class='alert alert-danger'>");
        $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
          .append("</button>");
        $('#success > .alert-danger').append($("<strong>").text("Entschuldige bitte " + firstName + ", aber da ist wohl etwas schiefgelaufen. Bitte versuche es später erneut oder kontaktiere mich direkt!"));
        $('#success > .alert-danger').append('</div>');
        //clear all fields
        $('#contactForm').trigger("reset");
      });
    },
    filter: function() {
      return $(this).is(":visible");
    },
  });

  $("a[data-toggle=\"tab\"]").click(function(e) {
    e.preventDefault();
    $(this).tab("show");
  });
});

/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
  $('#success').html('');
});
