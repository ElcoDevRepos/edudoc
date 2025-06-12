using Service.Core.Utilities;
using Service.Core.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using Microsoft.Extensions.Configuration;
using Model;
using Model.Enums;
using Service.EDIGenerators;
using Service.HealthCareClaims;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace Service.RejectedEncounters
{
    public class RejectedEncountersService : BaseService, IRejectedEncountersService
    {
        private readonly IPrimaryContext _context;
        private readonly IHealthCareClaimService _healthCareClaimService;
        private readonly IConfigurationSettings _configurationSettings;
        private readonly IConfiguration _configuration;
        private readonly IDocumentHelper _documentHelper;
        private readonly IEmailHelper _emailHelper;

        public RejectedEncountersService(
            IPrimaryContext context,
            IEmailHelper emailHelper,
            IDocumentHelper documentHelper,
            IConfigurationSettings configurationSettings,
            IConfiguration configuration,
            IHealthCareClaimService healthCareClaimService) : base(context)
        {
            _context = context;
            _emailHelper = emailHelper;
            _documentHelper = documentHelper;
            _configurationSettings = configurationSettings;
            _configuration = configuration;
            _healthCareClaimService = healthCareClaimService;
        }

        public void GenerateRebillingHealthCareClaim(int[] rebillingIds, int userId)
        {
            var statuses = new List<EncounterStudentStatus>();
            foreach (var claim in _context.ClaimsEncounters.Include(ce => ce.EncounterStudent)
                    .Where(x => rebillingIds.Contains(x.Id)))
            {
                claim.Rebilled = true;
                claim.EncounterStudent.EncounterStatusId = (int)EncounterStatuses.READY_FOR_BILLING;
                _context.SetEntityState(claim.EncounterStudent, EntityState.Modified);

                statuses.Add(new EncounterStudentStatus() {
                    CreatedById = userId,
                    DateCreated = DateTime.Now,
                    EncounterStatusId = (int)EncounterStatuses.READY_FOR_BILLING,
                    EncounterStudentId = claim.EncounterStudentId,
                });
            }
            _context.EncounterStudentStatus.AddRange(statuses);
            _context.SaveChanges();
        }
    }
}
