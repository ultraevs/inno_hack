import logging
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
import json

logging.basicConfig(filename='database.log', level=logging.ERROR, 
                    format='%(asctime)s %(levelname)s:%(message)s')

Base = declarative_base()
engine = create_engine('sqlite:///ml/projects.db')
Session = sessionmaker(bind=engine)

class Project(Base):
    __tablename__ = 'projects'
    id = Column(Integer, primary_key=True)
    project_name = Column(String, unique=True, nullable=False)
    data_list = Column(Text, nullable=False, default='[]')

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
