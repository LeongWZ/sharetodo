import os
from django.http import HttpRequest, HttpResponseRedirect
from dotenv import load_dotenv

load_dotenv()

RESET_PASSWORD_CLIENT_ENDPOINT = os.environ.get("RESET_PASSWORD_CLIENT_ENDPOINT")

def reset_password_confirm(request: HttpRequest, uidb64, token):
    return HttpResponseRedirect(RESET_PASSWORD_CLIENT_ENDPOINT)