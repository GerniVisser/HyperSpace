from fastapi import FastAPI
import os
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.environ.get('DATABASE_URL') or "postgresql+psycopg2://postgres:changeme@localhost:5432/postgres"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Item(Base):
    __tablename__ = 'items'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

Base.metadata.create_all(bind=engine)

app = FastAPI()

class ItemCreate(BaseModel):
    name: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items")
def read_items():
    session = SessionLocal()
    items = session.query(Item).all()
    session.close()
    return items

@app.post("/items")
def create_item(item: ItemCreate):
    session = SessionLocal()
    db_item = Item(name=item.name)
    session.add(db_item)
    session.commit()
    session.close()
    return db_item
