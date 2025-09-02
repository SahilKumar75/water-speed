import sys
import json
from transformers import pipeline

def main():
    # Read input from stdin
    input_data = sys.stdin.read()
    try:
        onboarding = json.loads(input_data)
    except Exception as e:
        print(json.dumps({"error": "Invalid input", "details": str(e)}))
        return

    # Use a Hugging Face summarization pipeline for demo
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    prompt = f"Suggest renewable energy recommendations for: {json.dumps(onboarding)}"
    result = summarizer(prompt, max_length=60, min_length=20, do_sample=False)
    suggestion = result[0]['summary_text'] if result else "No suggestion generated."
    print(json.dumps({"suggestion": suggestion}), flush=True)

if __name__ == "__main__":
    main()
