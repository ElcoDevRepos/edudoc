# Route Versioning Guide

```Csharp
namespace API.Customers
{
    [Route("api/v1/Customers")]
    public class CustomersController : ControllerBase<Customer>
    {
        public CustomersController(ICustomerService cs) : base(cs) { }
    }

    /// <summary>
    /// Changing the route prefix of the controller lets us
    /// version by url.
    /// NOTE: you must change the class name, simply namespacing is not
    /// currently supported.
    /// </summary>
    [Route("api/v2/Customers")]
    public class v2_CustomersController : ControllerBase<Customer>
    {
        public v2_CustomersController(ICustomerService cs) : base(cs) { }


        /// <summary>
        /// Note: you should not repeat the route in overrided methods, as this
        /// may cause web api to see duplicate routes, even in an abstract base class.
        /// </summary>
        /// <param name="skip"></param>
        /// <param name="take"></param>
        /// <returns></returns>
        public override IEnumerable<Customer> GetList(string orderBy = "Id", int skip = 0, int take = 25)
        {
            return new Customer[0];
        }


        /// <summary>
        /// This action overrides the route prefix (the '~'), allowing us
        /// to version a specific route method instead of the entire controller.
        /// </summary>
        /// <param name="skip"></param>
        /// <param name="take"></param>
        /// <returns></returns>
        [Route("~/api/v3/Customers/{orderBy?}/{skip:int?}/{take:int?}")]
        public IEnumerable<Customer> GetThree(string orderBy = "Id", int skip = 0, int take = 25)
        {
            return _service.GetAll().Take(3);
        }

    }
}
```