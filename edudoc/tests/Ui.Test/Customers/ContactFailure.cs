using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using Ui.Tests.Utilities;

namespace Ui.Tests.Customers
{
    [TestFixture]
    public class ContactFailure
    {
        private readonly IWebDriver _driver;
        private readonly string _baseUrl;
        private readonly TestSetup _setup;


        public ContactFailure()
        {
            _setup = new TestSetup();
            _driver = _setup.Driver;
            _baseUrl = _setup.BaseUrl;
        }


        [Test]
        public void TheContactFailureTest()
        {
            _setup.DoLogin();
            _driver.Navigate().GoToUrl(_baseUrl + "/#/customer/list");
            _driver.FindElement(By.CssSelector("td.ellipsis.ng-binding")).Click();
            _driver.FindElement(By.XPath("//customer-contact-info-component//button[@type='button']")).Click();
            _setup.FiveSecWait.Until(
                ExpectedConditions.ElementIsVisible(
                    By.XPath("//customer-contact-info-component//button[@type='submit']")));
            _driver.FindElement(By.XPath("//customer-contact-info-component//button[@type='submit']")).Click();
            Assert.IsTrue(
                _driver.FindElement(By.CssSelector(".form-group.has-error")).Displayed);
            _setup.TeardownTest();
        }
    }
}