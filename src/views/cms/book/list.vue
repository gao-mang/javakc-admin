<template>
  <div id="app-container">
    <!--  2、查询表单 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="bookQuery.title" placeholder="书名" />
      </el-form-item>
      <el-form-item label="授权开始时间">
        <el-date-picker
          v-model="bookQuery.beginDate"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="bookQuery.endDate"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" @click="getPageBookList()">查询</el-button>
      <el-button type="primary" @click="resetData()">清空</el-button>
      <router-link :to="'/cms/book/save'">
        <el-button type="primary">添加书籍</el-button>
      </router-link>
    </el-form>
    <!-- 1、列表渲染 el -->
    <el-table :data="bookList" border fit highlight-current-row>
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          {{ (pageNo - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="书籍ID" width="80" />
      <el-table-column prop="title" label="书名"/>
      <el-table-column prop="author" label="作者" />
      <el-table-column prop="firstSort" label="一级分类" />
      <el-table-column prop="secondSort" label="二级分类" />
      <el-table-column label="连载">
        <template slot-scope="scope">
          {{ scope.row.serialize === 1 ? '连载中' : '完结'}}
        </template>
      </el-table-column>
      <el-table-column prop="wordNumber" label="字数" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? '上线' : '未上线'}}
        </template>
      </el-table-column>
      <el-table-column label="全本收费">
        <template slot-scope="scope">
          {{ scope.row.free === 1 ? '收费' : '免费' }}
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="授权开始时间" />
      <el-table-column prop="endTime" label="授权结束时间" />
      <el-table-column label="原创">
        <template slot-scope="scope">
          {{ scope.row.original === 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="授权状态">
        <template slot-scope="scope">
          {{ currentTime > scope.row.endTime ? '过期' : '有效' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteBook(scope.row.id, scope.row.status)">删除</el-button>
          <router-link :to="'/cms/book/update/'+scope.row.id">
            <el-button type="primary" size="mini" >修改</el-button>
          </router-link>
          <el-button v-if="scope.row.status === 0" type="danger" size="mini" icon="el-icon-delete" @click="upOrDownBook(scope.row.id, 1)">上架书籍</el-button>
          <el-button v-else type="danger" size="mini" @click="upOrDownBook(scope.row.id, 0)">下架书籍</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 3、分页组件   -->
    <el-pagination
      :page-size="pageSize"
      :current-page="pageNo"
      :total="total"
      :pager-count="11"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getPageBookList">
    </el-pagination>
  </div>
</template>

<script>
import book from '@/api/cms/book'

export default {
  // 编写data
  data() {
    // 定义变量和初始值
    return {
      // 数据列表
      bookList: [],
      //  查询条件封装对象
      bookQuery: {},
      //  记录总数
      total: 0,
      // 页码
      pageNo: 1,
      // 每页显示记录数
      pageSize: 6,
      // 当前时间
      currentTime: ''

    }
  },
  created() {
    //   在页面渲染之前,一般先调用methods定义的方法
    this.getPageBookList()
  },
  methods: { // ## 创建具体的方法,调用 book.js 定义的方法
    getPageBookList(pageNo = 1) { // 调用api 获取数据
      this.pageNo = pageNo
      book.findPageBook(this.pageNo, this.pageSize, this.bookQuery)
        .then(response => {
          this.bookList = response.data.items
          this.total = response.data.total
          this.currentTime = this.format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        })
    },
    format(date, fmt) { // ## 格式化日期
      let o = {
        'M+': date.getMonth() + 1, // ## 月份
        'd+': date.getDate(), // ## 日
        'H+': date.getHours(), // ## 小时
        'm+': date.getMinutes(), // ## 分
        's+': date.getSeconds(), // ## 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // ## 季度
        'S': date.getMilliseconds() // ## 毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (let k in o)
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      return fmt
    },
    resetData() { //  清空方法
      // 清空所有值
      this.bookQuery = {}
      this.getPageBookList()
    },
    // 删除方法
    deleteBook(bookId, status) {
      if (status === 1) {
        this.$message({
          type: 'error',
          message: '上线书籍不能删除'
        })
        return
      }
      this.$confirm('此操作将永久删除该书籍, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        book.deleteByBookId(bookId)
          .then(response => {
            this.$message({
              type: `success`,
              message: '状态修改成功'
            })
            this.getPageBookList()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    upOrDownBook(bookId, status) {
      this.$confirm('是否更改书籍状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用上架下架的接口方法
        book.upOrDownBook(bookId, status)
          .then(response => {
            this.$message({
              type: `success`,
              message: '操作成功'
            })
            this.getPageBookList()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
