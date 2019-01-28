let host = process.env.API_HOST


export const UPLOAD_IMG_URL = host + "/admin/img_upload";
export const PAY_TYPE = {
    0: '微信支付'
}
export const ORDER_STATUS = {
    0: '待付款',
    1: '待发货',
    2: '待收货',
    3: '已完成',
    4: '申请退款',
    5: '正在退款',
    6: '已退款',
    7: '已关闭',
    8: '已取消',
}
export const AppointStatus = {
    0: '待处理',
    1: '待处理',
    2: '已处理',
    3: '已取消',
    4: '已搁置'
}

export const RefundChoice = {
    1: "拍错货/产品规格选错了/数量填错",
    2: "联系信息填错/地址填错",
    3: "发错货/发漏货",
    4: "产品发生损坏/有质量问题",
    5: "不喜欢/不想要"
}

export const AppointType = {
    0: '线下体验',
    1: '以旧换新'
}