import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Use environment variables for security in production
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = "bamafaith6@gmail.com"
SMTP_PASSWORD = "oexo exqf urhi nmey"  # Gmail App Password

def send_email(to: str, subject: str, body: str):
    """
    Send an email
    :param to: Recipient email
    :param subject: Email subject
    :param body: Email body (plain text)
    """
    msg = MIMEMultipart()
    msg["From"] = SMTP_USERNAME
    msg["To"] = to
    msg["Subject"] = subject

    # Add body
    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(SMTP_USERNAME, to, msg.as_string())
        server.quit()
        print(f"Email sent to {to}")
    except Exception as e:
        print(f"Error sending email: {e}")
