from app.core.dependencies import DBSession
from app.todo.model import TodoModel
from app.todo.schema import CreateTodo
import uuid


def get_all_todos_service(db: DBSession):
    """
    Service function to retrieve all todo items.

    Args:
        db (DBSession): The database session dependency.

    Returns:
        list[dict]: A list of dictionaries containing all todo items.
    """
    todos = db.query(TodoModel).all()
    return todos


def create_todo_service(todo: CreateTodo, db: DBSession):
    """
    Service function to create a new todo item.

    Args:
        todo (CreateTodo): The todo item data.

    Returns:
        dict: A dictionary containing the created todo item data.
    """

    new_todo = TodoModel(
        todo_name=todo.todo_name,
        todo_desc=todo.todo_desc,
        todo_status=todo.todo_status
    )

    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)

    return new_todo


def update_todo_service(todo_id: uuid.UUID, todo_data: dict, db: DBSession):
    """
    Service function to update an existing todo item.

    Args:
        todo_id (str): The unique identifier of the todo item to be updated.
        todo_data (dict): The updated todo item data.

    Returns:
        dict: A dictionary containing the updated todo item data.
    """
    todo = db.query(TodoModel).filter(TodoModel.todo_id == todo_id).first()
    if not todo:
        return None

    for key, value in todo_data.items():
        setattr(todo, key, value)

    db.commit()
    db.refresh(todo)

    return todo

def delete_todo_service(todo_id: uuid.UUID, db: DBSession):
    """
    Service function to delete an existing todo item.

    Args:
        todo_id (str): The unique identifier of the todo item to be deleted.

    Returns:
        bool: True if the todo item was deleted successfully, False otherwise.
    """
    todo = db.query(TodoModel).filter(TodoModel.todo_id == todo_id).first()
    if not todo:
        return False

    db.delete(todo)
    db.commit()

    return True