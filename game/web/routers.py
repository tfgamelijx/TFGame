import base64
import json
import logging
import os.path
import random
import re
import time
import zipfile

from fastapi import APIRouter, BackgroundTasks
from starlette.responses import RedirectResponse

from game.db.db import db
from game.medium.medium import Medium, medium
from game.pdf.pdf import PDF

router = APIRouter()

logger = logging.getLogger(__name__)


@router.get("/")
def index():
    return RedirectResponse(url="/static/index.html")


def task_get_articles(task_id: str, size: int, locked: str, cookie: str, tags: str):
    db.insert_task(task_id)
    try:
        medium.set_cookie(cookie)
        if size > 25:
            # 处理tag
            tags = tags.split(",")
            for tag in tags:
                tag_ = tag.strip()
                tag_ = re.sub(r"\s+", "-", tag_)
                tag_ = tag_.lower()
                print(f"使用匿名抓取:{tag}")
                medium.save_articles_to_db(tag=tag_, start=0, size=size)
                if cookie is not None:
                    print(f"使用用户主页抓取:{tag}")
                    medium.save_articles_to_db(tag=tag_, start=0, size=size, method="personal")
        article_list = medium.query_article_list(10, sorting={"field": "clap_count", "order": "desc"},
                                                 filters={"locked": locked})
        for article_id, title, tag, author_id, clap_count, url, locked_, name, username, user_img, p in article_list:
            if p is None:
                if medium.save_article_to_db(author_id, article_id, url):
                    print("文章 {} 内容已存储".format(title))
                else:
                    print("文章 {} 内容存储失败".format(title))
        # 重新查询一次
        article_list = medium.query_article_list(10, sorting={"field": "clap_count", "order": "desc"},
                                                 filters={"locked": locked})
        pdf = PDF()
        # 生成pdf
        for article in article_list:
            pdf.generate_pdf(article)
            print("文章 {} pdf已生成".format(article[1]))
    except Exception as e:
        logger.exception("生成pdf失败")
        db.update_task(task_id, 2)
    else:
        logger.info("生成pdf失败成功")
        db.update_task(task_id, 1)


@router.get("/get_articles")
def get_articles(size: int, locked: str, cookie: str, tags: str, background_tasks: BackgroundTasks):
    print("cookie是", cookie)
    if (cookie is not None) and (cookie != "null"):
        # 进行base64解码
        cookie = base64.b64decode(cookie).decode('utf-8')
    else:
        cookie = None
    task_id = f"{time.time()}{random.randint(0, 1000)}"
    background_tasks.add_task(task_get_articles, task_id, size, locked, cookie, tags)
    return {"message": "获取中", "task_id": task_id}


@router.get("/task/{task_id}")
def query_task(task_id: str):
    return {"message": "查询成功", "data": db.query_task(task_id)}


@router.get("/top_10_articles")
def get_top_10_articles(locked: str = "0|1"):
    data = medium.query_article_list(10, sorting={"field": "clap_count", "order": "desc"},
                                     filters={"locked": locked})
    articles = []
    for article_id, title, tag, author_id, clap_count, url, locked, name, username, user_img, p in data:
        tag = re.sub("-", " ", tag)
        # 首字母大写
        tag = tag.capitalize()
        articles.append(
            {"article_id": article_id, "title": title, "tag": tag, "author": name, "url": url, "clap": clap_count,
             "locked": locked})
    return {"message": "查询成功", "data": articles}


@router.get("/download")
def download():
    """下载"""
    # 先打包
    dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "pdf")
    pdf_files = []
    for root, dirs, files in os.walk(dir):
        for file in files:
            print(file)
            if file.endswith(".pdf"):
                path = os.path.join(root, file)
                pdf_files.append(path)
    if len(pdf_files) == 0:
        return {"message": "请先获取！"}
    filepath = os.path.join(dir, 'pdftop10.zip')
    if os.path.exists(filepath):
        os.remove(filepath)
    # 打开一个zip文件以添加文件
    with zipfile.ZipFile(filepath, 'w', zipfile.ZIP_DEFLATED) as myzip:
        for file in pdf_files:
            myzip.write(file, os.path.relpath(file, dir))
    return {"message": "打包成功！", "data": "/static/pdf/pdftop10.zip"}
