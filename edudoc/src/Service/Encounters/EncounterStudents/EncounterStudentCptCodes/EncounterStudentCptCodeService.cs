using FluentValidation;
using Model;
using Model.Enums;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Service.Encounters
{
    public class EncounterStudentCptCodeService : BaseService, IEncounterStudentCptCodeService

    {
        private readonly IEncounterStudentLibrary _encounterStudentLibrary;
        public EncounterStudentCptCodeService(IPrimaryContext context)
            : base(context)
        {
            _encounterStudentLibrary = new EncounterStudentLibrary(context);
        }

        public IEnumerable<CptCode> GetCPTCodes(int serviceTypeId, int providerUserId)
        {
            var anonCptCodeType = Context.CptCodes
                                        .Include(code => code.CptCodeAssocations)
                                        .Where(code => !code.Archived &&
                                            code.CptCodeAssocations.Any
                                                (association => association.ProviderTitle.Providers.Any(provider => provider.ProviderUser.Id == providerUserId) &&
                                                        association.ServiceTypeId == serviceTypeId &&
                                                        !association.Archived))
                                        .Select(CptCode => new
                                        {
                                            CptCode,
                                            CptCodeAssocations = CptCode.CptCodeAssocations
                                                                .Where(association => association.ProviderTitle.Providers.Any(z => z.ProviderUser.Id == providerUserId) &&
                                                                                    association.ServiceTypeId == serviceTypeId &&
                                                                                    !association.Archived)
                                        });
            var cptCodeResponse = new List<CptCode>();
            foreach(var code in anonCptCodeType)
            {
                code.CptCode.CptCodeAssocations = code.CptCodeAssocations.ToList();
                cptCodeResponse.Add(code.CptCode);
            }

            return cptCodeResponse;
        }

        public int UpdateGroupCptCodes(int encounterId, int userId)
        {
            var serviceTypeId = Context.Encounters.Where(e => e.Id == encounterId).Select(e => e.ServiceTypeId).First();

            var provider = Context.Providers.Include(p => p.ProviderTitle).FirstOrDefault(p => p.ProviderUserId == userId);
            var groupDefaultCptCodes = Context.CptCodeAssocations
                .Where(association =>
                    association.ServiceTypeId == serviceTypeId &&
                    !association.Archived && association.Default &&
                    association.ServiceCodeId == provider.ProviderTitle.ServiceCodeId &&
                    association.ProviderTitleId == provider.ProviderTitle.Id)
                .ToList()
                .GroupBy(c => c.CptCodeId);

            var cptCodesToCreate = new List<EncounterStudentCptCode>();

            var encounter = Context.Encounters
                .Include(e => e.EncounterStudents)
                .Include(e => e.EncounterStudents.Select(es => es.EncounterStudentCptCodes))
                .FirstOrDefault(e => e.Id == encounterId);

            var encounterStudents = encounter.EncounterStudents.Where(es => !es.Archived);
            var existingCptCodes = encounterStudents.SelectMany(es => es.EncounterStudentCptCodes);

            foreach(var es in encounterStudents)
            {
                foreach (var code in groupDefaultCptCodes)
                {
                    var newCptCode = new EncounterStudentCptCode()
                    {
                        EncounterStudentId = es.Id,
                        CptCodeId = code.FirstOrDefault().CptCodeId,
                        Archived = false,
                        CreatedById = userId,
                        DateCreated = DateTime.UtcNow,
                    };
                    cptCodesToCreate.Add(newCptCode);
                }
            }

            if (existingCptCodes.Any())
                Context.EncounterStudentCptCodes.RemoveRange(existingCptCodes);
            if (cptCodesToCreate.Any())
                Context.EncounterStudentCptCodes.AddRange(cptCodesToCreate);

            return Context.SaveChanges();
        }

        public int UpdateIndividualCptCodes(int encounterId, int userId)
        {
            try
            {
                var encounter = Context.Encounters
                    .Include(e => e.Provider)
                    .Include(e => e.Provider.ProviderTitle)
                    .Include(e => e.EncounterStudents)
                    .Include(e => e.EncounterStudents.Select(es => es.EncounterStudentCptCodes))
                    .FirstOrDefault(e => e.Id == encounterId);

                var encounterStudents = encounter.EncounterStudents.Where(es => !es.Archived);
                var existingCptCodes = encounterStudents.SelectMany(es => es.EncounterStudentCptCodes);

                var cptCodesToCreate = new List<EncounterStudentCptCode>();
                foreach (var es in encounterStudents)
                {
                    var isBillable = encounter.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy;
                    var caseLoad = isBillable ? _encounterStudentLibrary.GetStudentCaseLoad((DateTime)encounter.EncounterDate, es.StudentId, encounter.Provider.ProviderTitle.ServiceCodeId) : null;
                    var cptCodes = isBillable && caseLoad != null
                            ? _encounterStudentLibrary.BuildCptCodesFromCaseLoad(caseLoad, encounter.ServiceTypeId, encounter.ProviderId, false, userId)
                            : Enumerable.Empty<EncounterStudentCptCode>();
                    var newCptCodes = cptCodes.Select(code => new EncounterStudentCptCode
                    {
                        EncounterStudentId = es.Id,
                        CptCodeId = code.CptCodeId,
                        Archived = false,
                        CreatedById = userId,
                        DateCreated = DateTime.UtcNow,
                    }).ToList();
                    cptCodesToCreate.AddRange(newCptCodes);
                }

                Context.EncounterStudentCptCodes.RemoveRange(existingCptCodes);
                Context.EncounterStudentCptCodes.AddRange(cptCodesToCreate);

                return Context.SaveChanges();
            } catch (Exception ex)
            {
                throw new ValidationException("Error updating CPT Codes.");
            }
        }
        public IEnumerable<EncounterStudentCptCode> BulkUpdate(int encounterStudentId, List<int> selectedCptCodeIds, int minutes, int userId)
        {
            var existingCptCodes = Context.EncounterStudentCptCodes.Where(cpt => cpt.EncounterStudentId == encounterStudentId && !cpt.Archived).ToList();
            var existingCptCodeIds = existingCptCodes.Select(cpt => cpt.CptCodeId).ToList();

            List<EncounterStudentCptCode> newCptCodes = new List<EncounterStudentCptCode>();
            var newCptCodeIds = selectedCptCodeIds.Where(id => !existingCptCodeIds.Contains(id));
            foreach(var cptCode in newCptCodeIds)
            {
                newCptCodes.Add(new EncounterStudentCptCode
                {
                    EncounterStudentId = encounterStudentId,
                    CptCodeId = cptCode,
                    CreatedById = userId,
                });
            }
            Context.EncounterStudentCptCodes.AddRange(newCptCodes);

            var removedCptCodes = existingCptCodes.Where(cpt => !selectedCptCodeIds.Contains(cpt.CptCodeId));
            foreach(var cptCode in removedCptCodes)
            {
                cptCode.Archived = true;
            }
            Context.SaveChanges();

            // Auto-fill CPT code minutes if left with one CPT code
            var codesToUpdate = Context.EncounterStudentCptCodes.Where(cpt => cpt.EncounterStudentId == encounterStudentId && !cpt.Archived);
            if (codesToUpdate.Count() == 1)
            {
                var code = codesToUpdate.Single();
                if (code.Minutes == null || code.Minutes != minutes)
                {
                    code.Minutes = minutes;
                    Context.SaveChanges();
                }
            }

            return Context.EncounterStudentCptCodes.Include(cpt => cpt.CptCode).Where(cpt => cpt.EncounterStudentId == encounterStudentId && !cpt.Archived);
        }
    }
}
