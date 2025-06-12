using Model;
using Service.Common.Address;
using Service.Common.Phone;
using Service.Users.Models;
using System.Collections.Generic;
using System.Linq;

namespace Service.Users
{
    public interface IUserService
    {
        void Create(User user, string username, string password, int userTypeId, bool sendEmail = false);

        CreateAddressResult CreateAddress(int userId, Address address);


        void DeleteAddress(int userId);


        byte[] DeleteImage(int userId);

        int SetHasAccess(int userId, bool hasAccess);

        void ForgotPassword(string email, bool isFromMobile);

        IQueryable<Document> GetUserDocuments(int userId);


        void MergePhones(int userId, PhoneCollection<UserPhone> phones);

        User Reload(int userId);

        void UpdateAddress(Address address);

        UpdateUserPicResult UpdatePic(int userId, byte[] picBytes, string fileName);

        byte[] UpdateUser(User user);

        List<int> GetDistrictsByUserId(int userId);

        IQueryable<User> GetActiveUsers();

        void UpdateDistrictAssignments(int authUserId, int newRoleId, int? oldRoleId);
        IEnumerable<User> GetByUsersRoleId(int roleId);
    }
}
