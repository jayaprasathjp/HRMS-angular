pipeline {
    agent any

    tools {
        nodejs "NodeJS"   // must match the NodeJS tool name in Jenkins global config
    }

    environment {
        SONARQUBE = credentials('sonar-token') // Jenkins secret with your token
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
                    bat 'npm ci'   // use clean install
                }
            }
        }

        stage('Run Client Analysis') {
            steps {
                dir('client') {
                    bat 'npx sonar-scanner'
                }
            }
        }

        stage('Install Server Deps') {
            steps {
                dir('server') {
                    // remove any cached modules and reinstall fresh
                    bat '''
                        if exist node_modules rmdir /s /q node_modules
                        if exist package-lock.json del package-lock.json
                        npm ci
                    '''
                }
            }
        }

        stage('Run Server Tests & Coverage') {
            steps {
                dir('server') {
                    // run jest tests with coverage
                    bat 'npm test -- --coverage --passWithNoTests'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQubeLocal') {
                    bat """
                        sonar-scanner -Dsonar.token=%SONARQUBE%
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
