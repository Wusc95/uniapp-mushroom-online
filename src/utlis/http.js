// 封装网络请求
const BASEURL = 'http://localhost:3000/api/' // 本地地址

// const BASEURL = 'http://183.237.67.218:3003/api/' // 线上地址
// const BASEURL = 'http://huangjiangjun.top:3000/api/' // 线上地址
export const instance = ({url,data,header={},method="GET",isLogin=false,tips='数据加载中...'})=>{
    // 返回一个promise对象
    return new Promise((resolve,reject)=>{
        // 处理请求头
        if(!isLogin){
            const token = uni.getStorageSync('my_token');
            if(token){
                header.Authorization =token;
            }
        }
        uni.showLoading({
            title: tips
        });
        uni.request({
            url: `${BASEURL}${url}`, 
            method:method,
            data: data,
            header: header,
            success: (res) => {
                resolve(res)
            },
            fail: (err)=>{
                reject(err)
            },
            complete: ()=>{
                uni.hideLoading();
            }
        });
    })
}