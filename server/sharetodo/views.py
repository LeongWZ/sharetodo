import os
from django.http import HttpRequest, HttpResponseRedirect
from dotenv import load_dotenv

load_dotenv()

CLIENT_ENDPOINT = os.environ.get("CLIENT_ENDPOINT")

def reset_password_confirm(request: HttpRequest, uidb64, token):
    return HttpResponseRedirect(f"{CLIENT_ENDPOINT}/reset-password?uid={uidb64}&token={token}")