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
                    bat 'npm install'
                }
            }
        }

        stage('Run Client Tests & Coverage') {
            steps {
                dir('client') {
                    bat 'npx sonar-scanner'
                }
            }
        }

        stage('Install Server Deps') {
            steps {
                dir('server') {
                    bat 'npm install'
                }
            }
        }

        stage('Run Server Tests & Coverage') {
            steps {
                dir('server') {
                    bat 'npm test -- --coverage'
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
