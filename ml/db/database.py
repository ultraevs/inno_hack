import logging
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
import json

logging.basicConfig(filename='ml/logs/database.log', level=logging.ERROR, 
                    format='%(asctime)s %(levelname)s:%(message)s')

Base = declarative_base()
engine = create_engine('sqlite:///ml/projects.db')
Session = sessionmaker(bind=engine)

class Project(Base):
    __tablename__ = 'projects'
    id = Column(Integer, primary_key=True)
    project_name = Column(String, unique=True, nullable=False)
    data_list = Column(Text, nullable=False, default='[]')

class TokenData(Base):
    __tablename__ = 'token_data'
    id = Column(Integer, primary_key=True)
    token = Column(String, unique=True, nullable=False)
    data = Column(Text, nullable=False)

Base.metadata.create_all(engine)

def create_project(project_name):
    session = Session()
    try:
        project = Project(project_name=project_name)
        session.add(project)
        session.commit()
        return project
    except SQLAlchemyError as e:
        session.rollback()
        logging.error(f"Error creating project: {e}")
    finally:
        session.close()

def add_project_data(project_name, new_data):
    session = Session()
    try:
        project = session.query(Project).filter_by(project_name=project_name).first()
        if project:
            current_data = json.loads(project.data_list)
            current_data.append(new_data)
            project.data_list = json.dumps(current_data)
            session.commit()
        else:
            logging.error(f"Project {project_name} not found")
    except SQLAlchemyError as e:
        session.rollback()
        logging.error(f"Error adding project data: {e}")
    finally:
        session.close()

def get_project_data(project_name):
    session = Session()
    try:
        project = session.query(Project).filter_by(project_name=project_name).first()
        if project:
            return json.loads(project.data_list)
        else:
            logging.error(f"Project {project_name} not found")
            return []
    except SQLAlchemyError as e:
        logging.error(f"Error retrieving project data: {e}")
        return []
    finally:
        session.close()

def get_all_project_names():
    session = Session()
    try:
        projects = session.query(Project).all()
        return [project.project_name for project in projects]
    except SQLAlchemyError as e:
        logging.error(f"Error retrieving project names: {e}")
        return []
    finally:
        session.close()

def clear_project_data(project_name):
    session = Session()
    try:
        project = session.query(Project).filter_by(project_name=project_name).first()
        if project:
            project.data_list = json.dumps([])
            session.commit()
        else:
            logging.error(f"Project {project_name} not found")
    except SQLAlchemyError as e:
        session.rollback()
        logging.error(f"Error clearing project data: {e}")
    finally:
        session.close()

def set_token_data(token, data):
    session = Session()
    try:
        token_data = session.query(TokenData).filter_by(token=token).first()
        if token_data:
            token_data.data = json.dumps(data)
        else:
            token_data = TokenData(token=token, data=json.dumps(data))
            session.add(token_data)
        session.commit()
    except SQLAlchemyError as e:
        session.rollback()
        logging.error(f"Error setting token data: {e}")
    finally:
        session.close()

def get_token_data(token):
    session = Session()
    try:
        token_data = session.query(TokenData).filter_by(token=token).first()
        if token_data:
            return json.loads(token_data.data)
        else:
            logging.error(f"Token {token} not found")
            return None
    except SQLAlchemyError as e:
        logging.error(f"Error retrieving token data: {e}")
        return None
    finally:
        session.close()

def delete_token_data(token):
    session = Session()
    try:
        token_data = session.query(TokenData).filter_by(token=token).first()
        if token_data:
            session.delete(token_data)
            session.commit()
        else:
            logging.error(f"Token {token} not found")
    except SQLAlchemyError as e:
        session.rollback()
        logging.error(f"Error deleting token data: {e}")
    finally:
        session.close()