from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional
from backend.services.auth_service import (
    create_user,
    authenticate_user,
    create_access_token,
    decode_token,
    get_user_by_email
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = get_user_by_email(payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_optional_user(token: Optional[str] = None):
    if not token:
        return None
    try:
        return get_current_user(token)
    except Exception:
        return None

@router.post("/signup", response_model=TokenResponse)
def signup(req: SignupRequest):
    try:
        user = create_user(name=req.name, email=req.email, password=req.password)
        token = create_access_token({"sub": user["email"]})
        return {"access_token": token, "token_type": "bearer", "user": user}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    user = authenticate_user(email=req.email, password=req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": user["email"]})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/token", response_model=TokenResponse)
def login_for_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user["email"]})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/me")
def me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"]
    }
