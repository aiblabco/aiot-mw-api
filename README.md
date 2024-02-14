# AIoTMW 

## 프로젝트 구조

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--docs\           # Swagger files
 |--middlewares\    # Custom express middlewares
 |--daos\         	# MySQL DB DAO
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
tests\
```

### 처리 흐름
- routes(auth, validate) > controllers > services > daos
### routes
```text
1) 권한 체크
  - auth() 미들웨어로 필요한 권한 전달
  - 미들웨어에서 권한을 확인하여 처리
  - 권한이 없는 경우 상황에 맞는 401, 403 등 반환
2) 유효성 검사
  - validate() 미들웨어에서 처리
  - joi를 이용, 유효성 검사 스펙은 별도 파일에 정의, src/valications
  - 유효성 검사에 실패한 경우 400 에러 반환
3) 컨트롤러 지정
  - path 및 method에 따른 처리 컨트롤러 설정
4) Swagger 문서 작성
```
### controllers
```text
1) request에서 처리에 필요한 파라미터 추출
2) 필요한 서비스 호출
3) 서비스 처리 결과를 상황에 맞게 클라이언트에 응답
```
### services
```text
1) 비즈니스 로직 수행
  - 내부 로직
  - DB 작업호출
  - 외부 시스템 호출 등등
2) 처리 결과 조합
```
### daos
```text
1) DB 작업 수행
  - createOne
  - selectOne
  - deleteOne
  - updateOne
  - selectAll
  - createAll
  - deleteAll
  - etc...
```

## VSCODE에서 yarn 실행 디버그 설정파일
```json
{
  // IntelliSense를 사용하여 가능한 특성에 대해 알아보세요.
  // 기존 특성에 대한 설명을 보려면 가리킵니다.
  // 자세한 내용을 보려면 https://go.microsoft.com/fwlink/?linkid=830387을(를) 방문하세요.
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch via Yarn",
      "runtimeExecutable": "yarn",
      "cwd": "${workspaceFolder}",
			"outputCapture": "std",
      "runtimeArgs": ["dev"]
    }
  ]
}
```

## Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

Testing:

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```

Docker:

```bash
# run docker container in development mode
yarn docker:dev

# run docker container in production mode
yarn docker:prod

# run all tests in a docker container
yarn docker:test
```

Linting:

```bash
# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# fix prettier errors
yarn prettier:fix
```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# Service
SERVICE_PROTOCOL=http
SERVICE_HOST=localhost
PORT=59770

EDGEX_HOST=edgex_host
EDGEX_CORE_DATA_PORT=59880
EDGEX_CORE_METADATA_PORT=59881
EDGEX_COMMAND_PORT=59882
EDGEX_DEVICE_MQTT_PORT=8883
EDGEX_DEVICE_MQTT_CLIENT_ID=aiotmwapi
EDGEX_X_CORRELATION_ID=edgex_x_correlation_id


LNS_HOST=lns_host
LNS_API_PORT=81
LNS_AUTH_PORT=3000
LNS_USERNAME=lns_username
LNS_PASSWORD=lns_password
LNS_AUTHORIZATION_BASIC=lns_authorization_basic

AIOTMW_EDGEMWID=AIoT_MW_01
AIOTMW_TITLE=Seongnam Smartcity AIoT edge middleware 01
AIOTMW_DESCRIPTION=Seongnam Smartcity AIoT edge middleware 01
AIOTMW_VERSION=v1.1.230804
AIOTMW_PATH=/api/v1

MQTT_SERVICE_NAME=device-mqtt

APP_DEFAULT_PRIORITY=1
APP_CH_ACCESS_TYPE=p
APP_DEFAULT_IFS=0
APP_MIN_CW=0
APP_MAX_CW=7

# JWT
# JWT secret key
JWT_SECRET=thisisasamplesecret
# Number of minutes after which an access token expires
JWT_ACCESS_EXPIRATION_MINUTES=1440
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION_DAYS=30
# Number of minutes after which a reset password token expires
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=60
# Number of minutes after which a verify email token expires
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=60

```


## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

In this app, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc.json` file. To modify the Prettier configuration, update the `.prettierrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`

## Base Project

https://github.com/hagopj13/node-express-boilerplate

## License

[MIT](LICENSE)
