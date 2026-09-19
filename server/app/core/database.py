from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.base import Base
from app.core.settings import settings
from app.todo.model import TodoModel

engine = create_engine(settings.DATABASE_URL, echo=False)

SessionLocal = sessionmaker(bind=engine)

# create tables if not exists
Base.metadata.create_all(engine)

def get_session():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

__all__ = ['get_session']