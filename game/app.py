import os.path

from fastapi import FastAPI
from starlette.staticfiles import StaticFiles

from .web import routers

app = FastAPI()

current_dir=os.path.dirname(__file__)
static_dir=os.path.join(current_dir, "static")

app.mount("/static", StaticFiles(directory=static_dir), name="static")
app.include_router(routers.router)
