import { defineStore } from "pinia";

import { reqCategory1,reqCategory2,reqCategory3 } from "@/api/product/attr";
import { CategoryResponseData } from "@/api/product/attr/type";
import { CategoryState } from "./types/type";

let useCategoryStore = defineStore('Category',{
  state():CategoryState{
    return {
      // 存储一级分类的数据
      c1Arr:[],
      // 存储当前被选中的一级分类的id
      c1ID:'',
      // 存储二级分类的数据
      c2Arr:[],
      // 存储当前被选中的二级分类的id
      c2ID:'',
      // 存储三级分类的数据
      c3Arr:[],
      // 存储当前被选中的三级分类的id
      c3ID:''
    }
  },
  actions:{
    async getC1(){
      let result:CategoryResponseData = await reqCategory1()
      if(result.code === 200){
        this.c1Arr = result.data
      }
    },

    async getC2(){
      let result:CategoryResponseData = await reqCategory2(this.c1ID)
      if(result.code===200){
        this.c2Arr = result.data
      }
    },

    async getC3(){
      let result:CategoryResponseData = await reqCategory3(this.c2ID)
      if(result.code===200){
        this.c3Arr = result.data
      }
    }
  },
  getters:{

  }
})

export default useCategoryStore