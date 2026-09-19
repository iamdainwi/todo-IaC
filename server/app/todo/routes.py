from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.core.logger import logger
from app.todo.controllers import create_todo_controller, delete_todo_controller, get_all_todos_controller, update_todo_controller
from app.todo.schema import CreateTodo, UpdateTodo, DeleteTodo
from app.core.dependencies import DBSession
import uuid


router = APIRouter(prefix="/todos", tags=["todos"])


def serialize_todo(todo):
    return {
        "todo_id": str(todo.todo_id),
        "todo_name": todo.todo_name,
        "todo_desc": todo.todo_desc,
        "todo_status": todo.todo_status,
    }


@router.get("/", summary="Get all todos", response_description="List of all todos", response_model=list[dict])
async def get_all_todos(db: DBSession):
    logger.info("Fetching all todo items from the database.")
    """
    Get all todo items.

    Args:
        db (DBSession): The database session dependency.

    Returns:
        list[dict]: A list of dictionaries containing all todo items.
    """
    try:
        todos = get_all_todos_controller(db)
        logger.info(f"Successfully fetched {len(todos)} todo items.")
        return JSONResponse(content=[serialize_todo(todo) for todo in todos])
    except Exception as e:
        logger.exception(f"Error occurred while fetching todo items: {e}")
        return JSONResponse(content={"message": "Failed to fetch todo items."}, status_code=500)

@router.post("/", summary="Create a new todo", response_description="The created todo item", response_model=dict)
async def create_todo(todo: CreateTodo, db: DBSession):
    """
    Create a new todo item.

    Args:
        todo (CreateTodo): The todo item data.
        db (DBSession): The database session dependency.

    Returns:
        dict: A dictionary containing the created todo item data.
    """
    try:
        created_todo = create_todo_controller(todo, db)
        return JSONResponse(content=serialize_todo(created_todo))
    except Exception as e:
        logger.exception(f"Error occurred while creating todo item: {e}")
        return JSONResponse(content={"message": "Failed to create todo item."}, status_code=500)

@router.patch("/{todo_id}", summary="Update an existing todo", response_description="The updated todo item", response_model=dict)
async def update_todo(todo_id: uuid.UUID, todo_data: UpdateTodo, db: DBSession):
    """
    Update an existing todo item.

    Args:
        todo_id (str): The unique identifier of the todo item to be updated.
        todo_data (UpdateTodo): The updated todo item data.
        db (DBSession): The database session dependency.

    Returns:
        dict: A dictionary containing the updated todo item data.
    """
    try:
        updated_todo = update_todo_controller(todo_id, todo_data.dict(exclude_unset=True), db)
        if updated_todo is None:
            return JSONResponse(content={"message": "Todo item not found."}, status_code=404)
        return JSONResponse(content=serialize_todo(updated_todo))
    except Exception as e:
        logger.exception(f"Error occurred while updating todo item {todo_id}: {e}")
        return JSONResponse(content={"message": "Failed to update todo item."}, status_code=500)

@router.delete("/{todo_id}", summary="Delete an existing todo", response_description="Success message indicating the todo item was deleted", response_model=dict)
async def delete_todo(todo_id: uuid.UUID, db: DBSession):
    """
    Delete an existing todo item.

    Args:
        todo_id (str): The unique identifier of the todo item to be deleted.
        db (DBSession): The database session dependency.

    Returns:
        dict: A dictionary containing a success message indicating the todo item was deleted.
    """
    try:
        success = delete_todo_controller(todo_id, db)
        if not success:
            return JSONResponse(content={"message": "Todo item not found."}, status_code=404)
        return JSONResponse(content={"message": "Todo item deleted successfully."})
    except Exception as e:
        logger.exception(f"Error occurred while deleting todo item {todo_id}: {e}")
        return JSONResponse(content={"message": "Failed to delete todo item."}, status_code=500)