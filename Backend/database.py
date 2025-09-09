from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# MySQL URL format: "mysql+mysqlconnector://user:password@host:port/dbname"
DATABASE_URL = "mysql+mysqlconnector://root:@127.0.0.1:3306/JobRecommendation"

engine = create_engine(DATABASE_URL, echo=True)
#echo=True, enables the sql commands to be logged on the console
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally: 
        db.close()
