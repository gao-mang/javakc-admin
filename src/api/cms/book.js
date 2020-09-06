import request from '@/utils/request'

const api_name = '/cms/book'

export default {
  // ## 1、动态条件查询带分页
  findPageBook(pageNo, pageSize, bookQuery) {
    return request({
      url: `${api_name}/${pageNo}/${pageSize}`,
      method: 'post',
      data: bookQuery
    })
  },
  // 2、添加书籍
  saveBook(book) {
    return request({
      url: `${api_name}/saveBook`,
      method: 'post',
      data: book
    })
  },
  // ## 3、 回显
  getBookById(bookId) { // 回显要修改的数据
    return request({
      url: `${api_name}/${bookId}`,
      method: 'get'
    })
  },
  updateBook(book) { // 4、修改
    console.log(book)
    return request({
      url: `${api_name}/updateBook`,
      method: 'put',
      data: book
    })
  },
  deleteByBookId(bookId) { // 5、 Api 删除
    return request({
      url: `${api_name}/deleteById/${bookId}`,
      method: 'delete'
    })
  },
  // 6、书籍的上架或下架功能实现
  upOrDownBook(bookId, status) {
    return request({
      url: `${api_name}/${bookId}/${status}`,
      method: 'put'
    })
  }
}
