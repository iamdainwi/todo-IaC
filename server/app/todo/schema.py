import uuid
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

class TodoBase(BaseModel):
    todo_name: str = Field(..., description="Name of the todo")
    todo_desc: Optional[str] = Field(None,description="Description of the todo")
    todo_status: bool = Field(False,description="Status of the todo")

class CreateTodo(TodoBase):
    pass

class Todo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    todo_id: uuid.UUID = Field(..., description="Unique identifier of the todo")
    todo_name: str
    todo_desc: Optional[str]
    todo_status: bool


class UpdateTodo(BaseModel):
    todo_name: Optional[str] = Field(None, description="Name of the todo")
    todo_desc: Optional[str] = Field(None, description="Description of the todo")
    todo_status: Optional[bool] = Field(None, description="Status of the todo")

class DeleteTodo(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    todo_id: uuid.UUID = Field(..., description="Unique identifier of the todo to be deleted")


__all__ = ['CreateTodo', 'Todo', 'UpdateTodo', 'DeleteTodo']