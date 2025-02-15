from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

api_variable = os.getenv("API")
client = genai.Client(api_key=api_variable)
response = client.models.generate_content(
    model="gemini-2.0-flash", contents="Explain how AI works"
)
print(response.text)