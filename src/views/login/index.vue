<template>
  <div class="login_container" ref="box">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" :model="LoginInfo" :rules="rules" ref="loginForm">
          <h1>Hello</h1>
          <h2>欢迎来到东理甄选</h2>
          <el-form-item prop="username" class="login_input">
            <el-input :prefix-icon="User" v-model="LoginInfo.username"></el-input>
          </el-form-item>
          <el-form-item prop="password" class="login_input">
            <el-input type="password" :prefix-icon="Lock" show-password v-model="LoginInfo.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary" size="default" class="login_btn" @click="login">登录</el-button>
          </el-form-item>
          <div class="bottom"></div>
        </el-form>
       
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User,Lock } from '@element-plus/icons-vue';
import {onMounted, reactive,ref} from 'vue'
import {useRouter,useRoute} from 'vue-router'
// 引入Element-plus的ElNotification组件进行消息提示
// @ts-ignore
import { ElNotification } from 'element-plus';
// @ts-ignore
import type {FormRules,FormInstance} from 'element-plus'
import useUserStore from '@/store/modules/user.ts'
// @ts-ignore
import * as THREE from 'three'
// @ts-ignore
import { BufferAttribute, MeshBasicMaterial, PointsMaterial, SphereGeometry } from 'three'

// 1.创建场景
let scene = new THREE.Scene()

// 2.创建相机
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(20, 4, 11)
scene.add(camera)


// 创建一个bufferGeometry
let geometry = new THREE.BufferGeometry()
// 创建一个顶点位置数组数组
let count = 2500 // 顶点数量
let vertexPositions = new Float32Array(count*3) // 创建一个长度为count*3的Float32Array数组
let [minx,maxx,minz,maxz] = [-100,100,-100,100]
let [minAngX,maxAngX,minAngZ,maxAngZ] = [0,Math.PI/4,0,Math.PI/2]
let [miny,maxy,minSize,maxSize]= [-2,6,0.3,2]
let i=0
for(let z=minz;z<maxz;z+=4){
  for(let x=minx;x<maxx;x+=4){
    vertexPositions[i]=x;
    vertexPositions[i+1]=0;
    vertexPositions[i+2]=z;
    i+=3
  }
}
// 创建一个顶点颜色数组,注意:如果想要使用顶点颜色数组所设置的颜色就要在材质对象中设置vertexColors属性为true,并且不能再在材质中设置颜色
let vertexColors = new Float32Array(count*3)
for(let i=0;i<count*3;i+=3){
  vertexColors[i] = 0.8 // 颜色范围为0-1而不是0-255
  vertexColors[i+1] = 0.5
  vertexColors[i+2] = 0.3
}
// 创建一个顶点尺寸数组
let vertexSize = new Float32Array(count)
for(let i=0;i<count;i++){
  vertexSize[i]=2
}

// 设置几何体属性
geometry.setAttribute('position',new BufferAttribute(vertexPositions,3)) // 设置顶点位置
geometry.setAttribute('size',new BufferAttribute(vertexSize,1))


// 创建Points对象的材质
// 创建自定义的ShaderMaterial
const vertexShader = `
  attribute float size;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  precision mediump float;
  void main() {
    float dist = distance(gl_PointCoord,vec2(0.5,0.5));
    if(dist<0.5){
      gl_FragColor = vec4(0.85,0.85,0.85,0.8);
    }else{
      discard;// 丢弃,即不对这个图元进行渲染
    }
  }
`;

const pointMaterial = new THREE.ShaderMaterial({
  uniforms: {},
  vertexShader,
  fragmentShader,
  transparent: true
});

// 设置PointsMaterial对象的属性
// pointMaterial.size = 5 // 用于设置物体中顶点的大小默认值为1
pointMaterial.sizeAttenuation = true // 设置点的大小是否会随相机的深度而衰减(仅限透视相机),默认为true
pointMaterial.transparent = true // 设置材质可以变透明
pointMaterial.depthWrite = false // 设置渲染材质时是否对深度缓存区的材质有影响,简单来说就是是否会影响它后面物体的渲染,默认为true
// pointMaterial.blending = THREE.AdditiveBlending // 设置在使用此材质时要使用何种混合.默认值为NormalBlending。具体还有哪些值可查看文档
pointMaterial.vertexColors = true // 使用顶点颜色数组中设置好的顶点颜色
console.log(pointMaterial);
// 根据几何体和材质创建物体
let points = new THREE.Points(geometry,pointMaterial)
scene.add(points)



let renderer = new THREE.WebGLRenderer({alpha:true})
renderer.shadowMap.enabled = true// 开启渲染器的阴影计算
// renderer.physicallyCorrectLights = true // 是否使用物理上正确的光照模式。 默认是false。将这个属性设置为true就可以设置灯光的decay属性
renderer.setSize(window.innerWidth, window.innerHeight)

let box = ref<HTMLDivElement>()
onMounted(()=>{
  renderer.domElement.id = 'three3d'
  box.value?.appendChild(renderer.domElement)
})


// 定义获取比例尺函数的函数
function ScaleLinear(o1:number,min:number,o2:number,max:number){// 参数1:原坐标的最小值;2:要映射到的坐标的最小值;3:原坐标的最大值;4:要映射到的坐标的最大值
  let k = (max-min)/(o2-o1)
  let b = max-k*o2
  return function(x:number){
    return k*x+b
  }
}

let scaleX = ScaleLinear(minx,minAngX,maxx,maxAngX)
let scaleZ = ScaleLinear(minz,minAngZ,maxz,maxAngZ)
let scaleSize = ScaleLinear(miny,minSize,maxy,maxSize)


// 建立正弦型函数Asin(ωx+φ)
function SinFn(A:number,Omega:number,phi:number){
  return function(x:number){
    return A*Math.sin(Omega*x+phi)
  }
}
let h = false
//  建立实现波浪的函数
function updateVertexs(offset=0,Omega=2,n=4){
  for(let i=0,j=0;i<vertexPositions.length;i+=3,j++){
    let [posx,posz] = [vertexPositions[i],vertexPositions[i+2]]
    let angZ = scaleZ(posz)
    let b = Math.sin(angZ) * n + 2
    let phi = scaleX(posx)*5+offset
    let y = SinFn(b,Omega,phi)(angZ)

    vertexSize[j]=scaleSize(y)
    vertexPositions[i+1]=SinFn(b,Omega,phi)(angZ)
  }
}


window.addEventListener('mousemove',(e)=>{
  camera.position.y = 4+(innerHeight/3-e.clientY)/100
  if(e.movementX>=1){
    points.rotateY(0.01)
  }else if(e.movementX<=-1){
    points.rotateY(-0.01)
  }
  
})

// 监听窗口大小变化,随之更新摄像机和渲染器
window.addEventListener("resize", () => {
  // 更新摄像机长宽比
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新摄像机投影矩阵
  camera.updateProjectionMatrix()

  // 更新渲染器创建的canvas的大小
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 更新渲染器像素比
  renderer.setPixelRatio(window.devicePixelRatio)
})
console.log(points.geometry.attributes);
// 创建一个定时器
let clock = new THREE.Clock()
let offset = 0
let n=1
let con = true
console.log(Number.EPSILON);
function render() {
  let time = clock.getElapsedTime()
  
  if(con){
    n+=0.01
    offset+=0.04
    if(n>=3)con=false
  }else{
    offset+=0.03
    n-=0.01
    if(n<=1)con=true
  }

  updateVertexs(offset,10,n)
  points.geometry.attributes.position.needsUpdate = true
  points.geometry.attributes.size.needsUpdate = true
  // controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()



document.onselectstart = ()=>false

let loginForm = ref<FormInstance>()
let LoginInfo = reactive({username:'admin',password:'111111'})// 绑定用户名与密码
let loading = ref(false)// 设置是否正在登录 false为没有在登录,true为正在登录. 这个变量与el-button的loading属性一起使用,可以实现按钮的加载动画
/*
  规则对象属性:
    required:代表这个字段是必填的,
    min:文本长度至少为多少位
    max:文本长度最多为多少位
    message:错误的提示信息
    trigger:触发的方式 blur代表失去焦点时触发,change代表输入框内容改变时触发
    validator:自定义校验规则 值是一个回调函数
    let rules = {
      username:[
        { required:true,message:'用户名不能为空',trigger:'blur'},
        { required:true,min:4,max:10,message:'用户名必须是4-10位',trigger:'change' }
      ],
      password:[
        { required:true,min:6,max:15,message:'密码必须是6-15位',trigger:'change' }
      ]
    }
*/
// @ts-ignore
const validatorUserName = (rule:any,value:any,callback:any)=>{
  // rule:校验规则对象
  // value:表单元素文本内容
  // 函数:如果符合条件callback直接调用,如果不符合条件则向callback中注入错误信息
  if(value.length>=5){
    callback()
  }else{
    callback(new Error('账号长度必须大于5位'))
  }
}
// @ts-ignore
const validatorPassword = (rule:any,value:any,callback:any)=>{
  let reg = /^\w{6,15}$/
  if(/\W/.test(value)){
    callback('密码只能包含数字,字母,下划线')
  }
  if(reg.test(value)){
    callback()
  }else{
    callback('密码长度在6-15位之间')
  }
}

let rules:FormRules = {
  username:[
    {trigger:'change',validator:validatorUserName}
  ],
  password:[
    {trigger:'change',validator:validatorPassword}
  ]
}

let useUser = useUserStore()
let router = useRouter()
let route = useRoute()

const getTime = ():string=>{
  let hours = new Date().getHours()
  if(hours<=9){
    return '早上好'
  }else if(hours<=12){
    return '上午好'
  }else if(hours<=18){
    return '下午好'
  }else{
    return '晚上好'
  }
}

const login = async ()=>{
  // 保证表单校验通过后再发送请求
  await loginForm.value.validate() // loginForm是el-form组件的实例,该实例上有一个方法validate(),其作用是对整个表单的内容进行验证。 接收一个回调函数，或返回 Promise。
  loading.value = true

  useUser.userLogin(LoginInfo).then(()=>{
    loading.value = false
    if(route.query.redirect){
      router.push(<string>route.query.redirect)
    }else{
      router.push('/')
    }
    // 登录成功时的消息提示
    ElNotification({
      type:'success',
      title:getTime(),
      message:'欢迎回来'
    })
  },(reason)=>{ 
    loading.value = false
    ElNotification({
      type:'error',
      message:reason.message
    })
  })

}

</script>

<style scoped lang="less">
.login_container{
  width: 100%;
  height: 100vh;

  .login_form{
    position: relative;
    width: 40%;
    top: 10vh;
    height: 50vh;
    border-radius: 10px;
    box-shadow: 5px 5px 2px #aaa,-5px 5px 2px #aaa,-5px -5px 2px #aaa,5px -5px 2px #aaa;
    padding:40px ;
    &::after{
      width: 100%;
      height: 100%;
      opacity: 0.6;
      background-image: linear-gradient(45deg,#fbc2eb,#a6c1ee);
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
    }
    h1{
      color: #000;
      font-size: 40px;
      font-family: 'Courier New', Courier, monospace;
    }
    h2{
      font-size: 20px;
      color: #000;
      margin: 20px 0px;
      font-family: 'Courier New', Courier, monospace;
    }
    .login_btn{
      width: 80%;
      margin: 0 auto;
      background-image:linear-gradient(to right, #fbc2eb, #a6c1ee) ;
      filter: opacity(1);
      position: relative;
      z-index: 10;
    }
    .login_input{
      width: 80%;
      margin: 20px auto;
    }
  }


}
</style>