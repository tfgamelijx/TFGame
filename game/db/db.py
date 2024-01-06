import json
import os
import sqlite3
from logging import Logger

logger = Logger(__name__)


class DB():
    def __init__(self, db_file=None):
        """连接到指定db_file"""
        if db_file is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            db_file = os.path.join(base_dir, 'game.db')
        self.__db_file = db_file

    def save_article_list(self, tag, article_list: list):
        """将文章存储起来，以id,title,clap_count,medium_url,locked进行存储"""
        conn = sqlite3.connect(self.__db_file)
        c = conn.cursor()
        count = 0
        try:
            # 执行sql查询
            c.execute(
                'create table if not exists article(id TEXT primary key,title TEXT, tag TEXT, author_id TEXT, clap_count INTEGER, medium_url TEXT, locked INTEGER, name TEXT, username TEXT, user_img TEXT,p TEXT)')
            # 循环插入数据
            for item in article_list:
                id = item.get('id')
                title = item.get('title')
                clap_count = item.get('clap_count')
                medium_url = item.get('medium_url')
                locked = 1 if item.get('locked') else 0
                author_id = item.get('author_id')
                # 判断是否存在该 数据
                c.execute('select * from article where id=?', (id,))
                result = c.fetchone()
                if result is None:
                    c.execute(
                        "INSERT INTO article(id,title,tag,author_id,clap_count,medium_url,locked) VALUES(?,?,?,?,?,?,?)",
                        (id, title, tag, author_id, clap_count, medium_url, locked))
                    count += 1
                else:
                    # 更新其数据
                    c.execute("update article set clap_count=? where id=?", (clap_count,id))
            # 插入完成
        except Exception as e:
            logger.exception(e)
            conn.rollback()
            return 0
        else:
            conn.commit()
            return count
        finally:
            conn.close()

    def update_article_detail(self, article_id, article: dict):
        """将文章存储起来，以id,title,clap_count,medium_url,locked进行存储"""
        conn = sqlite3.connect(self.__db_file)
        c = conn.cursor()
        try:
            # 插入数据
            name = article.get('name')
            username = article.get('username')
            user_img = article.get('user_img')
            p = json.dumps(article.get('p'))
            c.execute("update  article set name=?,username=?,user_img=?,p=? where id=?",
                      (name, username, user_img, p, article_id))
            # 插入完成
        except Exception as e:
            logger.exception(e)
            conn.rollback()
            return False
        else:
            conn.commit()
            return c.rowcount > 0
        finally:
            conn.close()

    def query_article_list(self, locked: str, min_clap: int, max_clap, sort_field, sort_order, limit):
        """查询推荐列表"""
        conn = sqlite3.connect(self.__db_file)
        c = conn.cursor()
        try:
            # 执行sql查询
            c.execute(
                'create table if not exists article(id TEXT primary key, title TEXT,tag Text, author_id TEXT, clap_count INTEGER, medium_url TEXT, locked INTEGER, name TEXT, username TEXT, user_img TEXT,p TEXT)')
            # 查数据
            c.execute(
                f'select id,title,tag,author_id,clap_count,medium_url,locked,name,username,user_img,p from article where locked in {locked} and clap_count>=? and clap_count<=? order by {sort_field} {sort_order} limit {limit}',
                (min_clap, max_clap))
            result = c.fetchall()
            return result
            # 插入完成
        except Exception as e:
            logger.exception(e)
            conn.rollback()
            return None
        finally:
            conn.close()

    def insert_task(self, task_id: str):
        """插入一个任务id,status:0(开始),1(正常结束),2(异常结束)"""
        conn = sqlite3.connect(self.__db_file)
        c = conn.cursor()
        try:
            # 执行sql查询
            c.execute('create table if not exists task ( id     text primary key, status integer )')
            # 插入数据
            c.execute(
                "INSERT INTO task(id,status) VALUES(?,?)",
                (task_id, 0))
            # 插入完成
        except Exception as e:
            logger.exception(e)
            conn.rollback()
            return False
        else:
            conn.commit()
            return c.rowcount > 0
        finally:
            conn.close()

    def update_task(self, task_id: str, status):
        """更新一个任务id,status:0(开始),1(正常结束),2(异常结束)"""
        conn = sqlite3.connect(self.__db_file)
        c = conn.cursor()
        try:
            # 插入数据
            c.execute(
                "update  task set status=? where id=?",
                (status, task_id))
            # 插入完成
        except Exception as e:
            logger.exception(e)
            conn.rollback()
            return False
        else:
            conn.commit()
            return c.rowcount > 0
        finally:
            conn.close()

    def query_task(self, task_id: str):
        """更新一个任务id,status:0(开始),1(正常结束),2(异常结束)"""
        conn = sqlite3.connect(self.__db_file)
        c = conn.cursor()
        try:
            # 查询数据
            c.execute(
                "select id,status from  task  where id=?",
                (task_id,))
        except Exception as e:
            logger.exception(e)
            conn.rollback()
            return None
        else:
            conn.commit()
            return c.fetchone()
        finally:
            conn.close()


db = DB()
