pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                // Use 'bat' for Windows, 'sh' for Linux
                bat 'mvn clean install -Dspring.profiles.active=local'
            }
        }

        stage('Deploy') {
            steps {
                bat '''
                if not exist "E:\\deployments" mkdir "E:\\deployments"
                copy /Y "target\\*.war" "E:\\deployments\\upna-kart.war"
                set BUILD_ID=dontKillMe
                start /b java -jar E:\\deployments\\upna-kart.war --spring.profiles.active=local
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'target/*.war', fingerprint: true
            deleteDir() // Wipes workspace after build to keep disk clean
        }
    }
}