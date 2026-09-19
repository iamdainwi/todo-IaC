import uuid
from datetime import datetime
from app.core.base import Base
from sqlalchemy import Boolean, DateTime, UUID, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column


class TodoModel(Base):
    __tablename__ = "todo"

    todo_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True, nullable=False)
    todo_name: Mapped[str] = mapped_column(String, nullable=False)
    todo_desc: Mapped[str] = mapped_column(Text, nullable=True)
    todo_status: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), nullable=False)