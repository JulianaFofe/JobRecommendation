from enum import Enum

class UserRole(str, Enum):
    EMPLOYEE = "employee"
    EMPLOYER = "employer"
    ADMIN = "admin"

class ApplicationStatus(str, Enum):
    PENDING = "pending"
    SUCCESSFUL = "successful"
    FAILED = "failed"
    APPROVED="approved"
    REJECTED="rejected"