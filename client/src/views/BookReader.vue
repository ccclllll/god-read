<template>


    <div class="page">
        <nut-navbar class="header-nav" @on-click-back="back" :leftShow="true" :rightShow="true">
            <a slot="back-icon">返回</a>
            <div slot="more-icon" class="header-right" @click="home">
                <span>首页</span>
            </div>
            {{title}}
        </nut-navbar>
        <div class="content" ref="content">


            <div class="book-content" v-html="detailHtml" ref="content">

            </div>

            <div class="cover-options">
                <nut-row type="flex" justify="space-between" align="center">
                    <nut-col :span="8">
                        <nut-button @click="pre" type="light" style="width: 100%" small>
                            上一章
                        </nut-button>
                    </nut-col>
                    <nut-col :span="8" class="cover-detail">
                        <nut-button type="light" style="width: 100%" @click="back" small>
                            目录
                        </nut-button>
                    </nut-col>
                    <nut-col :span="8" class="cover-detail">
                        <nut-button type="light" style="width: 100%" @click="next" small>
                            下一章
                        </nut-button>
                    </nut-col>
                </nut-row>

            </div>
        </div>



    </div>
</template>

<script>
    export default {
        data() {
            return {
                book: {},
                detail: {},
                detailHtml: '',
                chapterDetailUrl: '',
                index: 0,
                chapters: null,
                title: ''
            }
        },
        mounted() {
            console.log(this.$route)

            this.chapterDetailUrl = this.$route.query.chapterUrl
            this.index = parseInt(this.$route.query.index)
            this.title = this.$route.query.title
            this.getChapterDetail()
            this.getCover()
        },
        methods: {
            back() {
                this.$router.push({
                    path: '/cover',
                    name: 'Cover',
                    query: {
                        bookCoverUrl: this.$route.query.bookCoverUrl,
                        bookName: this.$route.query.bookname,
                        newChapter: this.chapters[this.chapters.length - 1] && this.chapters[this.chapters
                            .length - 1].name
                    },
                })
            },

            home() {
                this.$router.push({
                    path: '/'

                })
            },


            pre() {
                let preIndex = this.index - 1
                if (this.chapters && preIndex >= 0) {
                    this.goToNewChapter(preIndex)
                }
            },

            goToNewChapter(newIndex) {
                // document.body.scrollTop = document.documentElement.scrollTop = 0;
                // console.log(this.$refs['content'])
                this.$refs['content'].scrollTop = 0
                let {
                    chapterUrl,
                    bookCoverUrl,
                    bookname
                } = this.$route.query
                history.pushState("", this.chapters[newIndex].name,
                    `/bookreader?chapterUrl=${chapterUrl}&bookname=${bookname}&title=${this.chapters[newIndex].name}&index=${newIndex}&bookCoverUrl=${bookCoverUrl}`
                )
                this.title = this.chapters[newIndex].name
                this.index = newIndex
                this.chapterDetailUrl = this.chapters[newIndex].url
                this.getChapterDetail()
            },

            next() {
                let nextIndex = this.index + 1
                if (this.chapters && nextIndex < this.chapters.length) {
                    this.goToNewChapter(nextIndex)
                }
            },

            getCover() {
                this.$service.storyService.chapters({
                    coverUrl: this.$route.query.bookCoverUrl,
                    source: 'xbiqu'
                }).then(res => {
                    this.chapters = res.data.data
                    //this.bookName = res.data.data.bookName
                })
            },

            getChapterDetail() {
                this.$service.storyService.singleDetail({
                    chapterDetailUrl: this.chapterDetailUrl,
                    source: 'xbiqu'
                }).then(res => {
                    console.log(res)
                    this.detail = res.data.data
                    if (res.data.data.content) {
                        let contentList = res.data.data.content.split('\r\n')
                        let html = ''
                        contentList.forEach(content => {
                            html += content + '<br/>'
                        })
                        this.detailHtml = html
                    }
                })
            }
        },
    }
</script>

<style scoped>
    .header-right {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .content {
        overflow-y: auto;
        /* display: flex; */
        /* flex-direction: column; */
        flex: 1;
    }

    .book-content {
        /* flex: 1; */
        overflow-y: auto;
    }

    .cover {
        overflow-y: scroll;
    }


    .cover-options {

        bottom: 0;
        height: 35px;
        width: 100%;
    }
</style>