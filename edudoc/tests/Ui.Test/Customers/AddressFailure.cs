using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using Ui.Tests.Utilities;

namespace Ui.Tests.Customers
{
    [TestFixture]
    public class AddressFailure
    {
        private readonly IWebDriver _driver;
        private readonly string _baseUrl;
        private readonly TestSetup _setup;

        public AddressFailure()
        {
            _setup = new TestSetup();
            _driver = _setup.Driver;
            _baseUrl = _setup.BaseUrl;
        }

        [Test]
        public void TheAddressFailureTest()
        {
            _setup.DoLogin();
            _driver.Navigate().GoToUrl(_baseUrl + "/#/customer/list");
            _driver.FindElement(By.CssSelector("td.ellipsis.ng-binding")).Click();
            _driver.FindElement(By.XPath("//customer-address-info-component//button[@type='button']")).Click();
            _setup.FiveSecWait.Until(
                ExpectedConditions.ElementIsVisible(
                    By.XPath("//customer-address-info-component/form//button[@ng-click='$ctrl.addAddress()']")));
            _driver.FindElement(
                    By.XPath("//customer-address-info-component/form//button[@ng-click='$ctrl.addAddress()']"))
                .Click();
            _driver.FindElement(By.XPath("//customer-address-info-component/form/button[@type='submit']")).Click();
            Assert.IsTrue(
                _driver.FindElement(By.CssSelector(".form-group.has-error")).Displayed);
            _setup.TeardownTest();
        }
    }
}