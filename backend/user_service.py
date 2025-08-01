from jose import JWTError, jwt
from sqlalchemy.orm import Session
from .models import User

ALGORITHM = "HS256"

class UserService:
    def __init__(self, secret_key: str):
        self.secret_key = secret_key

    def verify_token(self, token: str, db: Session) -> bool:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                return False
            user = db.query(User).filter(User.username == username).first()
            return user is not None
        except JWTError:
            return False