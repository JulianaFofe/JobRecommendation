from enum import Enum

class UserRole(str, Enum):
    EMPLOYEE = "employee"
    EMPLOYER = "employer"
    ADMIN = "admin"