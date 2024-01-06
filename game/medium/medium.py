import base64
import json
from typing import Union

import requests
from bs4 import BeautifulSoup

from game.db.db import db
from game.translate.baidu import BaiduTranslate


class Medium():
    def __init__(self, headers=None, cookie: str = None):
        """获取Medium的内容"""
        # headers
        self.__cookie = cookie
        self.__headers = headers
        # db
        self.__db = db
        # 初始化session
        self.__session = self.__make_session()

    def __make_session(self):
        """创建session"""
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
            "Accept-Encoding": "gzip, deflate, br",
            "Accept": "*/*",
            "Connection": "keep-alive",
            "Content-Type": "application/json"
        } if self.__headers is None else self.__headers
        if self.__cookie is not None:
            headers["Cookie"] = self.__cookie
        session = requests.Session()
        session.headers = headers
        return session

    def __query_articles(self, tag: str, start: int, size: int, method):
        """通过推荐获取指定tag下size个文章列表，返回的格式为[{title,clap_count,medium_url,locked}]，可通过mehod:recommend或persoall方式获取"""
        # 按照每25个返回
        limt = 25
        articles = []
        null_list_count=0
        null_list_count_max=5
        for i in range(start, start + size, limt):
            from_ = i
            to = i + limt
            process_items = []
            if method == "recommend":
                get_articles = self.__query_articles_by_recommend_detail(tag, from_, to, limt)
            else:
                get_articles = self.__query_articles_by_personal_detail(tag, from_, to, limt)
            if len(get_articles) <=0:
                null_list_count+=1
            if null_list_count>null_list_count_max:
                print(f"连续{null_list_count_max}次未能继续获取到数据，跳出 ！")
                break
            for article_item in get_articles:
                article = self.__process_article_item(article_item)
                print("已获取到文章标题：", article.get("title"))
                process_items.append(article)
            articles.extend(process_items)
        print(f"获取文章标题结束，本次获取了{start}-{start + size}范围的标题")
        return articles

    def __query_articles_by_recommend_detail(self, tag: str, from_: int, to: int, size: int):
        """通过推荐获取文章的细节（无需登录）"""
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
        return items if items is not None else []

    def __query_articles_by_personal_detail(self, tag: str, from_: int, to: int, size: int):
        """通过个人页获取文章的细节（需要登录）"""
        data = [
            {
                "operationName": "WebInlineTopicFeedQuery",
                "variables": {
                    "tagSlug": f"{tag}",
                    "paging": {
                        "to": f"{to}",
                        "from": f"{from_}",
                        "limit": size,
                        "source": ""
                    },
                    "skipCache": False
                },
                "query": "query WebInlineTopicFeedQuery($tagSlug: String!, $paging: PagingOptions!, $skipCache: Boolean) {\n  personalisedTagFeed(tagSlug: $tagSlug, paging: $paging, skipCache: $skipCache) {\n    items {\n      ... on TagFeedItem {\n        feedId\n        reason\n        moduleSourceEncoding\n        post {\n          ...PostPreview_post\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    pagingInfo {\n      next {\n        source\n        limit\n        from\n        to\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment PostPreview_post on Post {\n  id\n  creator {\n    ...PostPreview_user\n    __typename\n    id\n  }\n  collection {\n    ...CardByline_collection\n    ...ExpandablePostByline_collection\n    __typename\n    id\n  }\n  ...InteractivePostBody_postPreview\n  firstPublishedAt\n  isLocked\n  isSeries\n  latestPublishedAt\n  inResponseToCatalogResult {\n    __typename\n  }\n  pinnedAt\n  pinnedByCreatorAt\n  previewImage {\n    id\n    focusPercentX\n    focusPercentY\n    __typename\n  }\n  readingTime\n  sequence {\n    slug\n    __typename\n  }\n  title\n  uniqueSlug\n  ...CardByline_post\n  ...PostFooterActionsBar_post\n  ...InResponseToEntityPreview_post\n  ...PostScrollTracker_post\n  ...HighDensityPreview_post\n  __typename\n}\n\nfragment PostPreview_user on User {\n  __typename\n  name\n  username\n  ...CardByline_user\n  ...ExpandablePostByline_user\n  id\n}\n\nfragment CardByline_user on User {\n  __typename\n  id\n  name\n  username\n  mediumMemberAt\n  socialStats {\n    followerCount\n    __typename\n  }\n  ...useIsVerifiedBookAuthor_user\n  ...userUrl_user\n  ...UserMentionTooltip_user\n}\n\nfragment useIsVerifiedBookAuthor_user on User {\n  verifications {\n    isBookAuthor\n    __typename\n  }\n  __typename\n  id\n}\n\nfragment userUrl_user on User {\n  __typename\n  id\n  customDomainState {\n    live {\n      domain\n      __typename\n    }\n    __typename\n  }\n  hasSubdomain\n  username\n}\n\nfragment UserMentionTooltip_user on User {\n  id\n  name\n  username\n  bio\n  imageId\n  mediumMemberAt\n  membership {\n    tier\n    __typename\n    id\n  }\n  ...UserAvatar_user\n  ...UserFollowButton_user\n  ...useIsVerifiedBookAuthor_user\n  __typename\n}\n\nfragment UserAvatar_user on User {\n  __typename\n  id\n  imageId\n  mediumMemberAt\n  membership {\n    tier\n    __typename\n    id\n  }\n  name\n  username\n  ...userUrl_user\n}\n\nfragment UserFollowButton_user on User {\n  ...UserFollowButtonSignedIn_user\n  ...UserFollowButtonSignedOut_user\n  __typename\n  id\n}\n\nfragment UserFollowButtonSignedIn_user on User {\n  id\n  name\n  __typename\n}\n\nfragment UserFollowButtonSignedOut_user on User {\n  id\n  ...SusiClickable_user\n  __typename\n}\n\nfragment SusiClickable_user on User {\n  ...SusiContainer_user\n  __typename\n  id\n}\n\nfragment SusiContainer_user on User {\n  ...SignInOptions_user\n  ...SignUpOptions_user\n  __typename\n  id\n}\n\nfragment SignInOptions_user on User {\n  id\n  name\n  __typename\n}\n\nfragment SignUpOptions_user on User {\n  id\n  name\n  __typename\n}\n\nfragment ExpandablePostByline_user on User {\n  __typename\n  id\n  name\n  imageId\n  ...userUrl_user\n  ...useIsVerifiedBookAuthor_user\n}\n\nfragment CardByline_collection on Collection {\n  name\n  ...collectionUrl_collection\n  __typename\n  id\n}\n\nfragment collectionUrl_collection on Collection {\n  id\n  domain\n  slug\n  __typename\n}\n\nfragment ExpandablePostByline_collection on Collection {\n  __typename\n  id\n  name\n  domain\n  slug\n}\n\nfragment InteractivePostBody_postPreview on Post {\n  extendedPreviewContent(\n    truncationConfig: {previewParagraphsWordCountThreshold: 400, minimumWordLengthForTruncation: 150, truncateAtEndOfSentence: true, showFullImageCaptions: true, shortformPreviewParagraphsWordCountThreshold: 30, shortformMinimumWordLengthForTruncation: 30}\n  ) {\n    bodyModel {\n      ...PostBody_bodyModel\n      __typename\n    }\n    isFullContent\n    __typename\n  }\n  __typename\n  id\n}\n\nfragment PostBody_bodyModel on RichText {\n  sections {\n    name\n    startIndex\n    textLayout\n    imageLayout\n    backgroundImage {\n      id\n      originalHeight\n      originalWidth\n      __typename\n    }\n    videoLayout\n    backgroundVideo {\n      videoId\n      originalHeight\n      originalWidth\n      previewImageId\n      __typename\n    }\n    __typename\n  }\n  paragraphs {\n    id\n    ...PostBodySection_paragraph\n    __typename\n  }\n  ...normalizedBodyModel_richText\n  __typename\n}\n\nfragment PostBodySection_paragraph on Paragraph {\n  name\n  ...PostBodyParagraph_paragraph\n  __typename\n  id\n}\n\nfragment PostBodyParagraph_paragraph on Paragraph {\n  name\n  type\n  ...ImageParagraph_paragraph\n  ...TextParagraph_paragraph\n  ...IframeParagraph_paragraph\n  ...MixtapeParagraph_paragraph\n  ...CodeBlockParagraph_paragraph\n  __typename\n  id\n}\n\nfragment ImageParagraph_paragraph on Paragraph {\n  href\n  layout\n  metadata {\n    id\n    originalHeight\n    originalWidth\n    focusPercentX\n    focusPercentY\n    alt\n    __typename\n  }\n  ...Markups_paragraph\n  ...ParagraphRefsMapContext_paragraph\n  ...PostAnnotationsMarker_paragraph\n  __typename\n  id\n}\n\nfragment Markups_paragraph on Paragraph {\n  name\n  text\n  hasDropCap\n  dropCapImage {\n    ...MarkupNode_data_dropCapImage\n    __typename\n    id\n  }\n  markups {\n    ...Markups_markup\n    __typename\n  }\n  __typename\n  id\n}\n\nfragment MarkupNode_data_dropCapImage on ImageMetadata {\n  ...DropCap_image\n  __typename\n  id\n}\n\nfragment DropCap_image on ImageMetadata {\n  id\n  originalHeight\n  originalWidth\n  __typename\n}\n\nfragment Markups_markup on Markup {\n  type\n  start\n  end\n  href\n  anchorType\n  userId\n  linkMetadata {\n    httpStatus\n    __typename\n  }\n  __typename\n}\n\nfragment ParagraphRefsMapContext_paragraph on Paragraph {\n  id\n  name\n  text\n  __typename\n}\n\nfragment PostAnnotationsMarker_paragraph on Paragraph {\n  ...PostViewNoteCard_paragraph\n  __typename\n  id\n}\n\nfragment PostViewNoteCard_paragraph on Paragraph {\n  name\n  __typename\n  id\n}\n\nfragment TextParagraph_paragraph on Paragraph {\n  type\n  hasDropCap\n  codeBlockMetadata {\n    mode\n    lang\n    __typename\n  }\n  ...Markups_paragraph\n  ...ParagraphRefsMapContext_paragraph\n  __typename\n  id\n}\n\nfragment IframeParagraph_paragraph on Paragraph {\n  type\n  iframe {\n    mediaResource {\n      id\n      iframeSrc\n      iframeHeight\n      iframeWidth\n      title\n      __typename\n    }\n    __typename\n  }\n  layout\n  ...Markups_paragraph\n  __typename\n  id\n}\n\nfragment MixtapeParagraph_paragraph on Paragraph {\n  type\n  mixtapeMetadata {\n    href\n    mediaResource {\n      mediumCatalog {\n        id\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  ...GenericMixtapeParagraph_paragraph\n  __typename\n  id\n}\n\nfragment GenericMixtapeParagraph_paragraph on Paragraph {\n  text\n  mixtapeMetadata {\n    href\n    thumbnailImageId\n    __typename\n  }\n  markups {\n    start\n    end\n    type\n    href\n    __typename\n  }\n  __typename\n  id\n}\n\nfragment CodeBlockParagraph_paragraph on Paragraph {\n  codeBlockMetadata {\n    lang\n    mode\n    __typename\n  }\n  __typename\n  id\n}\n\nfragment normalizedBodyModel_richText on RichText {\n  paragraphs {\n    ...normalizedBodyModel_richText_paragraphs\n    __typename\n  }\n  sections {\n    startIndex\n    ...getSectionEndIndex_section\n    __typename\n  }\n  ...getParagraphStyles_richText\n  ...getParagraphSpaces_richText\n  __typename\n}\n\nfragment normalizedBodyModel_richText_paragraphs on Paragraph {\n  markups {\n    ...normalizedBodyModel_richText_paragraphs_markups\n    __typename\n  }\n  codeBlockMetadata {\n    lang\n    mode\n    __typename\n  }\n  ...getParagraphHighlights_paragraph\n  ...getParagraphPrivateNotes_paragraph\n  __typename\n  id\n}\n\nfragment normalizedBodyModel_richText_paragraphs_markups on Markup {\n  type\n  __typename\n}\n\nfragment getParagraphHighlights_paragraph on Paragraph {\n  name\n  __typename\n  id\n}\n\nfragment getParagraphPrivateNotes_paragraph on Paragraph {\n  name\n  __typename\n  id\n}\n\nfragment getSectionEndIndex_section on Section {\n  startIndex\n  __typename\n}\n\nfragment getParagraphStyles_richText on RichText {\n  paragraphs {\n    text\n    type\n    __typename\n  }\n  sections {\n    ...getSectionEndIndex_section\n    __typename\n  }\n  __typename\n}\n\nfragment getParagraphSpaces_richText on RichText {\n  paragraphs {\n    layout\n    metadata {\n      originalHeight\n      originalWidth\n      id\n      __typename\n    }\n    type\n    ...paragraphExtendsImageGrid_paragraph\n    __typename\n  }\n  ...getSeriesParagraphTopSpacings_richText\n  ...getPostParagraphTopSpacings_richText\n  __typename\n}\n\nfragment paragraphExtendsImageGrid_paragraph on Paragraph {\n  layout\n  type\n  __typename\n  id\n}\n\nfragment getSeriesParagraphTopSpacings_richText on RichText {\n  paragraphs {\n    id\n    __typename\n  }\n  sections {\n    ...getSectionEndIndex_section\n    __typename\n  }\n  __typename\n}\n\nfragment getPostParagraphTopSpacings_richText on RichText {\n  paragraphs {\n    type\n    layout\n    text\n    codeBlockMetadata {\n      lang\n      mode\n      __typename\n    }\n    __typename\n  }\n  sections {\n    ...getSectionEndIndex_section\n    __typename\n  }\n  __typename\n}\n\nfragment CardByline_post on Post {\n  ...DraftStatus_post\n  ...Star_post\n  ...shouldShowPublishedInStatus_post\n  __typename\n  id\n}\n\nfragment DraftStatus_post on Post {\n  id\n  pendingCollection {\n    id\n    creator {\n      id\n      __typename\n    }\n    ...BoldCollectionName_collection\n    __typename\n  }\n  statusForCollection\n  creator {\n    id\n    __typename\n  }\n  isPublished\n  __typename\n}\n\nfragment BoldCollectionName_collection on Collection {\n  id\n  name\n  __typename\n}\n\nfragment Star_post on Post {\n  id\n  creator {\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment shouldShowPublishedInStatus_post on Post {\n  statusForCollection\n  isPublished\n  __typename\n  id\n}\n\nfragment PostFooterActionsBar_post on Post {\n  id\n  visibility\n  allowResponses\n  postResponses {\n    count\n    __typename\n  }\n  isLimitedState\n  creator {\n    id\n    __typename\n  }\n  collection {\n    id\n    __typename\n  }\n  ...MultiVote_post\n  ...PostSharePopover_post\n  ...OverflowMenuButtonWithNegativeSignal_post\n  ...PostPageBookmarkButton_post\n  __typename\n}\n\nfragment MultiVote_post on Post {\n  id\n  creator {\n    id\n    ...SusiClickable_user\n    __typename\n  }\n  isPublished\n  ...SusiClickable_post\n  collection {\n    id\n    slug\n    __typename\n  }\n  isLimitedState\n  ...MultiVoteCount_post\n  __typename\n}\n\nfragment SusiClickable_post on Post {\n  id\n  mediumUrl\n  ...SusiContainer_post\n  __typename\n}\n\nfragment SusiContainer_post on Post {\n  id\n  __typename\n}\n\nfragment MultiVoteCount_post on Post {\n  id\n  __typename\n}\n\nfragment PostSharePopover_post on Post {\n  id\n  mediumUrl\n  title\n  isPublished\n  isLocked\n  ...usePostUrl_post\n  ...FriendLink_post\n  __typename\n}\n\nfragment usePostUrl_post on Post {\n  id\n  creator {\n    ...userUrl_user\n    __typename\n    id\n  }\n  collection {\n    id\n    domain\n    slug\n    __typename\n  }\n  isSeries\n  mediumUrl\n  sequence {\n    slug\n    __typename\n  }\n  uniqueSlug\n  __typename\n}\n\nfragment FriendLink_post on Post {\n  id\n  ...SusiClickable_post\n  ...useCopyFriendLink_post\n  ...UpsellClickable_post\n  __typename\n}\n\nfragment useCopyFriendLink_post on Post {\n  ...usePostUrl_post\n  __typename\n  id\n}\n\nfragment UpsellClickable_post on Post {\n  id\n  collection {\n    id\n    __typename\n  }\n  sequence {\n    sequenceId\n    __typename\n  }\n  creator {\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment OverflowMenuButtonWithNegativeSignal_post on Post {\n  id\n  visibility\n  ...OverflowMenuWithNegativeSignal_post\n  __typename\n}\n\nfragment OverflowMenuWithNegativeSignal_post on Post {\n  id\n  creator {\n    id\n    __typename\n  }\n  collection {\n    id\n    __typename\n  }\n  ...OverflowMenuItemUndoClaps_post\n  ...AddToCatalogBase_post\n  __typename\n}\n\nfragment OverflowMenuItemUndoClaps_post on Post {\n  id\n  clapCount\n  ...ClapMutation_post\n  __typename\n}\n\nfragment ClapMutation_post on Post {\n  __typename\n  id\n  clapCount\n  ...MultiVoteCount_post\n}\n\nfragment AddToCatalogBase_post on Post {\n  id\n  isPublished\n  __typename\n}\n\nfragment PostPageBookmarkButton_post on Post {\n  ...AddToCatalogBookmarkButton_post\n  __typename\n  id\n}\n\nfragment AddToCatalogBookmarkButton_post on Post {\n  ...AddToCatalogBase_post\n  __typename\n  id\n}\n\nfragment InResponseToEntityPreview_post on Post {\n  id\n  inResponseToEntityType\n  __typename\n}\n\nfragment PostScrollTracker_post on Post {\n  id\n  collection {\n    id\n    __typename\n  }\n  sequence {\n    sequenceId\n    __typename\n  }\n  __typename\n}\n\nfragment HighDensityPreview_post on Post {\n  id\n  title\n  previewImage {\n    id\n    focusPercentX\n    focusPercentY\n    __typename\n  }\n  extendedPreviewContent(\n    truncationConfig: {previewParagraphsWordCountThreshold: 400, minimumWordLengthForTruncation: 150, truncateAtEndOfSentence: true, showFullImageCaptions: true, shortformPreviewParagraphsWordCountThreshold: 30, shortformMinimumWordLengthForTruncation: 30}\n  ) {\n    subtitle\n    __typename\n  }\n  ...HighDensityFooter_post\n  __typename\n}\n\nfragment HighDensityFooter_post on Post {\n  id\n  readingTime\n  tags {\n    ...TopicPill_tag\n    __typename\n  }\n  ...BookmarkButton_post\n  ...ExpandablePostCardOverflowButton_post\n  ...OverflowMenuButtonWithNegativeSignal_post\n  __typename\n}\n\nfragment TopicPill_tag on Tag {\n  __typename\n  id\n  displayTitle\n  normalizedTagSlug\n}\n\nfragment BookmarkButton_post on Post {\n  visibility\n  ...SusiClickable_post\n  ...AddToCatalogBookmarkButton_post\n  __typename\n  id\n}\n\nfragment ExpandablePostCardOverflowButton_post on Post {\n  creator {\n    id\n    __typename\n  }\n  ...ExpandablePostCardReaderButton_post\n  __typename\n  id\n}\n\nfragment ExpandablePostCardReaderButton_post on Post {\n  id\n  collection {\n    id\n    __typename\n  }\n  creator {\n    id\n    __typename\n  }\n  clapCount\n  ...ClapMutation_post\n  __typename\n}\n"
            }
        ]
        response = self.__session.post("https://medium.com/_/graphql", json=data)
        data = response.json()
        items = self.__get_data_from_data(data, 0, "data", "personalisedTagFeed", "items")

        return items if items is not None else []

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

    def save_articles_to_db(self, tag: str = "software-engineering", start: int = 0, size: int = 100,
                            method: str = "recommend"):
        """存储到db，存储成功返回 True"""
        article_list = self.__query_articles(tag, start, size, method)
        rows = self.__db.save_article_list(tag,article_list)
        print(f"共获取了{len(article_list)}个标题，实际存储到数据库{rows}个")
        return rows

    def query_article_list(self, limit: int, filters: dict = None, sorting: dict = None):
        """筛选推荐列表，返回[（article_id,title,tag,author_id,clap_count,url,locked,name,username,user_img,p）]

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
        # 递归调用
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
        baidu = BaiduTranslate()
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
                if type_.startswith("H") or type_ in ["OLI", "P", "ULI", "PRE"]:
                    text = value.get("text")
                    zh_text = baidu.translate(text)
                    if title is False:
                        title = True
                        article["p"].append({"text": text, "type": "TITLE", "zh_text": zh_text})
                    elif type_ == "H1":
                        article["p"].append({"text": text, "type": "H1", "zh_text": zh_text})
                    elif type_ == "H2":
                        article["p"].append({"text": text, "type": "H2", "zh_text": zh_text})
                    elif type_ == "H3":
                        article["p"].append({"text": text, "type": "H3", "zh_text": zh_text})
                    elif type_ == "H4":
                        article["p"].append({"text": text, "type": "H4", "zh_text": zh_text})
                    elif type_ == "H5":
                        article["p"].append({"text": text, "type": "H5", "zh_text": zh_text})
                    elif type_ == 'OLI':
                        article["p"].append({"text": text, "type": 'OLI', "zh_text": zh_text})
                    elif type_ == 'ULI':
                        article["p"].append({"text": text, "type": 'ULI', "zh_text": zh_text})
                    elif type_ == "P":
                        article["p"].append({"text": text, "type": "P", "zh_text": zh_text})
                    elif type_ == "PRE":
                        article["p"].append({"text": text, "type": "PRE", "zh_text": zh_text})
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

    def set_cookie(self, cookie):
        self.__session = self.__make_session()
        if cookie is not None:
            print("---设置了cookie-----",cookie)
            self.__session.headers.setdefault("Cookie", cookie)


medium = Medium()
