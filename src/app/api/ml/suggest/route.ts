import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function POST(request: NextRequest) {
  try {
    const { onboardingData } = await request.json();
    // Use venv python interpreter
  const PYTHON_PATH = '/Library/Frameworks/Python.framework/Versions/3.13/bin/python3';
    const py = spawn(PYTHON_PATH, [
      'ml/scripts/suggest_model.py'
    ]);

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

    if (error) {
      return NextResponse.json({ error: error }, { status: 500 });
    }
    let output;
    try {
      output = JSON.parse(result);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid output from ML model.' }, { status: 500 });
    }
    return NextResponse.json(output);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process AI suggestion.' }, { status: 500 });
  }
}
