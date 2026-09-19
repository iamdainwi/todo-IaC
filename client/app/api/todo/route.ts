import axios from "axios";
import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://backend:8000";

export async function GET() {
  try {
    const response = await axios.get(`${BACKEND}/todos/`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json({ message: "Failed to fetch todos." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.post(`${BACKEND}/todos/`, body);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json({ message: "Failed to create todo." }, { status: 500 });
  }
}