## 2024新春IT技能提升挑战：

## 目标：

```
medium是很多it博主分享知识的收费Blog，本次挑战目标是建立一个web应用，
实现两个功能，点击"Create pdf files"按钮，
抓取https://medium.com/?tag=software-engineering的top 10 pages并逐段翻译成完整中英文对照文件，
保存成对应pdf文件。生成文件后，点击"Download"按钮
，下载生成的10个pdf文件的zip包到本地。

要求：
* 编程语言不限，第三方框架不限，操作系统不限
* github提交时间为24小时内
* 开发和网络环境自备

评价标准：
* 工程完成度
* 代码量和质量
* 用户体验
* 执行效率

工程提交：
2024年1月6日18:00前提交工程和README.md到自建github账户的私有仓库中，登录密码统一设置为（不含引号）：“2014HappyNewYear”，发送工程链接到微信群。

评价体系：
1: 投票 70分
2: 评委 30分（有一票否决权，拒绝各种作弊，AI除外）
```

## quickstart

### 环境要求

```
1、windows10+
2、python3.12+
3、需要有互联网且能正常访问到https://medium.com/
（若无法访问，可以将页面中的获取标题数量调整为0，将使用已缓存在本地的数据）
（使用的百度翻译接口，每月免费翻译字符数100万，密钥写死在程序里的，如果需要更改请在这里找：game/translate/baidu.py）
```

### 打开Windows PowerShell，拉取并进入项目根目录
```
git clone https://github.com/tfgamelijx/TFGame.git
cd TFGame
```

### 创建一个虚拟环境并安装所需三方库
```
python -m venv .venv
.\.venv\Scripts\activate
pip install -r .\requirements.txt
```

### 运行以下命令，按提示访问链接

```
uvicorn main:app --reload
```

