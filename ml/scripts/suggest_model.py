import sys
import json
from transformers import pipeline

def main():
	# Read input from stdin
	input_data = sys.stdin.read()
	try:
		onboarding = json.loads(input_data)
	except Exception as e:
		print(json.dumps({"error": "Invalid input", "details": str(e)}), flush=True)
		return

	# Rule-based recommendation logic
	suggestion = ""

	location = onboarding.get("location", {})
	country = location.get("country", "Unknown country")
	city = location.get("city", "Unknown city")
	energy_types = onboarding.get("energyType", [])
	property_type = onboarding.get("propertyType", "property")
	current_usage = onboarding.get("currentUsage", None)
	timeframe = onboarding.get("timeframe", "")
	goals = onboarding.get("goals", [])

	suggestion += f"For your {property_type} in {city}, {country}, "

	if energy_types:
		suggestion += f"consider the following renewable energy options: {', '.join(energy_types)}. "
	else:
		suggestion += "explore renewable energy options suitable for your region. "

	if current_usage:
		suggestion += f"Your current usage is {current_usage} kWh. "

	if "cost_savings" in goals:
		suggestion += "To maximize cost savings, look for local incentives and net metering programs. "

	if timeframe:
		suggestion += f"A {timeframe}-term plan can help you optimize installation and returns. "

	if not suggestion:
		suggestion = "No specific recommendation could be generated."

	print(json.dumps({"suggestion": suggestion}), flush=True)

if __name__ == "__main__":
	main()
