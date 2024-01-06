import hashlib
import logging
import random

import requests

logger = logging.getLogger(__name__)


class BaiduTranslate(object):
    def __init__(self):
        self.__api = "https://fanyi-api.baidu.com/api/trans/vip/translate"
        self.__app_id = "20240106001932514"
        self.__secret = "7nOr7fzvr7Ba1RvOjbBL"

    def translate(self, q):
        res = self.translate_detail(q)
        if res is None:
            return "暂无翻译"
        text = []
        for tran in res.get("trans_result"):
            text.append(tran.get("dst"))
        return "\n".join(text)

    def translate_detail(self, q):
        try:
            salt = f"{random.randint(32768, 65536)}"
            appid = self.__app_id
            secret = self.__secret
            md5 = hashlib.md5()
            md5.update(appid.encode('utf-8'))
            md5.update(q.encode('utf-8'))
            md5.update(salt.encode('utf-8'))
            md5.update(secret.encode('utf-8'))
            data = {
                "q": q,
                "from": "en",
                "to": "zh",
                "appid": appid,
                "salt": salt,
                "sign": md5.hexdigest()
            }
            response = requests.post(self.__api, data=data)
            if response.status_code == 200:
                return response.json()
            else:
                return None
        except:
            logger.exception(f"翻译错误-{q}")
            return None
