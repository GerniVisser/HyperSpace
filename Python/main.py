from fastapi import FastAPI
import os
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import requests
import logging

DATABASE_URL = os.environ.get('DATABASE_URL')
NODE_URL = os.environ.get('NODE_URL')

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

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
    webhook_url = "http://node:4000/webhook"
    try:
        requests.post(webhook_url, json={"name": "Jo"})
        logger.debug('Notified Node.js server')
    except requests.exceptions.RequestException as e:
        print(f"Failed to notify Node.js server: {e}")
    return {"Hello": "Joe"}

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

    webhook_url = "http://node:4000/webhook"
    requests.post(webhook_url, json={"name": item.name})
    
    return db_item
