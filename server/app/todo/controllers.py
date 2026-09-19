from app.todo.schema import CreateTodo
from app.todo.services import create_todo_service, get_all_todos_service, update_todo_service
from app.core.dependencies import DBSession
from app.todo.model import TodoModel
import uuid

def get_all_todos_controller(db: DBSession):
    """
    Controller function to retrieve all todo items.

    Args:
        db (DBSession): The database session dependency.

    Returns:
        list[dict]: A list of dictionaries containing all todo items.
    """
    todos = get_all_todos_service(db)
    return todos


def create_todo_controller(todo: CreateTodo, db: DBSession):
    """
    Controller function to handle the creation of a new todo item.

    Args:
        todo (CreateTodo): The todo item data.

    Returns:
        dict: A dictionary containing the created todo item data.
    """
    created_todo = create_todo_service(todo, db)
    return created_todo

def update_todo_controller(todo_id: uuid.UUID, todo_data: dict, db: DBSession):
    """
    Controller function to handle the update of an existing todo item.

    Args:
        todo_id (str): The unique identifier of the todo item to be updated.
        todo_data (dict): The updated todo item data.

    Returns:
        dict: A dictionary containing the updated todo item data.
    """
    updated_todo = update_todo_service(todo_id, todo_data, db)
    return updated_todo

def delete_todo_controller(todo_id: uuid.UUID, db: DBSession):
    """
    Controller function to handle the deletion of an existing todo item.

    Args:
        todo_id (str): The unique identifier of the todo item to be deleted.

    Returns:
        bool: True if the todo item was successfully deleted, False otherwise.
    """
    todo = db.query(TodoModel).filter(TodoModel.todo_id == todo_id).first()
    if not todo:
        return False

    db.delete(todo)
    db.commit()
    return True