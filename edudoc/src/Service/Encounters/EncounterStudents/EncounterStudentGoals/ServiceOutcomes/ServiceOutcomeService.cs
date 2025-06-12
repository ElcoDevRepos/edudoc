using BreckServiceBase.Utilities.Interfaces;
using Model;
using Service.Base;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Service.Encounters.ServiceOutcomes
{
    public class ServiceOutcomeService : CRUDBaseService, IServiceOutcomeService
    {
        public ServiceOutcomeService(IPrimaryContext context, IEmailHelper emailHelper) : base(context, new ValidationService(context, emailHelper))
        {}

        public void Update(IEnumerable<ServiceOutcome> outcomes, int userId)
        {
            var providerId = GetById<User>(userId, new[] { "Providers_ProviderUserId" }).Providers_ProviderUserId.FirstOrDefault().Id;

            var updated = outcomes.Select(n => {
                n.CreatedById = userId;
                n.DateCreated = DateTime.UtcNow;
                return n;
            });

            var csp = new Model.Core.CRUDSearchParams<ServiceOutcome> {
                order = "Id",
            };
            var existingNotes = GetAll(csp);
            BaseContext.Merge<ServiceOutcome>()
                .SetExisting(existingNotes)
                .SetUpdates(updated)
                .MergeBy((e, u) => e.Id == u.Id)
                .MapUpdatesBy((e, u) =>
                {
                    e.Notes = u.Notes;
                })
                .Merge();
            BaseContext.SaveChanges();
        }
    }
}
