pipeline {
    agent any

    tools {
        nodejs "NodeJS"   // Name must match Jenkins NodeJS config
    }

    environment {
        SONARQUBE = credentials('sonar-token') // Add Jenkins secret with your token
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/jayaprasathjp/HRMS-angular.git'
            }
        }

        stage('Install Client Deps') {
            steps {
                dir('client') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Client Tests & Coverage') {
            steps {
                dir('client') {
                    sh 'npm run test -- --code-coverage --watch=false'
                }
            }
        }

        stage('Install Server Deps') {
            steps {
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Server Tests & Coverage') {
            steps {
                dir('server') {
                    sh 'npm test -- --coverage'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQubeLocal') {
                    sh """
                        sonar-scanner \
                          -Dsonar.projectKey=HRMS-angular \
                          -Dsonar.projectName="HRMS-angular" \
                          -Dsonar.sources=client/src,server \
                          -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/*.spec.ts,**/coverage/** \
                          -Dsonar.javascript.lcov.reportPaths=client/coverage/lcov.info,server/coverage/lcov.info \
                          -Dsonar.host.url=http://localhost:9000 \
                          -Dsonar.token=$SONARQUBE
                    """
                }
            }
        }

        stage("Quality Gate") {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
