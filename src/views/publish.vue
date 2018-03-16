<template>
<div>
    <div class="e-publish">
         <Form ref="formPublish" :model="formPublish" :rules="ruleValidate" :label-width="80">
            <FormItem label="标题" prop="name">
                <Input v-model="formPublish.name" placeholder="请输入商品名称..."/>
            </FormItem>
            <FormItem label="摘要" prop="description">
                <Input v-model="formPublish.description" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入商品摘要..."></Input>
            </FormItem>
            <!-- 图片 -->
            <FormItem label="商品图片" prop="picture">
                <RadioGroup v-model="uploadType" @on-change="changeUploadType">
                    <Radio label="file">文件</Radio>
                    <Radio label="url">链接</Radio>
                </RadioGroup>
                <!-- 为了让picture总能被validate到 -->
                <Upload v-show="this.uploadType === 'file'" ref="upload" :before-upload="handleUpload"
                    v-model="formPublish.picture"
                    accept="image/*"
                    action="/api/goods_pic">
                    <Button v-if="this.uploadType === 'file'" type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
                </Upload>
                <FormItem v-if="this.uploadType === 'file'">
                    <div>
                        <div v-if="formPublish.picture !== null">
                            待上传: {{ formPublish.picture.name }} 
                        </div>
                    </div>
                </FormItem>
                <FormItem v-if="this.uploadType === 'url'">
                    <div>
                        <Row>
                            <Col span="18">
                                <Input v-model="formPublish.picUrl" label="图片链接" @on-change="editPicUrl"/>
                            </Col>
                            <Col span="4" style="margin-left: 12px">
                                <Button v-if="!picLoadSuccess && !picLoadError" type="primary" @click.prevent="validateUrl" :loading="loadingPic && !picLoadSuccess && !picLoadError">校验图片</Button>
                                <Button v-if="picLoadError" type="warning" @click.prevent="editPicUrl">图片加载失败</Button>
                                <Button v-if="picLoadSuccess" type="success" @click.prevent="editPicUrl">图片加载成功</Button>
                            </Col>
                        </Row>
                        <Row v-if="loadingPic">
                            <EImage ref="eimg" :picUrl="'/api/pic/proxy?picUrl=' + formPublish.picUrl" @on-pic-loaded="picLoaded" @on-pic-error="picError"/>
                        </Row>
                    </div>
                </FormItem>
            </FormItem>
            <!-- 正文 -->
            <FormItem label="正文" prop="detail">
                <Input v-model="formPublish.detail" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入商品详情..."/>
            </FormItem>
            <!-- 价格 -->
            <FormItem label="价格" prop="price">
                <Input number v-model="formPublish.price" placeholder="请输入商品定价..."/>
            </FormItem>
            <FormItem>
                <Button v-if="this.$route.params.goodsId != undefined" @click="handleSave">保存</Button>
                <Button v-else @click="handlePublish">发布</Button>
            </FormItem>
         </Form>
    </div>
</div>
</template>
<style scoped>
.e-publish {
  width: 70%;
  margin: auto;
  margin-top: 5%;
}
</style>

<script>
import Vue from "vue";
import EImage from "../common/e-img.vue";
export default {
  components: {
      EImage
  },
  data() {
    return {
      id: this.$route.params.goodsId,
      picLoadError: false,
      picLoadSuccess: false,
      loadingPic: false,
      uploadType: 'file',
      maxPicSize: 1024,
      formPublish: {
        name: '',
        description: '',
        detail: '',
        price: 0,
        picture: null,
        picUrl: ''
      },
      ruleValidate: {
        name: [
            { required: true, message: '请输入商品名', trigger: 'blur' },
            { type: 'string', min: 2, max: 80, message: '商品名的长度在2～80个字符', trigger: 'blur' },
        ],
        description: [
            { required: true, message: '请输入商品摘要', trigger: 'blur' },
            { type: 'string', min: 2, max: 140, message: '商品摘要应在2～140个字符', trigger: 'blur' }
        ],
        picture: [
            { 
                required: true,
                validator(rule, value, callback) {
                    // debugger
                    if (value === null) {
                        callback([new Error("请上传照片")]);
                    } else if (value.size > 1024000) {
                        callback([new Error("照片大小为" + value.size / 1000000+ "MB, 超过1MB")]);
                    } else {
                        // 不加这个会导致进入不了validate()的callback
                        callback()
                    }
                },
                trigger: 'blur'
            }
        ],
        detail: [
            { required: true, message: '请输入商品详情', trigger: 'blur'},
            { type: 'string', min: 2, max: 1000, message: '商品正文应在2～1000个字符', trigger: 'blur' }
        ],
        price: [
            { required: true, type: 'number', min: 0.01, message: '请输入正确的商品价格', trigger: 'blur' },
        ]
      },
    };
  },
  methods: {
    editPicUrl() {
        this.formPublish.picture = null
        this.picLoadSuccess = false
        this.picLoadError = false
        this.loadingPic = false
    },
    validateUrl() {
        this.loadingPic = true
    },
    picLoaded() {
        this.picLoadSuccess = true
        this.picLoadError = false
        this.setPic()
    },
    picError() {
        this.picLoadSuccess = false
        this.picLoadError = true
    },
    setPic() {
        // 直接从前端标签中拿到blob，比较曲折
        // 这里的imgEl在创建canvas的时候受限制于parent元素的大小，巨坑！
        // let imgEl = this.$refs.eimg.$refs.innerImg
        // let image = new Image()
        // image.src = '/api/pic_proxy?picUrl=' + this.formPublish.picUrl
        // var url = image.src

        // 想要获取文件的大小，但是safari没有performance.getEntriesByName这个api，放弃这个方案
        // var iTime = performance.getEntriesByName(url)[0];
        // console.log(iTime.transferSize); //or encodedBodySize, decodedBodySize
        // let dataUrl = this.$util.getBase64Image(image)
        // 从urldata生成的blob的文件大小与原img大小不同
        // let blob = this.$util.dataURItoBlob('data:image/png;base64,' + base64Data)
        // this.formPublish.picture = blob
        this.$http.get('/pic/proxy?picUrl=' + this.formPublish.picUrl,
        {
            responseType: 'blob'
        })
        .then(response => {
            // https://github.com/axios/axios/issues/448
            // 直接从response中生成大小相同的blob,可喜可贺!可喜可贺！
            // 避免通过canvas先转dataURL再转blob导致文件大小不一致以及PNG的base64无法压缩的问题！
            let blob = response.data
            this.formPublish.picture = blob
            console.log(blob)
        })
    },
    handleUpload(file) {
        this.formPublish.picture = file
        return false
    },
    getFormData() {
        let picture = this.formPublish.picture
        var formData = new FormData()
        if (this.$route.params.goodsId != undefined) {
            formData.append("id", this.$route.params.goodsId)
        }
        // formData.append("Goods", this.formPublish)
        formData.append("name", this.formPublish.name)
        formData.append("description", this.formPublish.description)
        formData.append("detail", this.formPublish.detail)
        formData.append("price", this.formPublish.price)
        formData.append("file", picture)
        return formData
    },
    handlePublish() {
        this.$refs['formPublish'].validate(valid => {
            // debugger
            if (valid) {
                this.$Modal.confirm({
                    title: "确认发布商品？",
                    content: "",
                    onOk: () => {
                        this.$http.post('/publish/new', this.getFormData(), {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            }
                        }).then(res => {
                            this.$router.push({
                                name: "goods",
                                params: {
                                    goodsId: res.data.data.id
                                }
                            });
                        })
                    },
                    onCancel: () => {}
                });
                
            }
        });
    },
    handleSave() {
        this.$refs['formPublish'].validate(valid => {
            // debugger
            if (valid) {
                this.$Modal.confirm({
                    title: "确认修改商品信息？",
                    content: "",
                    onOk: () => {
                        this.$http.post('/publish/save' , this.getFormData()).then(res => {
                            this.$router.push({
                                name: "goods",
                                params: {
                                    goodsId: this.$route.params.goodsId
                                }
                            });
                        })
                    },
                    onCancel: () => {}
                });
            }
        });
    },
    changeUploadType(item) {
        if (item === 'url') {
            this.formPublish.picture = null;
        } else if (item === 'file') {
            this.formPublish.picUrl = '';
        }
    },
    initData() {
        this.formPublish.name = '';
        this.formPublish.description = '';
        this.formPublish.price = 0;
        this.formPublish.detail = '';
        this.formPublish.picUrl = '';
        this.uploadType = 'file';
        this.loadingPic = false;
    },
    fetchData() {
        if (this.$route.params.goodsId != undefined) {
            this.$http.get("/goods/"+this.$route.params.goodsId)
            .then(response => {
                let goods = response.data.data
                this.formPublish.name = goods.name;
                this.formPublish.description = goods.description;
                this.formPublish.price = goods.price;
                this.formPublish.detail = goods.detail;
                this.formPublish.picUrl = (goods.picUrl.startsWith('http') ? '' : (location.protocol + "//" + location.host)) + goods.picUrl;
                this.uploadType = 'url';
                this.loadingPic = true;
            });
        } else {
            this.initData()
        }
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'fetchData'
  },
  mounted() {
    if (!this.$isLogin()) {
        this.$router.push({
            name: 'home'
        });
    }
    this.fetchData()
    console.log('publish mounted');
  }
};
</script>