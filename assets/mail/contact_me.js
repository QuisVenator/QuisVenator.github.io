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
          content: name+" schreibt:\n"+message+"\n\nAls Kontaktdaten wurden Telefonnummer: "+phone+" und Email: "+email+" angegeben.",
          mailKey: "5db1fee4b5703808c48078a76768b155b421b210c0761cd6a5d223f4d99f1eaa"
        }),
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
      })
      .then(res => {
        if(!res.ok) {
          throw new Error("Server responded with: " + response.status);
        }
        return res.json();
      })
      .then(response => {
        // Success message
        $('#success').html("<div class='alert alert-success'>");
        $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
          .append("</button>");
        $('#success > .alert-success')
          .append("<strong>Nachricht wurde gesendet. </strong>");
        $('#success > .alert-success')
          .append('</div>');
        //clear all fields
        $('#contactForm').trigger("reset");
      })
      .catch(error => {
        console.error("Failed sending message. Error: "+error)
        // Fail message
        $('#success').html("<div class='alert alert-danger'>");
        $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
          .append("</button>");
        $('#success > .alert-danger').append($("<strong>").text("Entschuldige bitte " + firstName + ", aber da ist wohl etwas schiefgelaufen. Bitte versuche es später erneut oder kontaktiere mich direkt!"));
        $('#success > .alert-danger').append('</div>');
      })
      .finally(()=>{
        setTimeout(function() {
          $this.prop("disabled", false); // Re-enable submit button when AJAX call is complete
        }, 1000);
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
