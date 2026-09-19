import axios from "axios";
import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://backend:8000";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const response = await axios.patch(`${BACKEND}/todos/${id}`, body);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json({ message: "Failed to update todo." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const response = await axios.delete(`${BACKEND}/todos/${id}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json({ message: "Failed to delete todo." }, { status: 500 });
  }
}
