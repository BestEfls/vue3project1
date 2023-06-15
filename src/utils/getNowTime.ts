export default function getNowTime(){
  let date = new Date()
  let years = date.getFullYear()
  let months = date.getMonth()+1
  let day = date.getDate()
  let hours = date.getHours()
  let minutes:any = date.getMinutes()
  minutes = minutes<10?'0'+minutes:minutes
  let seconds:any = date.getSeconds()
  seconds = seconds<10?'0'+seconds:seconds
  return `${years}年${months}月${day}日 ${hours}:${minutes}:${seconds}`
}