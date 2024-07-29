import json

class User:
    def __init__(self, username, password, gender, account_type):
        self.username = username
        self.password = password
        self.gender = gender
        self.account_type = account_type
        self.is_verified = False
        self.profile_picture = None
        self.settings = {
            "privacy": "public",
            "language": "English",
            "theme": "light"
        }

    def edit_profile(self, new_picture=None, new_settings=None):
        if new_picture:
            self.profile_picture = new_picture
        if new_settings:
            self.settings.update(new_settings)

    def verify(self):
        self.is_verified = True

class Chat:
    def __init__(self):
        self.participants = []
        self.messages = []
        self.muted_users = []

    def add_participant(self, user):
        self.participants.append(user)

    def send_message(self, user, message):
        self.messages.append({"user": user.username, "message": message})

    def mute_user(self, user):
        self.muted_users.append(user.username)

def search(query):
    print(f"Searching for: {query}")

def set_theme(theme):
    if theme in ["light", "dark", "custom"]:
        print(f"Theme set to: {theme}")
    else:
        print("Invalid theme")

def run():
    print("Welcome to The Great Forum!")
    # Placeholder for main application loop

if __name__ == "__main__":
    run()
