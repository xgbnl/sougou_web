# Next Template

## 开始使用

### 环境要求

> Node ^24.12.0

### 运行

1. 添加 `.env.local` 文件

```shell
sudo cp .env.example .env.local
```

2. 安装依赖

```shell
sudo npm install
```

3. 生成 next auth 密钥

```shell
npm exec auth secret
```

## 打包布署

1. 编辑 `.env.production` 替换NEXT APP的域名，防止跨域：

```env
NEXT_PUBLIC_APP_URL=https://your_domain.com
```

2. 生成 `NextAuth Secret` 密钥

```env
AUTH_SECRET="V0dWMOBO1ZnB6UQIDcLCnapVS+xevkhuJJCiUsdWgI4="
```

4. 根目录运行以下命令，进行项目编译打包工作：

```shell
docker build -t next-app .

docker run -p 3000:3000 my-next-app
```

5. 使用 nginx 进行反向代理 `3000` 端口即可

## Eslint

本项目eslint基于next.js进行配置，详细请参考next.js官方说明

### 修复文件 eslint 格式错误

```shell
npx eslint example.tsx --fix
```

## 依赖更新

```shell
npx npm-check-updates

npx npm-check-updates -u

sudo npm install
```

## Fetch使用约定

### 服务端组件调用示例

服务端与客户端调用方式不同，主要展现在渲染场景
在服务端调用`whenFailureRedirect()`方法时，响应code如果包含`401,403,404`则会触发自动重定向跳转

```tsx
const Page = async (): Promise<ReactElement> => {
    
  const res = await get<ResponseInterface<User>>('api/users')

  if (res.whenFailureRedirect().failed()) {
    return (
      <>
        <MuiAlert message={res.getMessage()} />
        <div>
          <h3>Fetcher</h3>
        </div>
      </>
    )
  }

  return (
    <div>
      <h3>Fetcher</h3>
    </div>
  )
}
```

### 客户端组件调用示例

在客户端组件中调用`whenFailureRedirect()`方法时，如果响应code包含 401 则会先展示toast，待其生命周期结束后，会重定向至登录页
其它非 200 响应码时，会展示toast

```tsx
'use client'

const Page = (): ReactElement => {

    const [rows,setRows] = useState<User[]>([])

    const fetchPageData = async ():Promise<void> {

        const res = await get<ResponseInterface<User>>('api/users')

        if (!res.whenFailureRedirect().failed()) {
            setRows(res.getContent())
        }

    }

    useEffect((): void => {
        fetchPageData()
    },[])

  return (
    <div>
      <h3>Fetcher</h3>
    </div>
  )
}

```
