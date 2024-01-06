import base64
import json
import os.path
import random
import re
import shutil
import time

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Image
from reportlab.platypus.para import Paragraph


class PDF():
    def __init__(self):
        current_dir = os.path.dirname(__file__)
        self.__static_dir = os.path.join(os.path.dirname(current_dir), "static")
        # 清空pdf
        if (os.path.exists(os.path.join(self.__static_dir, "pdf"))):
            shutil.rmtree(os.path.join(self.__static_dir, "pdf"))

    def generate_pdf(self, article: list):
        """生成pdf,（article_id,title,author_id,clap_count,url,locked,name,username,user_img,p）"""
        article_id = article[0]
        title = article[1]
        tag = article_id[2]
        print(f"将生成pdf：{title}")
        author_id = article[3]
        clap_count = article[4]
        url = article[5]
        locked = article[6]
        name = article[7]
        username = article[8]
        user_img = article[9]
        ps = json.loads(article[10])
        # 创建pdf
        filename_title = re.sub(r'[^a-zA-Z0-9\s_]', '', title)
        filename_title = re.sub(r'\s+', "-", filename_title)
        filename = os.path.join(self.__static_dir, "pdf",
                                f"{filename_title}-{clap_count}-{'locked' if locked == 1 else 'unlocked'}.pdf")
        if os.path.exists(filename):
            os.remove(filename)
        if not os.path.exists(os.path.join(self.__static_dir, "pdf")):
            os.makedirs(os.path.join(self.__static_dir, "pdf"))
        doc = SimpleDocTemplate(filename, pagesize=letter, )
        pdfmetrics.registerFont(TTFont("SimSun", os.path.join(self.__static_dir, "fonts", "SimSun.ttf")))
        pdfmetrics.registerFont(TTFont("SimSunBold", os.path.join(self.__static_dir, "fonts", "SimSun-Bold.ttf")))
        story = []
        styles = getSampleStyleSheet()
        title_style = styles["Title"]
        title_style.fontName = "SimSunBold"
        title_style.fontSize = 20

        h1_style = styles['Heading1']
        h1_style.fontName = "SimSunBold"

        h2_style = styles['Heading2']
        h2_style.fontName = "SimSunBold"

        h3_style = styles['Heading3']
        h3_style.fontName = "SimSunBold"

        h4_style = styles['Heading4']
        h4_style.fontName = "SimSunBold"

        h5_style = styles['Heading5']
        h5_style.fontName = "SimSunBold"

        normal_style = styles['Normal']
        normal_style.fontName = "SimSun"
        normal_style.spaceAfter = 10

        order_list_style = styles['Normal']
        order_list_style.fontName = "SimSun"
        normal_style.spaceAfter = 10

        unorder_list_style = styles['Normal']
        unorder_list_style.fontName = "SimSun"
        normal_style.spaceAfter = 10

        code_style = styles['Code']
        code_style.fontName = "SimSun"

        italic_style = styles['Italic']
        italic_style.fontName = "SimSun"

        for p in ps:
            type_ = p.get("type")
            if type_ == "IMG":
                img = p.get("img")
                # 转码
                img_b = base64.b64decode(img.encode("utf-8"))
                rand_number=f"{time.time()}_{random.randint(100,110000)}".replace(".","")
                temp_path = os.path.join(self.__static_dir, "pdf", f"{rand_number}.jpg")
                with open(temp_path, "wb+") as f:
                    f.write(img_b)
                image=Image(filename=temp_path,width=100,height=100)
                story.append(image)
                continue
            text = p.get("text")
            zh_text = p.get("zh_text")
            text = text.replace("<", "&lt;").replace(">", "&gt;")
            zh_text = zh_text.replace("<", "&lt;").replace(">", "&gt;")
            # 将字符串按40个字符分割
            chunks = [zh_text[i:i + 40] for i in range(0, len(zh_text), 40)]
            # 将分割后的字符串列表连接起来，并在每个字符串后面添加换行符
            zh_text = '\n'.join(chunks)
            if type_ == "TITLE":
                par = Paragraph(text, title_style)
                story.append(par)
                par = Paragraph(zh_text, title_style)
                story.append(par)
                par = Paragraph(f"({name})", title_style)
                story.append(par)
                par = Paragraph(f"(link:{url})", italic_style)
                story.append(par)
                par = Paragraph(f"(locked:{'yes' if locked == 1 else 'no'} clap_count:{clap_count})", italic_style)
                story.append(par)
                # 转码
                user_img_b = base64.b64decode(user_img.encode("utf-8"))
                temp_path = os.path.join(self.__static_dir, "pdf", "temp.jpg")
                with open(temp_path, "wb+") as f:
                    f.write(user_img_b)
                story.append(Image(filename=temp_path))
            elif type_ == "H1":
                par = Paragraph(text, h1_style)
                story.append(par)
                par = Paragraph(zh_text, h1_style)
                story.append(par)
            elif type_ == "H2":
                par = Paragraph(text, h2_style)
                story.append(par)
                par = Paragraph(zh_text, h2_style)
                story.append(par)
            elif type_ == "H3":
                par = Paragraph(text, h3_style)
                story.append(par)
                par = Paragraph(zh_text, h3_style)
                story.append(par)
            elif type_ == "H4":
                par = Paragraph(text, h4_style)
                story.append(par)
                par = Paragraph(zh_text, h4_style)
                story.append(par)
            elif type_ == "H5":
                par = Paragraph(text, h5_style)
                story.append(par)
                par = Paragraph(zh_text, h5_style)
                story.append(par)
            elif type_ == "OLI":
                par = Paragraph(text, order_list_style)
                story.append(par)
                par = Paragraph(zh_text, order_list_style)
                story.append(par)
            elif type_ == "ULI":
                par = Paragraph(text, unorder_list_style)
                story.append(par)
                par = Paragraph(zh_text, unorder_list_style)
                story.append(par)
            elif type_ == "PRE":
                for t in text.split("\n"):
                    par = Paragraph(t, normal_style)
                    story.append(par)
                for t in zh_text.split("\n"):
                    par = Paragraph(t, normal_style)
                    story.append(par)
            elif type_ == "P":
                par = Paragraph(text, normal_style)
                story.append(par)
                par = Paragraph(zh_text, normal_style)
                story.append(par)
            else:
                print("漏掉了", type_)

        doc.build(story)
