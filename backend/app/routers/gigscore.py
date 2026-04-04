from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.routers.auth import get_current_user_dep
from app.services.gigscore_service import calculate_gigscore, update_gigscore

router = APIRouter(prefix="/api/workers", tags=["GigScore"])

@router.get("/gigscore", response_model=None)
def get_gigscore(
    current_user: User = Depends(get_current_user_dep),
    db: Session = Depends(get_db)
):
    return calculate_gigscore(current_user.id, db)

@router.post("/gigscore/recalculate", response_model=None)
def recalculate_gigscore(
    current_user: User = Depends(get_current_user_dep),
    db: Session = Depends(get_db)
):
    return update_gigscore(current_user.id, db)