<template>
    <div class="page">
        <nut-navbar class="header-nav" @on-click-back="back" :leftShow="true" :rightShow="true">
            <a slot="back-icon">返回</a>
            <div slot="more-icon" class="header-right">
                <span>搜索</span>
            </div>
            {{$route.query.bookName}}
        </nut-navbar>


        <div class="cover-top">
            <nut-row type="flex">

                <nut-col :span="8">
                    <div class="coverimg">
                        <img :src="cover.bookImg" alt="" style="height: 120px">
                    </div>

                </nut-col>
                <nut-col :span="16" class="cover-detail">
                    <div>{{$route.query.bookName}}</div>
                    <div>
                        <span>{{cover.author}}</span>
                    </div>
                    <div>
                        <span>最 新：</span><span>{{$route.query.newChapter}}</span>
                    </div>
                </nut-col>
            </nut-row>

        </div>


        <div class="cover-options">
            <nut-row type="flex" justify="space-between">
                <nut-col :span="10">
                    <nut-button @click="toReader" style="width: 100%">
                        开始阅读
                    </nut-button>
                </nut-col>
                <nut-col :span="10" class="cover-detail">
                    <nut-button style="width: 100%" @click="download">
                        下载txt
                    </nut-button>
                </nut-col>
            </nut-row>

        </div>




        <div class="cover">
            <nut-cell v-for="(chapter,index) in cover.chapters" :is-link="true"
                :to="`/bookreader?chapterUrl=${chapter.url}&bookname=${$route.query.bookName}&title=${chapter.name}&index=${index}&bookCoverUrl=${$route.query.bookCoverUrl}`"
                @click="toReader" :show-icon="true" :title="chapter.name">
            </nut-cell>
        </div>
        <div class="chapters"></div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                book: {},
                cover: {
                    chapters: []
                }
            }
        },
        mounted() {
            console.log(this.$route)
            //this.book = this.$route.params.book || {}
            this.getCover()
        },
        methods: {


            download() {

                this.$dialog({
                    title: "小说内容生成中",
                    content: "生成完毕将提示下载",
                    onOkBtn(event) {

                        this.close(); //关闭对话框
                    },
                    onCancelBtn(event) {

                        this.close(); //关闭对话框
                    },
                });

               // this.$forceUpdate()
                this.$service.storyService.download({
                    storyName: this.$route.query.bookName,
                    source: 'xbiqu',
                    chapterUrl: this.$route.query.bookCoverUrl
                }).then(res => {
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(new Blob([res.data]));
                    link.target = "_blank";
                    link.download = this.$route.query.bookName + '.txt';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    this.$forceUpdate()
                }).catch(() => {

                    this.$forceUpdate()
                })
            },

            back() {
                this.$router.push({
                    path: '/',
                    name: 'Home'
                })
            },
            getCover() {
                this.$service.storyService.getCover({
                    coverUrl: this.$route.query.bookCoverUrl,
                    source: 'xbiqu'
                }).then(res => {
                    console.log(res)
                    this.cover = res.data.data
                })
            },
            //chapterUrl=${chapter.url}&bookname=${$route.query.bookName}&title=${chapter.name}&index=${index}&bookCoverUrl=${$route.query.bookCoverUrl}`" @click="toReader"
            toReader(chapter) {
                this.$router.push({
                    path: '/bookreader',
                    name: 'BookReader',
                    query: {
                        bookCoverUrl: this.$route.query.bookCoverUrl,
                        title: chapter.name,
                        index: 0,
                        title: this.cover.chapters[0].name,
                        bookname: this.$route.query.bookName,
                        chapterUrl: this.cover.chapters[0].url
                    },
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

    .cover-top {
        padding: 8px;
        margin-bottom: 10px;
    }

    .cover {
        overflow-y: scroll;
    }

    .coverimg {
        height: 100%;
        width: 100%;
        display: flex;
        /* justify-content: center;
        align-items: center; */
    }

    .coverimg img {
        width: 80%;
    }

    .cover-detail>div {
        margin-top: 10px
    }

    .cover-options {
        padding: 10px;
    }
</style>