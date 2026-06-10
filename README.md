现在需要你帮我改当前项目与当前项目同级目录的api接口
1. Account模型与表需要增加一个channel字段，代表账户渠道，并且同时根据api/app/Enums的枚举类风格来命名类，枚举值有两个，分别为：QI_HU = ‘qihu’ ,BAIDU = ‘baidu’ ，描述分别为360，百度，迁移表为类型为enum，同时修改该项目后台添加账户，要求添加账户时增加Enum Radio组件展示账户渠道，让用户自主选择，并且后端对应的Request同时添加这个字段
迁移表的字段都给上默认值，当radio为百度时，前端dialog只展示一个输入框叫：百度账户名，类型最好做field?这种可为undefined的处理，包括后端Request里的验证规则最好是 nullable
2. 绑定用户回显和导入数据回显时不用区分用户的渠道，都统一查出来 
3. 以下是百度线索推送的消息结构，后面这个需要在处理百度推送消息时，和迁移表字段变更都需要使用它：
```json
{
  "ucid": "88888888", // 推广ID，不入库，不使用
  "clueId": "20082016933312218", // 线索ID：入库，唯一性，
  "username": "example", // 称呼/客户名称
  "phone": "example", // 手机号/客户手机号
  "keyword": "example", // 关键字
  "search_word": "example", // 搜索关键字
  "clue_time": "example", // 线索时间
  "sign": "c2fa98f877686215dec866c291e12156" // 签名，不入库，使用：签名后端源码会存一份，每次推送消息过来的sign都是一样的，需要拿这个来与后端存的进行对比，是正确的就入库,放到env里面名字叫: BAIDU_CLUE_DELIVERY_SIGN，通过openapi.php读取
}
```
4.上面提到的结构入库字段clueId以下划线clue_id为字段名
5. 迁移表与模型字段全部变更，要保留关键的account_id,owner_id,is_faker,site_name,site_name
6. app/Console/Commands/SyncMarketingLeadData.php中处理数据入库字段映射如下，key为$lead数组 value为具体落库的对应字段：
- $lead['customer_name'] => username
- $lead['customer_tel'] => phone
- $lead['site_name] => site_name
- $leadId => clueId
- $lead['ad_search_word'] => search_word
- $lead['ad_keyword'] => keyword
- $lead['create_time] => clue_time
并且Interactor与返回的结构值，以及前端定义类型都要同步变更
7. 做好这些之后，就是在app/ThirdParty/Baidu/DeliveryMessage.php中进行处理，具体路由与handle方法我已经定义好，这里我说下处理过程，要求如下：
1. 获取Account channel = baidu并且status = 1的用户
2. 消息进来之后也是类似360消息同步一样的轮询，但是问题是消息不是数组，就是一个纯的消息item不是item[]，这个你看怎么实现类似轮询或随机分配给主账户，然后是主账户关联的用户，要的就是这种效果，好了，开始吧

