package template

import kotlin.test.Test
import kotlin.test.assertTrue

class HelloWorldTemplateTest{
    @Test
    fun givenFirstNameAndSecondNameAndPlatform_whenCreateTemplate_thenHelloWorldTemplateIsCreated() {
        val template = HelloWorldTemplate("Foo", "Bar", "GUMBLE").template
        assertTrue(template.equals("Hello World by Foo Bar from the amazing world of GUMBLE!!"))
    }
}