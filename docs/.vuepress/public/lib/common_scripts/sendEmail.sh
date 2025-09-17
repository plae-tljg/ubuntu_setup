#!/bin/bash

# Default values
d_subject="subjects"
d_txtmessage="msg to send"
d_username='testing0@gmail.com'
d_password='xxxxxxxxxxxxxxxx'
d_From="testing0@gmail.com"
d_rcpt='testing1@gmail.com'

# Prompt user for inputs
read -p "Enter your username (default account leave it blank): " username
username=${username:-$d_username}
read -sp "Enter your password (default account leave it blank): " n_password
n_password=${n_password:-$d_password}
echo ""
read -p "Enter From :(default: $d_From): " From
From=${From:-$d_From}
read -p "rcpt to:  (default: $d_rcpt): " rcpt
rcpt=${rcpt:-$d_rcpt}
read -p "subject:  (default: $d_subject): " subject
subject=${subject:-$d_subject}
read -p "txtmessage:  (default: $d_txtmessage): " txtmessage
txtmessage=${txtmessage:-$d_txtmessage}
read -p "attachment :  (default: empty): " attachment

boundary="boundary123"
attachment_part=""

# Encode the attachment if provided
if [ -n "$attachment" ]; then
  attachment_part=$(cat <<EOM
--$boundary
Content-Type: application/pdf; name="document.pdf"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="document.pdf"

$(base64 "$attachment")
EOM
)
fi

# Construct the email content
email_content=$(cat <<EOM
Subject: $subject
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary=$boundary

--$boundary
Content-Type: text/plain

$txtmessage

$attachment_part
--$boundary--
EOM
)

# Log file for capturing the handshake messages
log_file="smtp_handshake_log.txt"

# Function to send SMTP commands and read response
send_command() {
  local command="$1"
  echo "$command"
  sleep 0.5
}

# OpenSSL command to connect to Gmail SMTP server
{
  sleep 1
  send_command "EHLO $(echo $username | cut -d "@" -f 2)"
  sleep 1
  send_command "AUTH LOGIN"
  sleep 1
  send_command "$(echo -n "$username" | base64)"
  sleep 1
  send_command "$(echo -n "$n_password" | base64)"
  sleep 1
  send_command "MAIL FROM:<$From>"
  sleep 1
  send_command "RCPT TO:<$rcpt>"
  sleep 1
  send_command "DATA"
  sleep 1
  echo "$email_content"
  sleep 1
  send_command "."
  sleep 1
  send_command "QUIT"
} | openssl s_client -connect smtp.gmail.com:465 -crlf -quiet -prexit -debug 2>&1 | tee "$log_file"

echo "Email sent successfully with attachment."
echo "Handshake log saved to $log_file."
