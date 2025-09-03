import sys
import json
from transformers import pipeline

def main():
	# Read input from stdin
	input_data = sys.stdin.read()
	try:
		payload = json.loads(input_data)
	except Exception as e:
		print(json.dumps({"error": "Invalid input", "details": str(e)}), flush=True)
		return

	message = payload.get("message", "")

	if not message:
		response = "No input message provided."
		print(json.dumps({"suggestion": response}), flush=True)
		return

	import requests
	try:
		ollama_url = "http://localhost:11434/api/generate"
		ollama_model = "llama3.2:latest"
		# Build a context string from onboarding data
		context = ""
		if payload.get("onboardingData"):
			context = f"Onboarding Data: {json.dumps(payload['onboardingData'])}\n"
		prompt = f"{context}User message: {message}"
		ollama_payload = {
			"model": ollama_model,
			"prompt": prompt,
			"stream": False
		}
		response = requests.post(ollama_url, json=ollama_payload)
		if response.status_code == 200:
			data = response.json()
			suggestion = data.get("response", "No response generated.")
			print(json.dumps({"suggestion": suggestion}), flush=True)
		else:
			print(json.dumps({"error": "Ollama API error", "details": response.text}), flush=True)
	except Exception as e:
		print(json.dumps({"error": "Ollama request failed", "details": str(e)}), flush=True)

if __name__ == "__main__":
	main()
