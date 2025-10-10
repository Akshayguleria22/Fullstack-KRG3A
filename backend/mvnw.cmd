@ECHO OFF
setlocal
set MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%
if not defined MAVEN_PROJECTBASEDIR set MAVEN_PROJECTBASEDIR=%CD%
set MAVEN_WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain
if exist %MAVEN_WRAPPER_JAR% (
  java -classpath %MAVEN_WRAPPER_JAR% %WRAPPER_LAUNCHER% %*
) else (
  echo Maven wrapper jar not found. Please run with Maven installed.
  exit /b 1
)
