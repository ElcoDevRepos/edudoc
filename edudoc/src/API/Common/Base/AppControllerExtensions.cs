using API.CRUD;
using API.Models;
using Model;

namespace API.Base
{
    public static class AppControllerExtensions
    {
         public static int GetUserRoleTypeId<T>(this CrudBaseController<T> controller) where T : class, IEntity, new()
        {
            var userRoleTypeId = int.Parse(controller.User.FindFirst(AppOwinKeys.UserRoleTypeId).Value);
            return userRoleTypeId;
        }

    }
}

