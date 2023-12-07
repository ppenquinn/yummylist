# Yummy List 

## Local

```sh
# install dependencies 
npm i

# copy environment variable
cp .env-example .env

# run
npm run dev
```

## Deploy with Firebase 

install and init firebase config 

```sh
npm i -g firebase-tools
firebase init hosting:github
```

Firebase will 
- generate new GitHub's workflow on
  - `.github/workflows/firebase-hosting-merge.yml`
  - `.github/workflows/firebase-hosting-pull-request.yml`
- generate Firebase's secret

We have to update work flow file to add env on build

```yml
# .github/workflows/firebase-hosting-merge.yml

name: Deploy to Firebase Hosting on merge
'on':
  push:
    branches:
      - main
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Change from `run: npm ci && npm run build` to:
      - run: npm ci 
      - run: VITE_API_URL=${{ secrets.VITE_API_URL }} npm run build
      - run: npm run coverage

      - uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONARCLOUD_TOKEN }}

      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_ILUMIN_YUMMY_LIST }}'
          channelId: live
          projectId: ilumin-yummy-list
```

```yml
# .github/workflows/firebase-hosting-pull-request.yml

name: Deploy to Firebase Hosting on PR
'on': pull_request
jobs:
  build_and_preview:
    if: '${{ github.event.pull_request.head.repo.full_name == github.repository }}'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Change from `run: npm ci && npm run build` to:
      - run: npm ci 
      - run: VITE_API_URL=${{ secrets.VITE_API_URL }} npm run build
      - run: npm run coverage

      - uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONARCLOUD_TOKEN }}

      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_ILUMIN_YUMMY_LIST }}'
          projectId: ilumin-yummy-list
```


Update sonar-project.properties
```yml

sonar.exclusions=build/**,public/**,**.json,**/**.css,**/**.test.tsx,src/index.tsx,src/reportWebVitals.ts,src/setupTests.ts
sonar.javascript.lcov.reportPaths=./coverage/lcov.info
sonar.projectKey=[YOUR_PROJECT_KEY]
sonar.organization=[YOUR_ORGANIZATION]
```