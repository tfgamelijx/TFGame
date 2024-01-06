import os.path

from fastapi import FastAPI
from starlette.staticfiles import StaticFiles

from .web import routers

app = FastAPI()

current_dir=os.path.dirname(__file__)
static_dir=os.path.join(current_dir, "static")
assets_dir=os.path.join(current_dir, "static","assets")

app.mount("/static", StaticFiles(directory=static_dir), name="static")
app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
app.include_router(routers.router)
