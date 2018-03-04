先打开mongoDB服务器，再在signin文件目录下运行 npm start 命令打开登录系统；
访问localhost:8000进入登录页面，点击注册按键或访问localhost:8000/regist进入注册页面；
直接访问localhost:8000/detail或localhost:8000/detail?username=***可打开详情页面，但提示“只能访问自己的数据”；
登录成功后访问localhost:8000即可打开详情页，点退出后将不可再直接访问detail页；
注册时可获得信息格式是否正确以及信息是否已用于注册等信息。