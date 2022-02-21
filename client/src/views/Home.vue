<template>
  <div class="page">

    <nut-navbar class="header-nav" @on-click-back="back" :leftShow="true" :rightShow="true">
      <!-- <a slot="back-icon">返回</a> -->
      <div slot="more-icon" class="header-right" @click="toSearch">
        <span>搜索</span>
      </div>
      <div>首页</div>
    </nut-navbar>

    <div class="rmtj">

      <div class="tt item">
        热门推荐
      </div>

      <div class="bk-list">

      </div>


    </div>

    <!-- <div class="search">

      <nut-searchbar v-model="value" disabled></nut-searchbar>
    </div>
    <div class="result">
      <nut-cell v-for="(book,index) in result" :title="book.bookName" :sub-title="'最新章节' + book.newChapter"
        :desc="book.author" @click-cell="toCover(book)"></nut-cell>
    </div> -->

  </div>
</template>

<script>
  const debounce = (func, wait) => {
    let timeout = '';
    return (v) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        func(v);
      }, wait);
    }
  };


  export default {
    name: 'Home',
    components: {

    },

    watch: {
      value: {
        handler(val) {
          this.EditEMailValid({
            vm: this,
            val

          });
        }
      }
    },

    mouted() {

    },


    data() {
      return {
        value: '',
        result: []
      }
    },
    methods: {

      toSearch() {
        this.$router.push({
          path: '/search',
          name: 'Search'
        })
      },

      toCover(book) {
        console.log(book)
        this.$router.push({
          path: '/cover',
          name: 'Cover',
          query: {
            bookCoverUrl: book.bookCoverUrl,
            bookName: book.bookName,
            newChapter: book.newChapter
          },
        })
      },

      EditEMailValid: debounce(({
        vm,
        val
      }) => {
        vm.search()
      }, 500),


      search() {

        this.$service.storyService.search({
          source: 'xbiqu',
          searchKey: this.value
        }).then(res => {
          console.log(res)
          this.result = res.data.data
          console.log(this.result)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .booklist {
    //display: flex;

    &>div {
      display: flex;
      width: 100%;
      flex: 1
    }
  }


  .mint-search-list {
    padding-top: 55px !important
  }

  .search {
    padding: 5px;
    background-color: #1ABC9C !important;
  }

  .result {
    flex: 1;
    overflow-y: auto;
  }

  // .home-nav {
  //   background-color: #1ABC9C !important;
  //   // padding: 20px 0;

  //   .search {}
  // }

  .rmtj {
    border: 1px solid #ddd;
    border-radius: 3px;
    background-color: #fff;
    margin: 10px;
  }

  .item {
    border-color: #E2E2E2;
  }

  .tt {
    border-bottom-width: 1px;
    border-bottom-style: solid;
    padding: 5px 10px;
    border-color: #CCC
  }

  .bk-list {
    min-height: 100px;
  }

  .bk {}
</style>