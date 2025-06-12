using Service.Core.Utilities;
using Service.Core.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using FluentValidation;
using Model;
using Service.Auth;
using Service.Common.Address;
using Service.Common.Phone;
using Service.Users.Models;
using Service.Users.Phones;
using Service.Utilities;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using TrackerEnabledDbContext.Common.Interfaces;
using User = Model.User;

namespace Service.Users
{
    public class UserService : BaseService, IUserService
    {
        private const int ProfilePicSize = 1200;
        private const int ThumnailPicSize = 200;
        private readonly IAuthService _authService;
        private readonly IValidator<User> _userValidator;
        private readonly IEmailHelper _emailHelper;
        private readonly IImageProcessingHelper _imageProcessingHelper;
        private readonly IDocumentHelper _documentHelper;
        public UserService(IPrimaryContext context, IAuthService authService, IEmailHelper emailHelper, IImageProcessingHelper imageProcessingHelper, IDocumentHelper documentHelper)
            : base(context)
        {
            _emailHelper = emailHelper;
            _userValidator = new UserValidator(context, _emailHelper);
            _authService = authService;
            _imageProcessingHelper = imageProcessingHelper;
            _documentHelper = documentHelper;
        }

        /// <summary>
        ///     Creates User and accompanying AuthUser.
        /// </summary>
        public void Create(User user, string username, string password, int userTypeId, bool sendEmail = false)
        {
            bool genPassword = string.IsNullOrEmpty(password);
            ThrowIfNull(user);

            var userRole = _authService.CreateUserRole(username, userTypeId);
            user.AuthUser = _authService.GenerateAuthUser(username, genPassword, password, userRole);
            _authService.ValidateAndThrow(user.AuthUser);
            ValidateAndThrow(user, _userValidator);
            Context.Users.Add(user);
            Context.SaveChanges();
            if (sendEmail) SendInitialUserEmail(user, genPassword);
        }

        /// <summary>
        ///     Creates new Address and associates to User.
        /// </summary>
        public CreateAddressResult CreateAddress(int userId, Address address)
        {
            return base.CreateAddress<User>(userId, address);
        }


        /// <summary>
        ///     Deletes the Address of a User.
        /// </summary>
        /// <param name="userId"></param>
        public void DeleteAddress(int userId)
        {
            base.DeleteAddress<User>(userId);
        }



        /// <summary>
        ///     Deletes a image from a User.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Returns a new rowversion for the User.</returns>
        public byte[] DeleteImage(int userId)
        {
            var user = Context.Users
                .Include(u => u.Image)
                .SingleOrDefault(u => u.Id == userId);
            ThrowIfNull(user);
            Image img = RemoveImage(user);
            Context.SetEntityState(user, EntityState.Modified);
            Context.SaveChanges();
            DeleteDiskImages(img);
            // ReSharper disable once PossibleNullReferenceException
            return user.Version;
        }


        /// <summary>
        ///     Changes whether a User has access to the portal.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="hasAccess"></param>
        /// <returns>Returns the AuthUserId of the User that was updated.</returns>
        public int SetHasAccess(int userId, bool hasAccess)
        {
            var user = Context.Users.
                Include(u => u.AuthUser)
                .SingleOrDefault(u => u.Id == userId);
            ThrowIfNull(user);
            // ReSharper disable once PossibleNullReferenceException
            if (!user.AuthUser.IsEditable)
                throw new ValidationException("This is a protected user and cannot be edited.");

            user.AuthUser.HasAccess = hasAccess;
            Context.SetEntityState(user.AuthUser, EntityState.Modified);
            Context.SaveChanges();
            return user.AuthUserId;
        }

        /// <summary>
        ///     Triggers underlying AuthUser's forgot password functionality
        ///     with the User's email.
        ///     AuthUser must be present.
        /// </summary>
        /// <param name="email"></param>
        public void ForgotPassword(string email, bool isFromMobile)
        {
            var user = Context.Users.Include(u => u.AuthUser).Include(u => u.AuthUser.UserRole).Where(u => u.AuthUser.IsEditable).SingleOrDefault(u => u.Email == email);
            ThrowIfNull(user);
            if(user.Archived) {
                throw new ValidationException("User is archived.");
            }
            // ReSharper disable once PossibleNullReferenceException
            _authService.SetResetKey(user.AuthUser);
            _authService.SendForgotPasswordEmail(user.AuthUser, user.Email, isFromMobile);
        }

        /// <summary>
        ///     Gets a user by email.
        ///     For use generally with forgot password.
        /// </summary>
        /// <param name="email"></param>
        /// <returns>Returns a User, or null if not found.</returns>
        public User GetByEmail(string email)
        {
            return Context.Users
                .Include(u => u.AuthUser)
                .SingleOrDefault(u => u.Email == email);
        }

        /// <summary>
        ///     Gets all Documents for a User.
        /// </summary>
        /// <returns>Returns an IQueryable of Documents.</returns>
        public IQueryable<Document> GetUserDocuments(int userId)
        {
            return Context.Users
                .Where(u => u.Id == userId)
                .SelectMany(u => u.Documents);
        }

        /// <summary>
        ///     Merges UserPhones.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="phones"></param>
        public void MergePhones(int userId, PhoneCollection<UserPhone> phones)
        {
            ThrowIfNull(phones);
            ValidateAndThrow(phones, new UserPhoneCollectionValidator()); //  validate phones that will persist

            var phonesArray = phones.Phones as UserPhone[] ?? phones.Phones.ToArray();

            foreach (var p in phonesArray)
            {
                p.PhoneType = null; // clean out PhoneType if present for adds
                p.UserId = userId; // in case it wasn't set...
            }

            PrimaryHelper.EnsureOneIsPrimary(phonesArray);

            var existing = Context.UserPhones.Where(up => up.UserId == userId);
            Context.Merge<UserPhone>()
                .SetExisting(existing)
                .SetUpdates(phonesArray)
                .MergeBy((e, u) => e.Phone == u.Phone && e.Extension == u.Extension)
                .MapUpdatesBy((e, u) =>
                {
                    e.IsPrimary = u.IsPrimary;
                    e.PhoneTypeId = u.PhoneTypeId;
                })
                .Merge();
            Context.SaveChanges();
        }

        /// <summary>
        ///     Reloads the user entity for concurrency handling.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Returns a User.</returns>
        public User Reload(int userId)
        {
            return Context.Users
                .Include(u => u.Address)
                .Include(u => u.AuthUser)
                .Include(u => u.AuthUser.UserRole)
                .Include(u => u.Image)
                .Include(u => u.UserPhones)
                .Where(u => u.AuthUser.IsEditable) // hide internal users
                .AsNoTracking()
                .SingleOrDefault(u => u.Id == userId);
        }

        /// <summary>
        ///     Updates an Address of a User.
        /// </summary>
        public new void UpdateAddress(Address address)
        {
            base.UpdateAddress(address);
        }

        /// <summary>
        ///     Updates the user's profile pic.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="picBytes"></param>
        /// <param name="fileName"></param>
        /// <returns>Returns the new User rowversion and the Image record.</returns>
        public UpdateUserPicResult UpdatePic(int userId, byte[] picBytes, string fileName)
        {
            var user = Context.Users
                .Include(u => u.Image)
                .AsNoTracking()
                .Single(u => u.Id == userId);
            ThrowIfNull(user);
            string ext = fileName?.Split('.').Last();
            CheckImageExtOrThrow(ext);
            Image oldImg = RemoveImage(user);
            user.Image = GeneratePicRecord(ext, fileName);
            WriteProfilePicToDisk(user.Image, picBytes);
            Context.Images.Add(user.Image);
            Context.SetEntityState(user, EntityState.Modified);
            Context.SaveChanges();
            DeleteDiskImages(oldImg);
            return new UpdateUserPicResult
            {
                Version = user.Version,
                Image = user.Image
            };
        }


        /// <summary>
        ///     Updates a user.
        /// </summary>
        /// <param name="user"></param>
        /// <returns>Returns the new rowversion of the user.</returns>
        public byte[] UpdateUser(User user)
        {
            ThrowIfNull(user);
            user.AuthUser = null;
            user.Address = null;
            ValidateAndThrow(user, _userValidator);
            Context.Users.Attach(user);
            Context.SetEntityState(user, EntityState.Modified);
            Context.SaveChanges();
            return user.Version;
        }

        public List<int> GetDistrictsByUserId(int userId)
        {
            var districtIds = Context.Users
                .Where(u => u.Id == userId)
                .SelectMany(u => u.SchoolDistricts_DistrictId.Select(sd => sd.Id))
                .ToList();

            return districtIds;
        }


        public IQueryable<User> GetActiveUsers()
        {
            return Context.Users.Where(u => u.AuthUser.HasAccess);
        }

        private void CheckImageExtOrThrow(string ext)
        {
            if (_imageProcessingHelper.IsValidImageExt(ext))
                return;

            var vex = new ValidationException("Invalid image extension.") { Source = "Image" };
            throw vex;
        }

        private void DeleteDiskImages(Image img)
        {
            if (img == null) return;
            File.Delete(_imageProcessingHelper.PrependImageFolder(img.ImagePath));
            File.Delete(_imageProcessingHelper.PrependImageFolder(img.ThumbnailPath));
        }

        private Image GeneratePicRecord(string extension, string fileName)
        {
            extension = _documentHelper.CheckExtensionDot(extension);
            var baseName = _documentHelper.CreateDocFileBaseName();
            var pic = new Image
            {
                Name = fileName,
                ImagePath = baseName + extension,
                ThumbnailPath = baseName + "_thumb" + extension
            };
            return pic;
        }

        private void WriteProfilePicToDisk(Image image, byte[] picBytes)
        {
            byte[] squarePic = _imageProcessingHelper.CropImageToSquare(picBytes);
            byte[] mainPic = _imageProcessingHelper.ResizeImage(squarePic, ProfilePicSize, ProfilePicSize);
            byte[] thumbPic = _imageProcessingHelper.ResizeImage(squarePic, ThumnailPicSize, ThumnailPicSize);
            _imageProcessingHelper.WriteImageToFile(mainPic, _imageProcessingHelper.PrependImageFolder(image.ImagePath));
            _imageProcessingHelper.WriteImageToFile(thumbPic, _imageProcessingHelper.PrependImageFolder(image.ThumbnailPath));
        }

        private Image RemoveImage(User user)
        {
            if (user.Image == null) return null;
            Image img = user.Image.ShallowCopy();
            Context.Images.Attach(user.Image);
            Context.Images.Remove(user.Image);
            user.ImageId = null;
            user.Image = null;
            return img;
        }

        private void SendInitialUserEmail(User user, bool needsResetKey)
        {
            if (needsResetKey)
            {
                _authService.SetResetKey(user.AuthUser, 1440);
                _authService.SendNewUserResetEmail(user.AuthUser, user.Email);
            }
            else
                _authService.SendNewUserInitEmail(user.AuthUser, user.Email);
        }

        public void UpdateDistrictAssignments(int authUserId, int newRoleId, int? oldRoleId)
        {
            var user = Context.Users.SingleOrDefault(u => u.AuthUserId == authUserId);
            int userId = user.Id;
            if (newRoleId == oldRoleId) return;
            if (oldRoleId == (int)Model.Enums.UserRoles.AccountManager)
            {
                var schoolDistricts = Context.SchoolDistricts.Where(sd => sd.AccountManagerId == userId).ToList();
                foreach (var schoolDistrict in schoolDistricts)
                {
                    schoolDistrict.AccountManagerId = null;
                    schoolDistrict.AccountAssistantId = (newRoleId == (int)Model.Enums.UserRoles.AccountAssistant) ?
                        (int?)userId : null;
                    Context.SetEntityState(schoolDistrict, EntityState.Modified);
                }
            }
            else if (oldRoleId == (int)Model.Enums.UserRoles.AccountAssistant)
            {
                var schoolDistricts = Context.SchoolDistricts.Where(sd => sd.AccountAssistantId == userId).ToList();
                foreach (var schoolDistrict in schoolDistricts)
                {
                    schoolDistrict.AccountAssistantId = null;
                    schoolDistrict.AccountManagerId = (newRoleId == (int)Model.Enums.UserRoles.AccountManager) ?
                        (int?)userId : null;
                    Context.SetEntityState(schoolDistrict, EntityState.Modified);
                }
            }
            Context.SaveChanges();
        }

        public IEnumerable<User> GetByUsersRoleId(int roleId)
        {
            return Context.Users.Where(user => user.AuthUser.RoleId == roleId);
        }

    }
}
