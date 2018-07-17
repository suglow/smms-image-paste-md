const fs = require('fs')
const request = require('request')
const path = require('path')

const formatParam = (file, mdFileName) => {
    const dt = new Date()
    const y = dt.getFullYear()
    const m = dt.getMonth() + 1
    const d = dt.getDate()
    const h = dt.getHours()
    const mm = dt.getMinutes()
    const s = dt.getSeconds()

    const date = `${y}${m}${d}`
    var ext = path.extname(file)

    return {
        date,
        dateTime: `${date}${h}${mm}${s}`,
        fileName: path.basename(file, ext),
        ext,
        mdFileName
    }
}

const formatString = (tplString, data) => {
    const keys = Object.keys(data)
    const values = keys.map(k => data[k])

    return new Function(keys.join(','), 'return `' + tplString + '`').apply(null, values)
}

module.exports = (config, imagefile, mdFile) => {
    let localFile = imagefile
    let baseName = path.basename(localFile)
    // 预设参数值
    //上传到七牛后保存的文件名
    let options = {
        uri: 'https://sm.ms/api/upload',
        headers:{ 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36' },
        formData: { smfile: fs.createReadStream(localFile) }
    }

    return new Promise((resolve, reject) => {

        request.post(options,(err, response, body)=>{
            if(err){
                console.log(err)
                reject(err)
            } else  {
                console.log(body)
                let bodyJson = JSON.parse(body)
                if(bodyJson.code == 'error'){
                    console.log(bodyJson.code)
                    reject(bodyJson.code)
                }else{
                    resolve({
                        name: bodyJson.data.filename,
                        url: bodyJson.data.url,
                        image: baseName
                    })
                }
            }
        })

    })

}


