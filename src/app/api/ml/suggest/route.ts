import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function POST(request: NextRequest) {
  try {
    const { onboardingData } = await request.json();
    const PYTHON_PATH = '/Library/Frameworks/Python.framework/Versions/3.13/bin/python3';
    // Set working directory to project root
    const py = spawn(PYTHON_PATH, [
      'ml/scripts/suggest_model.py'
    ], {
      cwd: process.cwd(),
      env: process.env,
    });

    py.stdin.write(JSON.stringify(onboardingData));
    py.stdin.end();

    let result = '';
    for await (const chunk of py.stdout) {
      result += chunk;
    }
    let error = '';
    for await (const chunk of py.stderr) {
      error += chunk;
    }

    // Improved error logging: always return stderr if present
    if (error) {
      console.error('Python stderr:', error);
      return NextResponse.json({ error: error, result }, { status: 500 });
    }
    // Debug: log the raw result
    console.log('Raw Python output:', JSON.stringify(result));
    // Remove device message and keep only the last JSON line
    const lines = result.split('\n').map(l => l.trim()).filter(Boolean);
    const jsonLine = lines.reverse().find(l => l.startsWith('{') && l.endsWith('}'));
    if (!jsonLine) {
      return NextResponse.json({ error: 'No valid JSON output received from ML model.', details: result }, { status: 500 });
    }
    let output;
    try {
      output = JSON.parse(jsonLine);
    } catch (e) {
      console.error('JSON parse error:', e, 'Raw result:', jsonLine);
      return NextResponse.json({ error: 'Invalid output from ML model.', details: jsonLine }, { status: 500 });
    }
    return NextResponse.json(output);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Failed to process AI suggestion.', details: String(error) }, { status: 500 });
  }
}
