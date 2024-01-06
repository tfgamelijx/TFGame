import base64
import json
from typing import Union

import requests
from bs4 import BeautifulSoup

from game.db.db import db
from game.translate.baidu import BaiduTranslate


class Medium():
    def __init__(self, headers=None):
        """获取Medium的内容"""
        # headers
        self.__headers = headers
        # 初始化session
        self.__session = self.__make_session()
        # db
        self.__db = db

    def __make_session(self):
        """创建session"""
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
            "Accept-Encoding": "gzip, deflate, br",
            "Accept": "*/*",
            "Connection": "keep-alive",
            "Content-Type": "application/json",
        } if self.__headers is None else self.__headers
        session = requests.Session()
        session.headers = headers
        return session

    def __query_article_list(self, tag: str, start: int, size: int):
        """获取指定tag下size个文章列表，返回的格式为[{title,clap_count,medium_url,locked}]"""
        # 按照每25个返回
        limt = 25
        recommend_list = []
        for i in range(start, start + size, limt):
            from_ = i
            to = i + limt
            process_items = []
            for item in self.__query_article_list_detail(tag, from_, to, limt):
                article = self.__process_article_item(item)
                print("已获取到文章标题：", article.get("title"))
                process_items.append(article)
            recommend_list.extend(process_items)
        print(f"获取文章标题结束，本次获取了{start}-{start + size}范围的标题")
        return recommend_list

    def __query_article_list_detail(self, tag: str, from_: int, to: int, size: int):
        """获取推荐文章的细节"""
        data = [
            {
                "operationName": "TagRecommendedFeedQuery",
                "variables": {
                    "tagSlug": tag,
                    "paging": {
                        "from": f"{from_}",
                        "limit": size,
                        "source": "",
                        "to": f"{to}",
                    }
                },
                "query": "query TagRecommendedFeedQuery($tagSlug: String!, $paging: PagingOptions) "
                         "{\n  tagFromSlug(tagSlug: $tagSlug) {\n    id\n    viewerEdge {\n      id\n      recommendedPostsFeed(paging: $paging) {\n        items {\n          feedId\n          reason\n          moduleSourceEncoding\n          post {\n            ...StreamPostPreview_post\n            __typename\n          }\n          __typename\n        }\n        pagingInfo {\n          next {\n            from\n            limit\n            source\n            to\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment StreamPostPreview_post on Post {\n  id\n  ...StreamPostPreviewContent_post\n  ...PostPreviewContainer_post\n  __typename\n}\n\nfragment StreamPostPreviewContent_post on Post {\n  id\n  title\n  previewImage {\n    id\n    __typename\n  }\n  extendedPreviewContent {\n    subtitle\n    __typename\n  }\n  ...StreamPostPreviewImage_post\n  ...PostPreviewFooter_post\n  ...PostPreviewByLine_post\n  ...PostPreviewInformation_post\n  __typename\n}\n\nfragment StreamPostPreviewImage_post on Post {\n  title\n  previewImage {\n    ...StreamPostPreviewImage_imageMetadata\n    __typename\n    id\n  }\n  __typename\n  id\n}\n\nfragment StreamPostPreviewImage_imageMetadata on ImageMetadata {\n  id\n  focusPercentX\n  focusPercentY\n  alt\n  __typename\n}\n\nfragment PostPreviewFooter_post on Post {\n  ...PostPreviewFooterSocial_post\n  ...PostPreviewFooterMenu_post\n  __typename\n  id\n}\n\nfragment PostPreviewFooterSocial_post on Post {\n  id\n  ...MultiVote_post\n  allowResponses\n  isLimitedState\n  postResponses {\n    count\n    __typename\n  }\n  __typename\n}\n\nfragment MultiVote_post on Post {\n  id\n  creator {\n    id\n    ...SusiClickable_user\n    __typename\n  }\n  isPublished\n  ...SusiClickable_post\n  collection {\n    id\n    slug\n    __typename\n  }\n  isLimitedState\n  ...MultiVoteCount_post\n  __typename\n}\n\nfragment SusiClickable_user on User {\n  ...SusiContainer_user\n  __typename\n  id\n}\n\nfragment SusiContainer_user on User {\n  ...SignInOptions_user\n  ...SignUpOptions_user\n  __typename\n  id\n}\n\nfragment SignInOptions_user on User {\n  id\n  name\n  __typename\n}\n\nfragment SignUpOptions_user on User {\n  id\n  name\n  __typename\n}\n\nfragment SusiClickable_post on Post {\n  id\n  mediumUrl\n  ...SusiContainer_post\n  __typename\n}\n\nfragment SusiContainer_post on Post {\n  id\n  __typename\n}\n\nfragment MultiVoteCount_post on Post {\n  id\n  __typename\n}\n\nfragment PostPreviewFooterMenu_post on Post {\n  creator {\n    __typename\n    id\n  }\n  collection {\n    __typename\n    id\n  }\n  ...BookmarkButton_post\n  ...ExpandablePostCardOverflowButton_post\n  __typename\n  id\n}\n\nfragment BookmarkButton_post on Post {\n  visibility\n  ...SusiClickable_post\n  ...AddToCatalogBookmarkButton_post\n  __typename\n  id\n}\n\nfragment AddToCatalogBookmarkButton_post on Post {\n  ...AddToCatalogBase_post\n  __typename\n  id\n}\n\nfragment AddToCatalogBase_post on Post {\n  id\n  isPublished\n  __typename\n}\n\nfragment ExpandablePostCardOverflowButton_post on Post {\n  creator {\n    id\n    __typename\n  }\n  ...ExpandablePostCardReaderButton_post\n  __typename\n  id\n}\n\nfragment ExpandablePostCardReaderButton_post on Post {\n  id\n  collection {\n    id\n    __typename\n  }\n  creator {\n    id\n    __typename\n  }\n  clapCount\n  ...ClapMutation_post\n  __typename\n}\n\nfragment ClapMutation_post on Post {\n  __typename\n  id\n  clapCount\n  ...MultiVoteCount_post\n}\n\nfragment PostPreviewByLine_post on Post {\n  id\n  creator {\n    ...PostPreviewByLine_user\n    __typename\n    id\n  }\n  collection {\n    ...PostPreviewByLine_collection\n    __typename\n    id\n  }\n  ...CardByline_post\n  __typename\n}\n\nfragment PostPreviewByLine_user on User {\n  id\n  __typename\n  ...CardByline_user\n  ...ExpandablePostByline_user\n}\n\nfragment CardByline_user on User {\n  __typename\n  id\n  name\n  username\n  mediumMemberAt\n  socialStats {\n    followerCount\n    __typename\n  }\n  ...useIsVerifiedBookAuthor_user\n  ...userUrl_user\n  ...UserMentionTooltip_user\n}\n\nfragment useIsVerifiedBookAuthor_user on User {\n  verifications {\n    isBookAuthor\n    __typename\n  }\n  __typename\n  id\n}\n\nfragment userUrl_user on User {\n  __typename\n  id\n  customDomainState {\n    live {\n      domain\n      __typename\n    }\n    __typename\n  }\n  hasSubdomain\n  username\n}\n\nfragment UserMentionTooltip_user on User {\n  id\n  name\n  username\n  bio\n  imageId\n  mediumMemberAt\n  membership {\n    tier\n    __typename\n    id\n  }\n  ...UserAvatar_user\n  ...UserFollowButton_user\n  ...useIsVerifiedBookAuthor_user\n  __typename\n}\n\nfragment UserAvatar_user on User {\n  __typename\n  id\n  imageId\n  mediumMemberAt\n  membership {\n    tier\n    __typename\n    id\n  }\n  name\n  username\n  ...userUrl_user\n}\n\nfragment UserFollowButton_user on User {\n  ...UserFollowButtonSignedIn_user\n  ...UserFollowButtonSignedOut_user\n  __typename\n  id\n}\n\nfragment UserFollowButtonSignedIn_user on User {\n  id\n  name\n  __typename\n}\n\nfragment UserFollowButtonSignedOut_user on User {\n  id\n  ...SusiClickable_user\n  __typename\n}\n\nfragment ExpandablePostByline_user on User {\n  __typename\n  id\n  name\n  imageId\n  ...userUrl_user\n  ...useIsVerifiedBookAuthor_user\n}\n\nfragment PostPreviewByLine_collection on Collection {\n  id\n  __typename\n  ...CardByline_collection\n  ...CollectionLinkWithPopover_collection\n}\n\nfragment CardByline_collection on Collection {\n  name\n  ...collectionUrl_collection\n  __typename\n  id\n}\n\nfragment collectionUrl_collection on Collection {\n  id\n  domain\n  slug\n  __typename\n}\n\nfragment CollectionLinkWithPopover_collection on Collection {\n  ...collectionUrl_collection\n  ...CollectionTooltip_collection\n  __typename\n  id\n}\n\nfragment CollectionTooltip_collection on Collection {\n  id\n  name\n  description\n  subscriberCount\n  ...CollectionAvatar_collection\n  ...CollectionFollowButton_collection\n  __typename\n}\n\nfragment CollectionAvatar_collection on Collection {\n  name\n  avatar {\n    id\n    __typename\n  }\n  ...collectionUrl_collection\n  __typename\n  id\n}\n\nfragment CollectionFollowButton_collection on Collection {\n  __typename\n  id\n  name\n  slug\n  ...collectionUrl_collection\n  ...SusiClickable_collection\n}\n\nfragment SusiClickable_collection on Collection {\n  ...SusiContainer_collection\n  __typename\n  id\n}\n\nfragment SusiContainer_collection on Collection {\n  name\n  ...SignInOptions_collection\n  ...SignUpOptions_collection\n  __typename\n  id\n}\n\nfragment SignInOptions_collection on Collection {\n  id\n  name\n  __typename\n}\n\nfragment SignUpOptions_collection on Collection {\n  id\n  name\n  __typename\n}\n\nfragment CardByline_post on Post {\n  ...DraftStatus_post\n  ...Star_post\n  ...shouldShowPublishedInStatus_post\n  __typename\n  id\n}\n\nfragment DraftStatus_post on Post {\n  id\n  pendingCollection {\n    id\n    creator {\n      id\n      __typename\n    }\n    ...BoldCollectionName_collection\n    __typename\n  }\n  statusForCollection\n  creator {\n    id\n    __typename\n  }\n  isPublished\n  __typename\n}\n\nfragment BoldCollectionName_collection on Collection {\n  id\n  name\n  __typename\n}\n\nfragment Star_post on Post {\n  id\n  creator {\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment shouldShowPublishedInStatus_post on Post {\n  statusForCollection\n  isPublished\n  __typename\n  id\n}\n\nfragment PostPreviewInformation_post on Post {\n  pinnedAt\n  latestPublishedAt\n  firstPublishedAt\n  readingTime\n  isLocked\n  ...Star_post\n  __typename\n  id\n}\n\nfragment PostPreviewContainer_post on Post {\n  id\n  extendedPreviewContent {\n    isFullContent\n    __typename\n  }\n  visibility\n  pinnedAt\n  ...PostScrollTracker_post\n  ...usePostUrl_post\n  __typename\n}\n\nfragment PostScrollTracker_post on Post {\n  id\n  collection {\n    id\n    __typename\n  }\n  sequence {\n    sequenceId\n    __typename\n  }\n  __typename\n}\n\nfragment usePostUrl_post on Post {\n  id\n  creator {\n    ...userUrl_user\n    __typename\n    id\n  }\n  collection {\n    id\n    domain\n    slug\n    __typename\n  }\n  isSeries\n  mediumUrl\n  sequence {\n    slug\n    __typename\n  }\n  uniqueSlug\n  __typename\n}\n"
            }
        ]
        response = self.__session.post("https://medium.com/_/graphql", json=data)
        data = response.json()
        items = self.__get_data_from_data(data, 0, "data", "tagFromSlug", "viewerEdge", "recommendedPostsFeed", "items")
        return items

    def __process_article_item(self, item: dict):
        """将推荐列表处理为指定格式{title,clap_count,medium_url,locked}"""
        out_item = {
            "id": self.__get_data_from_data(item, "post", "id"),
            "title": self.__get_data_from_data(item, "post", "title"),
            "clap_count": self.__get_data_from_data(item, "post", "clapCount"),
            "medium_url": self.__get_data_from_data(item, "post", 'mediumUrl'),
            "locked": self.__get_data_from_data(item, "post", 'isLocked'),
            "author_id": self.__get_data_from_data(item, "post", "creator", "id")
        }
        return out_item

    def save_article_list_to_db(self, tag: str = "software-engineering", start: int = 0, size: int = 100):
        """存储到db，存储成功返回 True"""
        article_list = self.__query_article_list(tag, start, size)
        rows = self.__db.save_article_list(article_list)
        print(f"共获取了{len(article_list)}个标题，实际存储到数据库{rows}个")
        return rows

    def query_article_list(self, limit: int, filters: dict = None, sorting: dict = None):
        """筛选推荐列表，返回[（article_id,title,author_id,clap_count,url,locked,name,username,user_img,p）]

        filters：locked:文章状态(0,1)，min_clap_count:最小鼓掌数，max_clap_count:最大鼓掌数：
        sorting：field:排序字段(clap_count)，order（asc,desc）
        """
        if filters is None:
            filters = dict()
        if sorting is None:
            sorting = dict()
        # 排序字段
        sorting_field = sorting.get("field", "clap_count")
        sorting_order = sorting.get("order", "asc")
        # 筛选字段
        locked = filters.get("locked", "0|1")
        min_clap_count = filters.get("min_clap_count", 0)
        max_clap_count = filters.get("max_clap_count", 999999999999)
        match locked:
            case "0" | 0:
                locked = "(0)"
            case "1" | 1:
                locked = "(1)"
            case "0|1" | "1|0":
                locked = "(1,0)"
            case _:
                raise Exception("只能是0,1或0|1")

        return self.__db.query_article_list(locked, min_clap_count, max_clap_count, sorting_field, sorting_order,
                                            limit)

    def __get_data_from_data(self, data: Union[dict, list], *key: Union[str, int]):
        # 如果是列表，递归调用
        if data is None:
            return None
        if len(key) == 0:
            return data
        if type(data) == list:
            if type(key[0]) != int:
                raise Exception("key must be an integer")
            return self.__get_data_from_data(data.pop(key[0]), *key[1:])
        if type(data) == dict:
            return self.__get_data_from_data(data.get(key[0]), *key[1:])

    def __query_article(self, author_id, url):
        baidu=BaiduTranslate()
        response = self.__session.get(url)
        html = response.text
        soup = BeautifulSoup(html, "lxml")
        script_tags = soup.find_all('script')
        for tag in script_tags:
            tag_string = tag.string.strip()
            if tag_string.startswith("window.__APOLLO_STATE__ = "):
                content_json_string = tag_string[26:]
                break
        else:
            return None
        # 载入为json
        content_json = json.loads(content_json_string)
        # 取得文章作者
        article = {}
        title = False
        for key, value in content_json.items():
            if key.startswith(f"User:{author_id}"):
                article["name"] = value.get("name")
                article["username"] = value.get("username")
                img_id = value.get("imageId")
                picture = self.__get_picture_to_base64(img_id, 100)
                article["user_img"] = picture
            if key.startswith("Paragraph:"):
                # 文章
                if article.get("p") is None:
                    article["p"] = []
                type_ = value.get("type")
                if type_.startswith("H") or type_ in["OLI","P","ULI","PRE"]:
                    text = value.get("text")
                    zh_text = baidu.translate(text)
                    if title is False:
                        title = True
                        article["p"].append({"text": text, "type": "TITLE","zh_text":zh_text})
                    elif type_ == "H1":
                        article["p"].append({"text": text, "type": "H1","zh_text":zh_text})
                    elif type_ == "H2":
                        article["p"].append({"text": text, "type": "H2","zh_text":zh_text})
                    elif type_ == "H3":
                        article["p"].append({"text": text, "type": "H3","zh_text":zh_text})
                    elif type_ == "H4":
                        article["p"].append({"text": text, "type": "H4","zh_text":zh_text})
                    elif type_ == "H5":
                        article["p"].append({"text": text, "type": "H5","zh_text":zh_text})
                    elif type_ == 'OLI':
                        article["p"].append({"text": text, "type": 'OLI',"zh_text":zh_text})
                    elif type_ == 'ULI':
                        article["p"].append({"text": text, "type": 'ULI',"zh_text":zh_text})
                    elif type_ == "P":
                        article["p"].append({"text": text, "type": "P","zh_text":zh_text})
                    elif type_ == "PRE":
                        article["p"].append({"text": text, "type": "PRE","zh_text":zh_text})
                    else:
                        raise Exception(type_)
                elif type_ == "IMG":
                    ref = value.get("metadata").get("__ref")
                    img_id = ref.split(":")[1]
                    height = content_json.get(ref).get("originalHeight")
                    # picture = self.__get_picture_to_base64(img_id, height)
                    # article["p"].append({"img": picture, "type": "IMG"})
                else:
                    print("漏掉了", type_)
        return article

    def save_article_to_db(self, author_id, article_id, url):
        """将文章存储到数据库 """
        article = self.__query_article(author_id, url)
        return self.__db.update_article_detail(article_id, article)

    def __get_picture_to_base64(self, image_id, height):
        response = self.__session.get(f"https://miro.medium.com/v2/resize:fit:{height}/format:webp/{image_id}")
        image_base64 = base64.b64encode(response.content).decode("utf-8")
        return image_base64


medium = Medium()
