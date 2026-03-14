pipeline {
    agent any

    tools {
        nodejs 'Node-22-14-0'
    }

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/JamesLaurino/front-client-fotova.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Angular') {
            steps {
                sh 'ng build'
            }
        }

        stage('Deploy to Nginx') {
            steps {
                sh 'rm -r /var/www/angular-app/dist'

                sh 'cp dist /var/www/angular-app/'
            }
        }

        stage('Stop Nginx') {
            steps {
                sh 'systemctl stop nginx'
            }
        }

        stage('Start Nginx') {
            steps {
                sh 'systemctl start nginx'
            }
        }
    }
}
