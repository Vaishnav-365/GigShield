from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.routers import auth, claims, premium, policies, gigscore
from app.routers import triggers
from app.database import engine, Base
from app.services.trigger_service import run_all_triggers

# Import all models here so Base.metadata knows about every table
from app.models import user        # noqa: F401
from app.models import trigger     # noqa: F401

scheduler = AsyncIOScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create any tables not yet handled by Alembic (safe to keep during dev)
    Base.metadata.create_all(bind=engine)

    # Fire one immediate poll so triggers exist from the first request
    await run_all_triggers()

    # Then poll every 5 minutes
    scheduler.add_job(run_all_triggers, "interval", minutes=5, id="trigger_poll")
    scheduler.start()

    yield  # app is running

    scheduler.shutdown()


app = FastAPI(title="GigShield AI", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(premium.router)
app.include_router(policies.router)
app.include_router(claims.router)
app.include_router(triggers.router)
app.include_router(gigscore.router)

@app.get("/health")
def health():
    return {"status": "ok"}
