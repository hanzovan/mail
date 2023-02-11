document.addEventListener('DOMContentLoaded', function() {  

  const emails_view = document.querySelector('#emails-view');
  const compose_view = document.querySelector('#compose-view');

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
  
  function compose_email() {

    // Show compose view and hide other views
    emails_view.style.display = 'none';
    compose_view.style.display = 'block';
  
    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
  
    document.querySelector('#compose-form').onsubmit = function() {
  
      let recipients = document.querySelector('#compose-recipients').value;
      let subject = document.querySelector('#compose-subject').value;
      let body = document.querySelector('#compose-body').value;

      fetch('/emails', {
        method: 'POST',
        body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
        })
      })      
      .then(response => response.json())
      .then(result => {
        console.log(result);
      })
      .then(load_mailbox('sent'))

      return false;
      
    }
  
  }
  
  function load_mailbox(mailbox) {       

    // Show the mailbox and hide other views
    emails_view.style.display = 'block';
    compose_view.style.display = 'none';
  
    // Show the mailbox name
    emails_view.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(data => {    
      data.forEach(mail => {
        const di = document.createElement('div');
        di.className = 'mail';
        di.innerHTML = `Subject: ${mail.subject} - From: ${mail.sender} - Sent at ${mail.timestamp}`;
        emails_view.append(di);
      });
    })
  
  }
  
});

