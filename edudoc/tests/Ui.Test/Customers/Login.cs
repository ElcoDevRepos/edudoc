using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using Ui.Tests.Utilities;

namespace Ui.Tests.Customers
{
    [TestFixture]
    public class Login
    {
        public Login()
        {
            _driver = _setup.Driver;
            _baseUrl = _setup.BaseUrl;
        }

        private readonly TestSetup _setup = new TestSetup();
        private readonly IWebDriver _driver;
        private readonly string _baseUrl;

        [Test]
        public void TheLoginTest()
        {
            _driver.Navigate().GoToUrl(_baseUrl + "/#/login");
            _driver.FindElement(By.XPath("//input[@type='text']")).Clear();
            _driver.FindElement(By.XPath("//input[@type='text']")).SendKeys("admin");
            _driver.FindElement(By.XPath("//input[@type='password']")).Clear();
            _driver.FindElement(By.XPath("//input[@type='password']")).SendKeys("admin");
            _driver.FindElement(By.XPath("//button[@type='submit']")).Click();
            _setup.FiveSecWait.Until(ExpectedConditions.ElementIsVisible(By.ClassName("main-sidebar")));
            Assert.That("breckenridge - Manage Customers", Is.EqualTo(_driver.Title));
            _setup.TeardownTest();
        }
    }
}