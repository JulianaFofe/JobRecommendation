from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

DB_URL = 'postgresql+psycopg2://juliana:qwerty@localhost:5432/jobrecommendation'

engine = create_engine(DB_URL)

sessionLocal = sessionmaker(bind = engine)
Base = declarative_base() 

# Dependency for FastAPI routes
def get_db():
    db = sessionLocal()  # create a new session
    try:
        yield db          # provide it to the endpoint
    finally:
        db.close()