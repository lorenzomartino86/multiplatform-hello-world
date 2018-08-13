# Multiplatform project in Kotlin
Kotlin multiplatform allows developers to write common code once and enables targeting on different platforms. 
Core logic can be written in one place regardless of the platform using the mechanism of expected/actual paradigm 
in which the core module defines *expected declarations*  and the platform specific modules provide the *actual declarations*. 

## Prerequisites
- `Kotlin` version 1.2.51.
- `Gradle` is the used build system ([how to install](https://gradle.org/install/)).

### 2. Multiplatform library for Node/JVM 
The multiplatform library include three subprojects that will be used by both NodeJS and JVM applications:
 * `common` - contains  common logic for both applications;
 * `js` - contains Javascript specific implementation that can be imported as npm package in Node application;
 * `jvm` - contains JVM specific implementation that can be imported by JVM applications.
 
#### 2.1 Common subproject
The `common` subproject contains a platform-independent code. 
The build in gradle uses *kotlin-platform-common* plugin:

    plugins {
        id 'kotlin-platform-common' version '1.2.51'
    }
    repositories {
        mavenCentral()
    }
    
    dependencies {
        compile "org.jetbrains.kotlin:kotlin-stdlib-common"
        testCompile "org.jetbrains.kotlin:kotlin-test-annotations-common"
        testCompile "org.jetbrains.kotlin:kotlin-test-common"
    }

Create a `HelloWorld` class with the expected declaration *greeting*: 

    // common/src/main/kotlin/template/HelloWorld.kt
    package template
    
    expect class HelloWorld {
        fun greeting(firstName: String, lastName: String, platform: String): String
    }
    
Then create a `HelloWorldTemplate` class with the shared feature: 

    // common/src/main/kotlin/template/HelloWorldTemplate.kt
    package template
    
    class HelloWorldTemplate(val firstName: String, val lastName: String, val platform: String) {
        var template = "Hello World by $firstName $lastName from the amazing world of $platform!!"
    }
    
#### 2.2 JVM subproject
The `jvm` subproject contains a JVM-specific code. The build targets a JDK8 artifact using *kotlin-platform-jvm* plugin:

    plugins {
        id 'kotlin-platform-jvm' version '1.2.51'
        id 'java-library'
    }
    repositories {
        mavenCentral()
    }
    
    dependencies {
        compile "org.jetbrains.kotlin:kotlin-stdlib-jdk8"
        expectedBy project(":common")
        testCompile "junit:junit:4.12"
        testCompile "org.jetbrains.kotlin:kotlin-test"
        testCompile "org.jetbrains.kotlin:kotlin-test-junit"
    }
    
    compileKotlin {
        kotlinOptions.jvmTarget = "1.8"
    }
    compileTestKotlin {
        kotlinOptions.jvmTarget = "1.8"
    }
    sourceCompatibility = "1.8"

Create a `HelloWorld` class with the actual implementations: 

    // jvm/src/main/kotlin/template/HelloWorld.kt
    package template
    
    actual class HelloWorld {
        actual fun greeting(firstName: String, lastName: String, platform: String): String {
            return HelloWorldTemplate(firstName, lastName, platform).template
        }
    }
    
    fun helloWorld(firstName: String, lastName: String): String {
        return HelloWorld().greeting(firstName, lastName, "JAVA")
    }

#### 2.3 Javascript subproject
The `js` subproject contains a Javascript-specific code. The build targets a javascript artifact using *kotlin-platform-js* plugin:

    plugins {
        id 'kotlin-platform-js' version '1.2.51'
    }
    repositories {
        mavenCentral()
    }
    
    compileKotlin2Js {
        kotlinOptions.outputFile = "${projectDir}/index.js"
        kotlinOptions.metaInfo = true
        kotlinOptions.sourceMap = true
        kotlinOptions.suppressWarnings = true
        kotlinOptions.verbose = true
        kotlinOptions.moduleKind = "commonjs"
    }
    
    compileTestKotlin2Js {
        kotlinOptions.metaInfo = true
        kotlinOptions.sourceMap = true
        kotlinOptions.suppressWarnings = true
        kotlinOptions.verbose = true
        kotlinOptions.moduleKind = "commonjs"
    }
    
    dependencies {
        compile "org.jetbrains.kotlin:kotlin-stdlib-js"
        expectedBy project(":common")
        testCompile "org.jetbrains.kotlin:kotlin-test-js"
    }

Create a `HelloWorld` class with the actual implementations: 

    // js/src/main/kotlin/template/HelloWorld.kt
    package template
    
    actual class HelloWorld {
        actual fun greeting(firstName: String, lastName: String, platform: String): String {
            return HelloWorldTemplate(firstName, lastName, platform).template
        }
    }
    
    @JsName("helloWorld")
    fun helloWorld(firstName: String, lastName: String): String {
        return HelloWorld().greeting(firstName, lastName, "NODE")
    }

### 3. Proof of concept
In order to test the common libraries I've implemented 2 simple applications:
 * `node-app` - A Node JS application
 * `jvm-app` - A Java main class.

For the *js* module I suggest to build the library locally using command:

    npm install -g

Then on *node-app* folder install dependencies and run the application:

    npm install -g && npm start

#### 3.1 JVM Application
A simple standalone java application has been created:

    // jvm-app/src/main/java/template/jvm/HelloWorldJVM.java
    package template.jvm;
    
    import static template.HelloWorldKt.helloWorld;
    
    public class HelloWorldJVM {
        public static void main(String[] args){
            System.out.print(helloWorld("Lorenzo", "Martino"));
        }
    }
    
Running the application the following output is shown:

    > Task :jvm-app:HelloWorldJVM.main()
    Hello World by Lorenzo Martino from the amazing world of JAVA!!
    BUILD SUCCESSFUL in 0s 
    
#### 3.2 Node Application
A simple node application has been created (see `node-app` folder). 
In the following abstract the interaction with the npm library:

    // node-app/app.js
    ...
    var greeting = require('hello-world-local');
    console.log(greeting.template.helloWorld("Lorenzo", "Martino"));
    ...
    
Running the application the following output is shown:

    > node-app@0.0.0 start C:\Users\eomlrar\gitlab\multiplatform-templates-poc\node-app
    > node ./bin/www
    
    Hello World by Lorenzo Martino from the amazing world of NODE!!
   