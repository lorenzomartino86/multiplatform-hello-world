package template

class HelloWorldTemplate(val firstName: String, val lastName: String, val platform: String) {
    var template = "Hello World by $firstName $lastName from the amazing world of $platform!!"
}