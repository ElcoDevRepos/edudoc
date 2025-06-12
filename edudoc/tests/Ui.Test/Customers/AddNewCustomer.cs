using System;
using System.Linq;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using Ui.Tests.Utilities;

namespace Ui.Tests.Customers
{
    [TestFixture]
    public class AddNewCustomer
    {
        public AddNewCustomer()
        {
            _setup = new TestSetup();
            _driver = _setup.Driver;
            _baseUrl = _setup.BaseUrl;
        }

        private readonly IWebDriver _driver;
        private readonly string _baseUrl;
        private readonly TestSetup _setup;
        private static readonly Random Random = new Random();
        private readonly string _name = RandomString(8);

        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[Random.Next(s.Length)]).ToArray());
        }

        private void Navigate()
        {
            _driver.Navigate().GoToUrl(_baseUrl + "/#/customer/list");
            _driver.FindElement(By.CssSelector("span.fa.fa-plus")).Click();
        }

        private void EnterCustomerInfo()
        {
            _setup.FiveSecWait.Until(ExpectedConditions.ElementIsVisible(By.Name("companyName")));
            Assert.AreEqual("Add Customer", _driver.FindElement(By.CssSelector("h2")).Text);
            _driver.FindElement(By.Name("companyName")).SendKeys(_name);
            new SelectElement(_driver.FindElement(By.Name("as"))).SelectByText("Craigslist");
            new SelectElement(_driver.FindElement(By.Name("ast"))).SelectByText("Current");
            _driver.FindElement(By.CssSelector("button.btn.btn-success")).Click();
            _setup.FiveSecWait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector("div.toast-success")));
            Assert.IsTrue(IsElementPresent(By.CssSelector("div.toast-success")));
        }

        private void EnterCustomerPhone()
        {
            _driver.FindElement(By.XPath("//customer-phone-info-component/div/h4")).Click();
            _driver.FindElement(By.Id("inputPhone")).SendKeys("(856) 856-1111 Ext 123__");
            _driver.FindElement(By.XPath("//customer-phone-info-component//button[@type='submit']")).Click();
            _setup.FiveSecWait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector("div.toast-success")));
            Assert.IsTrue(IsElementPresent(By.CssSelector("div.toast-success")));
        }

        private void EnterCustomerAddress()
        {
            _driver.FindElement(By.XPath("//customer-address-info-component//button[@type='button']")).Click();
            _setup.FiveSecWait.Until(
                ExpectedConditions.ElementIsVisible(
                    By.XPath("//customer-address-info-component/form/div//button[@ng-click='$ctrl.addAddress()']")));
            _driver.FindElement(
                    By.XPath("//customer-address-info-component/form/div//button[@ng-click='$ctrl.addAddress()']"))
                .Click();
            _setup.FiveSecWait.Until(ExpectedConditions.ElementIsVisible(By.Name("a1")));
            _driver.FindElement(By.Name("a1")).SendKeys("123 Test Street");
            _driver.FindElement(By.Name("a2")).SendKeys("Unit 1");
            _driver.FindElement(By.Name("ac")).SendKeys("Testville");
            new SelectElement(
                    _driver.FindElement(
                        By.CssSelector("div.display-padded.ng-scope > div.form-group > select[name=\"as\"]")))
                .SelectByText("NJ");
            _driver.FindElement(By.Name("az")).SendKeys("18101");
            _driver.FindElement(By.XPath("//customer-address-info-component/form/button[@type='submit']")).Click();
            _setup.FiveSecWait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector("div.toast-success")));
            Assert.IsTrue(IsElementPresent(By.CssSelector("div.toast-success")));
        }

        private void EnterCustomerContact()
        {
            _setup.FiveSecWait.Until(
                ExpectedConditions.ElementToBeClickable(
                    By.XPath("//customer-contact-info-component//button[@type='button']")));

            _driver.FindElement(By.XPath("//customer-contact-info-component//button[@type='button']")).Click();
            _setup.FiveSecWait.Until(
                ExpectedConditions.ElementIsVisible(
                    By.CssSelector("form[name=\"contactForm\"] > div.form-group > input[name=\"first\"]")));
            _driver.FindElement(By.CssSelector("form[name=\"contactForm\"] > div.form-group > input[name=\"first\"]"))
                .SendKeys("Test");
            _driver.FindElement(By.Name("last")).SendKeys("Contact");
            _setup.FiveSecWait.Until(
                ExpectedConditions.ElementIsVisible(
                    By.CssSelector("form[name=\"contactForm\"] > div.form-group > input[name=\"title\"]")));
            _driver.FindElement(By.CssSelector("form[name=\"contactForm\"] > div.form-group > input[name=\"title\"]")).SendKeys("Tester");
            _driver.FindElement(By.Name("email")).SendKeys("test.test@test.tst");
            new SelectElement(_driver.FindElement(By.Name("status"))).SelectByText("Poppin");
            _driver.FindElement(By.XPath("//customer-contact-info-component//button[@type='submit']")).Click();
            _setup.FiveSecWait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector("div.toast-success")));
            Assert.IsTrue(IsElementPresent(By.CssSelector("div.toast-success")));
        }

        private bool IsElementPresent(By by)
        {
            try
            {
                _driver.FindElement(by);
                return true;
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }

        [Test]
        public void TheAddNewCustomerTest()
        {
            _setup.DoLogin();
            Navigate();
            EnterCustomerInfo();
            EnterCustomerPhone();
            EnterCustomerAddress();
            EnterCustomerContact();
            _setup.TeardownTest();
        }
    }
}