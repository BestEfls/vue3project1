import pinia from "@/store";
import useUserStore from "@/store/modules/user";
import { App } from "vue";

let userStore = useUserStore(pinia)

export let isHasButton = (app:App<Element>)=>{
  app.directive('has',{
    mounted(el:any,options:any){
      if(!userStore.buttons.includes(options.value)){
        el.parentNode.removeChild(el)
      }
    }
  })
}
  