from fastapi import FastAPI

from app.todo.routes import router as todo_router

app = FastAPI(
    title="Todo API",
    version="1.0.0"
)

app.include_router(todo_router)


@app.get("/")
def health_check():
    return {"message": "Todo API is running"}